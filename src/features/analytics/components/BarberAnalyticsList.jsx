import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Toast from "@/components/common/Toast";
import { getSquareBookingUrl } from "../../conversions/constants/conversionConstants";
import { barberAnalyticsService } from "../services/barberAnalyticsService";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const BarberAnalyticsList = ({ barbers, filterParams = {} }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [loadingMoreConversions, setLoadingMoreConversions] = useState({});
    const [additionalConversions, setAdditionalConversions] = useState({});
    const [currentPage, setCurrentPage] = useState({});
    const [hasMoreConversions, setHasMoreConversions] = useState({});

    // Toggle accordion expansion for a row
    const toggleRow = (barberName) => {
        setExpandedRows((prev) => ({
            ...prev,
            [barberName]: !prev[barberName],
        }));
    };

    // Function to handle copying booking ID to clipboard
    const copyToClipboard = (text, e) => {
        e.stopPropagation(); // Prevent row expansion
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopiedId(text);
                setToastMessage(`Booking ID copied: ${text.length > 8 ? text.substring(0, 8) + "..." : text}`);
                setShowToast(true);
                // Reset the copied state after 2 seconds
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    // Function to fetch next 10 conversions for a barber
    const fetchMoreConversions = async (barberName) => {
        setLoadingMoreConversions((prev) => ({
            ...prev,
            [barberName]: true,
        }));

        try {
            const nextPage = (currentPage[barberName] || 1) + 1;

            // Use filter parameters to maintain consistency with current view
            const params = {
                ...filterParams,
                page: nextPage,
                size: 10,
            };

            const response = await barberAnalyticsService.getBarberAllConversions(barberName, params);

            if (response?.data) {
                // Accumulate new conversions with existing ones
                setAdditionalConversions((prev) => ({
                    ...prev,
                    [barberName]: [...(prev[barberName] || []), ...response.data],
                }));

                // Update current page
                setCurrentPage((prev) => ({
                    ...prev,
                    [barberName]: nextPage,
                }));

                // Update hasMore status based on API response
                setHasMoreConversions((prev) => ({
                    ...prev,
                    [barberName]: response.meta?.hasMore || false,
                }));
            }
        } catch (error) {
            console.error("Error fetching more conversions:", error);
            setToastMessage("Failed to load more conversions");
            setShowToast(true);
        } finally {
            setLoadingMoreConversions((prev) => ({
                ...prev,
                [barberName]: false,
            }));
        }
    };

    // Function to reset to initial conversions only
    const showFewerConversions = (barberName) => {
        setAdditionalConversions((prev) => ({
            ...prev,
            [barberName]: [],
        }));
        setCurrentPage((prev) => ({
            ...prev,
            [barberName]: 1,
        }));
        setHasMoreConversions((prev) => ({
            ...prev,
            [barberName]: true, // Reset to true since we know there are more
        }));
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    // Get influence color based on score
    const getInfluenceColor = (score) => {
        if (score >= 76) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        if (score >= 51) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        if (score >= 26) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    };

    if (!barbers || barbers.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No barber analytics found.</div>;
    }

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden rounded-md">
                                <table className="w-full min-w-[1024px] caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <th className="h-10 px-4 text-left align-middle font-medium">
                                                Barber Name
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Employment Type
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Total Conversions
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Total Revenue
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Avg. Order Value
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Repeat Orders
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium">
                                                Last Booking
                                            </th>
                                            <th className="h-10 px-4 text-center align-middle font-medium w-24">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {barbers.map((barber) => (
                                            <React.Fragment key={barber.barberName}>
                                                <tr className="border-b transition-colors hover:bg-muted/50 cursor-pointer">
                                                    <td className="p-4 align-middle font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                                Barber
                                                            </span>
                                                            <span className="font-semibold">{barber.barberName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        {barber.employmentType ? (
                                                            <span
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    barber.employmentType === "EMPLOYEE"
                                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                                                }`}
                                                            >
                                                                {barber.employmentType === "EMPLOYEE"
                                                                    ? "Employee"
                                                                    : "Chair Rental"}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                Not set
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className="font-bold text-lg">
                                                            {barber.totalConversions}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className="font-bold text-lg">
                                                            {formatCurrency(barber.totalRevenue)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className="font-medium">
                                                            {formatCurrency(barber.averageOrderValue)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <span className="font-bold text-lg">
                                                            {barber.repeatOrders || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">
                                                                {dayjs(barber.lastBookingDate).format("MMM DD, YYYY")}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {dayjs(barber.lastBookingDate).fromNow()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-center">
                                                        <button
                                                            onClick={() => toggleRow(barber.barberName)}
                                                            className="text-green-500 hover:text-green-400 flex items-center justify-center mx-auto"
                                                        >
                                                            {expandedRows[barber.barberName] ? (
                                                                <>
                                                                    Hide{" "}
                                                                    <ChevronUp className="w-4 h-4 ml-1 text-green-500" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    View{" "}
                                                                    <ChevronDown className="w-4 h-4 ml-1 text-green-500" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedRows[barber.barberName] && (
                                                    <tr>
                                                        <td colSpan={8} className="bg-muted/20 p-4">
                                                            <div className="mb-3">
                                                                {(() => {
                                                                    // Combine initial conversions with additional loaded conversions
                                                                    const additionalConvs =
                                                                        additionalConversions[barber.barberName] || [];
                                                                    const allConversionsForBarber = [
                                                                        ...barber.conversionDetails,
                                                                        ...additionalConvs,
                                                                    ];
                                                                    const totalShowing = allConversionsForBarber.length;
                                                                    const hasAdditionalConversions =
                                                                        additionalConvs.length > 0;

                                                                    return (
                                                                        <>
                                                                            <h4 className="font-medium text-sm mb-2">
                                                                                Conversions (showing {totalShowing}
                                                                                {barber.hasMoreConversions ||
                                                                                hasMoreConversions[barber.barberName]
                                                                                    ? ` of ${barber.totalConversionDetails}`
                                                                                    : ""}
                                                                                )
                                                                            </h4>

                                                                            {allConversionsForBarber.length > 0 ? (
                                                                                <div className="space-y-2">
                                                                                    {allConversionsForBarber.map(
                                                                                        (conversion) => (
                                                                                            <div
                                                                                                key={conversion.id}
                                                                                                className="flex items-center justify-between p-3 bg-background rounded-md border"
                                                                                            >
                                                                                                <div className="flex-1">
                                                                                                    <div className="flex items-center gap-4">
                                                                                                        <div>
                                                                                                            <div className="flex items-center gap-2">
                                                                                                                {getSquareBookingUrl(
                                                                                                                    conversion.bookingId,
                                                                                                                ) ? (
                                                                                                                    <a
                                                                                                                        href={getSquareBookingUrl(
                                                                                                                            conversion.bookingId,
                                                                                                                        )}
                                                                                                                        target="_blank"
                                                                                                                        rel="noopener noreferrer"
                                                                                                                        className="text-primary hover:text-primary/80 hover:underline flex items-center text-sm font-medium"
                                                                                                                        data-tooltip-id="booking-tooltip"
                                                                                                                        data-tooltip-content={`${conversion.bookingId} - Click to open booking in Square`}
                                                                                                                    >
                                                                                                                        Booking:{" "}
                                                                                                                        {conversion
                                                                                                                            .bookingId
                                                                                                                            .length >
                                                                                                                        8
                                                                                                                            ? conversion.bookingId.substring(
                                                                                                                                  0,
                                                                                                                                  8,
                                                                                                                              ) +
                                                                                                                              "..."
                                                                                                                            : conversion.bookingId}
                                                                                                                        <ExternalLink className="ml-1 h-3 w-3" />
                                                                                                                    </a>
                                                                                                                ) : (
                                                                                                                    <span className="text-primary text-sm font-medium">
                                                                                                                        Booking:{" "}
                                                                                                                        {conversion
                                                                                                                            .bookingId
                                                                                                                            .length >
                                                                                                                        8
                                                                                                                            ? conversion.bookingId.substring(
                                                                                                                                  0,
                                                                                                                                  8,
                                                                                                                              ) +
                                                                                                                              "..."
                                                                                                                            : conversion.bookingId}
                                                                                                                    </span>
                                                                                                                )}
                                                                                                                {conversion.bookingId &&
                                                                                                                    !conversion.bookingId.startsWith(
                                                                                                                        "booking-",
                                                                                                                    ) && (
                                                                                                                        <button
                                                                                                                            onClick={(
                                                                                                                                e,
                                                                                                                            ) =>
                                                                                                                                copyToClipboard(
                                                                                                                                    conversion.bookingId,
                                                                                                                                    e,
                                                                                                                                )
                                                                                                                            }
                                                                                                                            className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                                                                                                                            data-tooltip-id="copy-tooltip"
                                                                                                                            data-tooltip-content="Copy booking ID"
                                                                                                                        >
                                                                                                                            {copiedId ===
                                                                                                                            conversion.bookingId ? (
                                                                                                                                <Check className="h-3 w-3 text-green-500" />
                                                                                                                            ) : (
                                                                                                                                <Copy className="h-3 w-3" />
                                                                                                                            )}
                                                                                                                        </button>
                                                                                                                    )}
                                                                                                            </div>
                                                                                                            <p className="text-xs text-muted-foreground">
                                                                                                                {dayjs(
                                                                                                                    conversion.bookingDate,
                                                                                                                ).format(
                                                                                                                    "MMM DD, YYYY HH:mm",
                                                                                                                )}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <p className="text-sm font-medium">
                                                                                                                {
                                                                                                                    conversion.serviceName
                                                                                                                }
                                                                                                            </p>
                                                                                                            <p className="text-xs text-muted-foreground">
                                                                                                                Customer:{" "}
                                                                                                                {conversion.customerName ||
                                                                                                                    "Unknown"}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <span
                                                                                                                className={`px-2 py-1 text-xs rounded-full ${getInfluenceColor(conversion.adsInfluenceScore)}`}
                                                                                                            >
                                                                                                                {
                                                                                                                    conversion.adsInfluenceScore
                                                                                                                }
                                                                                                                %
                                                                                                                influence
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="text-right">
                                                                                                    <p className="font-bold">
                                                                                                        {formatCurrency(
                                                                                                            conversion.amount,
                                                                                                        )}
                                                                                                    </p>
                                                                                                    <p className="text-xs text-muted-foreground">
                                                                                                        ID:{" "}
                                                                                                        {conversion.id}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ),
                                                                                    )}

                                                                                    {/* Show "Load 10 More" button */}
                                                                                    {(barber.hasMoreConversions ||
                                                                                        hasMoreConversions[
                                                                                            barber.barberName
                                                                                        ]) && (
                                                                                        <div className="flex justify-center pt-3">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    fetchMoreConversions(
                                                                                                        barber.barberName,
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    loadingMoreConversions[
                                                                                                        barber
                                                                                                            .barberName
                                                                                                    ]
                                                                                                }
                                                                                                className="text-primary hover:text-primary/80 text-sm font-medium px-4 py-2 rounded-md border border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                                                                                            >
                                                                                                {loadingMoreConversions[
                                                                                                    barber.barberName
                                                                                                ]
                                                                                                    ? "Loading..."
                                                                                                    : `Load 10 More (${Math.max(0, barber.totalConversionDetails - totalShowing)} remaining)`}
                                                                                            </button>
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Show "Show Less" button if we have additional conversions */}
                                                                                    {hasAdditionalConversions && (
                                                                                        <div className="flex justify-center pt-2">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    showFewerConversions(
                                                                                                        barber.barberName,
                                                                                                    )
                                                                                                }
                                                                                                className="text-muted-foreground hover:text-primary text-sm font-medium px-4 py-2 rounded-md border hover:bg-muted transition-colors"
                                                                                            >
                                                                                                Show Less
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    No conversions found
                                                                                </p>
                                                                            )}
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Global tooltips */}
            <Tooltip
                id="booking-tooltip"
                style={{
                    maxWidth: "300px",
                    textAlign: "center",
                }}
            />
            <Tooltip
                id="copy-tooltip"
                style={{
                    maxWidth: "200px",
                    textAlign: "center",
                }}
            />

            {/* Toast notification for copy success */}
            <Toast isVisible={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
        </>
    );
};

export default BarberAnalyticsList;
