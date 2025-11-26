// src/features/events/EventsPage.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RefreshCw, Search, Trash2 } from "lucide-react";
import EventList from "./components/EventList";
import { EVENT_TYPES, DATE_RANGES, SORT_OPTIONS, REGISTRATION_EVENT_TYPES } from "./constants/eventConstants";
import { useEvents } from "./hooks/useEvents";
import { useDebounce } from "@/hooks/useDebounce";
import dayjs from "dayjs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";

/**
 * Events page component - Lean version with just list, search, and delete functionality
 */
const EventsPage = () => {
    // Page state
    const [currentPage, setCurrentPage] = useState(1);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [eventType, setEventType] = useState(EVENT_TYPES.ALL);
    const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.CREATED_AT_DESC);
    const [showRegistrationEventsOnly, setShowRegistrationEventsOnly] = useState(false);

    // State for manual refresh status
    const [isRefreshing, setIsRefreshing] = useState(false);

    // State for multi-selection
    const [selectedEvents, setSelectedEvents] = useState(new Set());
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

    // Debounce the search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Calculate date range parameters
    const getDateRangeParams = () => {
        const now = dayjs();
        let startDate = null;
        let endDate = now.format();

        switch (dateRange) {
            case DATE_RANGES.LAST_7_DAYS:
                startDate = now.subtract(7, "day").format();
                break;
            case DATE_RANGES.LAST_30_DAYS:
                startDate = now.subtract(30, "day").format();
                break;
            case DATE_RANGES.LAST_90_DAYS:
                startDate = now.subtract(90, "day").format();
                break;
            case DATE_RANGES.ALL_TIME:
                // No start date for all time
                break;
            default:
                startDate = now.subtract(30, "day").format();
        }

        return { startDate, endDate };
    };

    // Parse sort options
    const getSortParams = () => {
        const [field, direction] = sortBy.split("_");
        return {
            sortBy: field,
            sortDir: direction,
        };
    };

    // Build query params
    const queryParams = {
        page: currentPage,
        size: 10,
        search: debouncedSearchTerm || undefined, // Universal search field
        eventName: eventType !== EVENT_TYPES.ALL ? eventType : undefined,
        registrationEvents: showRegistrationEventsOnly || undefined,
        ...getDateRangeParams(),
        ...getSortParams(),
    };

    // Use the events hook
    const { events, meta, loading, error, fetchEvents, deleteEvent } = useEvents(queryParams);

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Reset to page 1 on refresh
            setCurrentPage(1);
            // Clear selections on refresh
            setSelectedEvents(new Set());
            setIsSelectAll(false);

            // Refresh events list
            const refreshParams = {
                ...queryParams,
                page: 1,
            };
            await fetchEvents(refreshParams);
        } catch (err) {
            console.error("Error refreshing data:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Handle event selection
    const handleEventSelect = (eventId, isSelected) => {
        const newSelectedEvents = new Set(selectedEvents);
        if (isSelected) {
            newSelectedEvents.add(eventId);
        } else {
            newSelectedEvents.delete(eventId);
        }
        setSelectedEvents(newSelectedEvents);

        // Update select all state
        if (events && events.length > 0) {
            setIsSelectAll(newSelectedEvents.size === events.length);
        }
    };

    // Handle select all
    const handleSelectAll = (selectAll) => {
        if (selectAll && events) {
            setSelectedEvents(new Set(events.map((event) => event.id)));
        } else {
            setSelectedEvents(new Set());
        }
        setIsSelectAll(selectAll);
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedEvents.size === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedEvents.size} selected event(s)? This action cannot be undone.`,
        );

        if (!confirmed) return;

        setIsDeletingMultiple(true);
        try {
            // Delete events one by one (could be optimized with batch API)
            const deletePromises = Array.from(selectedEvents).map((eventId) => deleteEvent(eventId));
            await Promise.all(deletePromises);

            // Clear selections
            setSelectedEvents(new Set());
            setIsSelectAll(false);
        } catch (error) {
            console.error("Error deleting events:", error);
        } finally {
            setIsDeletingMultiple(false);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
        // Clear selections when search/filters change
        setSelectedEvents(new Set());
        setIsSelectAll(false);
    }, [eventType, dateRange, sortBy, debouncedSearchTerm, showRegistrationEventsOnly]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Events</h1>
                <div className="flex items-center gap-2">
                    {selectedEvents.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={isDeletingMultiple}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete {selectedEvents.size} Selected
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading || isRefreshing}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading || isRefreshing ? "animate-spin" : ""}`} />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-1/3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by sequence ID, visitor ID, session ID, or event properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>

                {/* Registration Events Filter Checkbox */}
                {/* <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="registration-events-filter"
            checked={showRegistrationEventsOnly}
            onChange={(e) => setShowRegistrationEventsOnly(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="registration-events-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Registration Events Only
          </label>
        </div> */}

                <div className="flex w-full flex-col sm:flex-row gap-4">
                    <Select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full sm:w-[200px]"
                    >
                        <option value={EVENT_TYPES.ALL}>All Event Types</option>
                        <option value={EVENT_TYPES.PAGE_VISIT}>Page Visits</option>
                        <option value={EVENT_TYPES.CREATE_BOOKING}>Bookings</option>
                        <option value={EVENT_TYPES.NEED_VERIFICATION}>Need Verification</option>
                        <option value={EVENT_TYPES.REGISTRATION_COMPLETED}>Registration Completed</option>
                        <option value={EVENT_TYPES.REGISTRATION_FAILED}>Registration Failed</option>
                    </Select>

                    <Select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full sm:w-[200px]"
                    >
                        <option value={DATE_RANGES.LAST_7_DAYS}>Last 7 days</option>
                        <option value={DATE_RANGES.LAST_30_DAYS}>Last 30 days</option>
                        <option value={DATE_RANGES.LAST_90_DAYS}>Last 90 days</option>
                        <option value={DATE_RANGES.ALL_TIME}>All time</option>
                    </Select>

                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-[200px]">
                        <option value={SORT_OPTIONS.CREATED_AT_DESC}>Newest First</option>
                        <option value={SORT_OPTIONS.CREATED_AT_ASC}>Oldest First</option>
                    </Select>
                </div>
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error.message || "Failed to load events"} onRetry={handleRefresh} />}

            {/* Events List */}
            {loading && !isRefreshing ? (
                <Card>
                    <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner size="large" />
                    </CardContent>
                </Card>
            ) : (
                <EventList
                    events={events}
                    onDeleteEvent={deleteEvent}
                    selectedEvents={selectedEvents}
                    onEventSelect={handleEventSelect}
                    onSelectAll={handleSelectAll}
                    isSelectAll={isSelectAll}
                />
            )}

            {/* Pagination and Results Info */}
            {meta && (
                <div className="space-y-4">
                    {/* Results summary */}
                    <div className="text-sm text-muted-foreground text-center">
                        {meta.totalElements === 0
                            ? "No events found"
                            : `Showing ${(currentPage - 1) * meta.size + 1}-${Math.min(currentPage * meta.size, meta.totalElements)} of ${meta.totalElements} events`}
                    </div>

                    {/* Pagination (show if more than 1 page OR when searching to show context) */}
                    {(meta.totalPages > 1 || debouncedSearchTerm) && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={setCurrentPage}
                            meta={meta}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
