import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Edit2, Trash2, Save, Clock, DollarSign, Tag, Scissors } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

const ServiceManagement = ({ isOpen, onClose, teamMember, teamService }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form data for editing/adding services
    const [formData, setFormData] = useState({
        name: "",
        duration: 60,
        price: 50,
        type: "O",
    });

    // Load services when modal opens
    useEffect(() => {
        if (isOpen && teamMember && teamService) {
            fetchServices();
        }
    }, [isOpen, teamMember, teamService]);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);

        try {
            // This will be implemented when we extend teamService
            const response = await teamService.getTeamMemberServices(teamMember.squareId);
            setServices(response.data || []);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service.id);
        setFormData({
            name: service.item_data?.name || "",
            duration: service.item_data?.variations?.[0]?.item_variation_data?.service_duration / (60 * 1000) || 60,
            price: service.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount / 100 || 50,
            type: service.item_data?.name?.includes("(O)") ? "O" : "M",
        });
        setShowAddForm(false);
    };

    const handleAdd = () => {
        setEditingService(null);
        setFormData({
            name: "",
            duration: 60,
            price: 50,
            type: "O",
        });
        setShowAddForm(true);
    };

    const handleCancel = () => {
        setEditingService(null);
        setShowAddForm(false);
        setFormData({
            name: "",
            duration: 60,
            price: 50,
            type: "O",
        });
        setError(null);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError("Service name is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (editingService) {
                // Update existing service
                await teamService.updateService(editingService, {
                    name: formData.name,
                    durationMinutes: formData.duration,
                    price: formData.price,
                });
            } else {
                // Create new service
                const serviceData = {
                    barberName: `${teamMember.givenName} ${teamMember.familyName}`.trim(),
                    categoryId: null, // Will be determined by backend
                    services: [
                        {
                            name: formData.name,
                            duration: formData.duration,
                            price: formData.price,
                            type: formData.type,
                        },
                    ],
                };

                await teamService.createTeamMemberServices(teamMember.squareId, serviceData);
            }

            // Refresh services list
            await fetchServices();
            handleCancel();
        } catch (err) {
            console.error("Error saving service:", err);
            setError(err.message || "Failed to save service");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (service) => {
        if (!window.confirm("Are you sure you want to delete this service?")) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Find the service variation ID to delete
            const variationId = service.item_data?.variations?.[0]?.id;
            if (variationId) {
                await teamService.deleteService(teamMember.squareId, variationId);
                await fetchServices();
            }
        } catch (err) {
            console.error("Error deleting service:", err);
            setError(err.message || "Failed to delete service");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (priceMoney) => {
        if (!priceMoney?.amount) return "$0.00";
        return `$${(priceMoney.amount / 100).toFixed(2)}`;
    };

    const formatDuration = (durationMs) => {
        if (!durationMs) return "0 min";
        const minutes = Math.round(durationMs / (60 * 1000));
        return `${minutes} min`;
    };

    const getServiceType = (serviceName) => {
        if (serviceName?.includes("(O)")) return "O";
        if (serviceName?.includes("(M)")) return "M";
        return "?";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Scissors className="h-5 w-5" />
                        Manage Services - {teamMember?.givenName} {teamMember?.familyName}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && <ErrorMessage message={error} className="mb-4" />}

                    {/* Add Service Form */}
                    {(showAddForm || editingService) && (
                        <Card className="border-2 border-dashed border-primary">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">
                                        {editingService ? "Edit Service" : "Add New Service"}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Service Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                            placeholder={`Haircut & Beard By ${teamMember?.givenName} (Available Now) (O)`}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Duration (minutes) <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.duration}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        duration: parseInt(e.target.value),
                                                    }))
                                                }
                                                min="5"
                                                max="480"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Price ($) <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        price: parseFloat(e.target.value),
                                                    }))
                                                }
                                                min="0"
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Type <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={formData.type}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                                                }
                                                className="w-full"
                                            >
                                                <option value="O">Online (O)</option>
                                                <option value="M">Manual (M)</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={loading || !formData.name.trim()}
                                        >
                                            {loading ? (
                                                <LoadingSpinner size="small" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {editingService ? "Update" : "Create"} Service
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Services List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Current Services</h3>
                            {!showAddForm && !editingService && (
                                <Button onClick={handleAdd} className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Service
                                </Button>
                            )}
                        </div>

                        {loading && services.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : services.length === 0 ? (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <p className="text-muted-foreground">No services found for this barber.</p>
                                    <Button
                                        onClick={handleAdd}
                                        className="mt-4 flex items-center gap-2"
                                        variant="outline"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add First Service
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {services.map((service, index) => (
                                    <Card key={service.id || index} className="border border-muted">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-medium text-base">
                                                            {service.item_data?.name || "Unnamed Service"}
                                                        </h4>
                                                        <Badge
                                                            variant={
                                                                getServiceType(service.item_data?.name) === "O"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {getServiceType(service.item_data?.name)}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {formatDuration(
                                                                service.item_data?.variations?.[0]?.item_variation_data
                                                                    ?.service_duration,
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="w-4 h-4" />
                                                            {formatPrice(
                                                                service.item_data?.variations?.[0]?.item_variation_data
                                                                    ?.price_money,
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Tag className="w-4 h-4" />
                                                            ID: {service.id?.substring(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(service)}
                                                        disabled={loading || showAddForm || editingService}
                                                        className="h-8 px-3"
                                                    >
                                                        <Edit2 className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(service)}
                                                        disabled={loading || showAddForm || editingService}
                                                        className="h-8 px-3 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {services.length} service{services.length !== 1 ? "s" : ""} configured
                        </div>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ServiceManagement;
