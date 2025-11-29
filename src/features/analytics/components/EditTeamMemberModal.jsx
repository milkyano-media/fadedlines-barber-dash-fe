import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User, Save } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

/**
 * Modal for editing team member basic information
 * Editable fields: First Name, Last Name, Email, Phone
 */
const EditTeamMemberModal = ({ isOpen, onClose, onSuccess, teamService, teamMember, existingMembers = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        givenName: "",
        familyName: "",
        emailAddress: "",
        phoneNumber: "",
    });

    // Form data state
    const [formData, setFormData] = useState({
        givenName: "",
        familyName: "",
        emailAddress: "",
        phoneNumber: "",
    });

    // Initialize form with team member data when modal opens
    useEffect(() => {
        if (isOpen && teamMember) {
            setFormData({
                givenName: teamMember.givenName || "",
                familyName: teamMember.familyName || "",
                emailAddress: teamMember.emailAddress || "",
                phoneNumber: teamMember.phoneNumber || "",
            });
            setError(null);
            setValidationErrors({
                givenName: "",
                familyName: "",
                emailAddress: "",
                phoneNumber: "",
            });
        }
    }, [isOpen, teamMember]);

    // Validation function for checking duplicates (excluding current member)
    const validateField = (field, value) => {
        let errorMessage = "";

        if (!value || typeof value !== "string" || !value.trim()) {
            return errorMessage; // Don't validate empty fields here
        }

        // Filter out current team member from duplicate checking
        const otherMembers = existingMembers.filter((m) => m.squareId !== teamMember?.squareId);

        switch (field) {
            case "givenName":
            case "familyName": {
                // Check if name combination already exists
                const fullName =
                    field === "givenName"
                        ? `${value} ${formData.familyName}`.trim()
                        : `${formData.givenName} ${value}`.trim();

                const nameExists = otherMembers.some((member) => {
                    const existingFullName = `${member.givenName} ${member.familyName}`.trim();
                    return existingFullName.toLowerCase() === fullName.toLowerCase();
                });

                if (nameExists) {
                    errorMessage = `A team member with the name "${fullName}" already exists`;
                }
                break;
            }

            case "emailAddress": {
                // Check if email already exists
                const emailExists = otherMembers.some(
                    (member) => member.emailAddress?.toLowerCase() === value.toLowerCase(),
                );

                if (emailExists) {
                    errorMessage = "This email address is already in use";
                }

                // Email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = "Please enter a valid email address";
                }
                break;
            }

            case "phoneNumber": {
                // Check if phone already exists
                const phoneExists = otherMembers.some((member) => member.phoneNumber === value);

                if (phoneExists) {
                    errorMessage = "This phone number is already in use";
                }

                // Phone format validation (basic)
                const phoneRegex = /^\+?[\d\s\-()]+$/;
                if (!phoneRegex.test(value)) {
                    errorMessage = "Please enter a valid phone number";
                }
                break;
            }

            default:
                break;
        }

        return errorMessage;
    };

    // Handle input changes with validation
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Validate the field
        const errorMessage = validateField(field, value);
        setValidationErrors((prev) => ({
            ...prev,
            [field]: errorMessage,
        }));

        // Clear general error when user types
        if (error) setError(null);
    };

    // Validate all fields
    const validateAllFields = () => {
        const errors = {
            givenName: "",
            familyName: "",
            emailAddress: "",
            phoneNumber: "",
        };

        let hasErrors = false;

        // Required field checks
        if (!formData.givenName.trim()) {
            errors.givenName = "First name is required";
            hasErrors = true;
        } else {
            errors.givenName = validateField("givenName", formData.givenName);
            if (errors.givenName) hasErrors = true;
        }

        if (!formData.familyName.trim()) {
            errors.familyName = "Last name is required";
            hasErrors = true;
        } else {
            errors.familyName = validateField("familyName", formData.familyName);
            if (errors.familyName) hasErrors = true;
        }

        if (!formData.emailAddress.trim()) {
            errors.emailAddress = "Email is required";
            hasErrors = true;
        } else {
            errors.emailAddress = validateField("emailAddress", formData.emailAddress);
            if (errors.emailAddress) hasErrors = true;
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
            hasErrors = true;
        } else {
            errors.phoneNumber = validateField("phoneNumber", formData.phoneNumber);
            if (errors.phoneNumber) hasErrors = true;
        }

        setValidationErrors(errors);
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!validateAllFields()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Call API to update team member
            await teamService.updateTeamMember(teamMember.squareId, {
                givenName: formData.givenName.trim(),
                familyName: formData.familyName.trim(),
                emailAddress: formData.emailAddress.trim(),
                phoneNumber: formData.phoneNumber.trim(),
            });

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            // Close modal
            handleClose();
        } catch (err) {
            console.error("Error updating team member:", err);
            setError(err.response?.data?.error || err.message || "Failed to update team member. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                givenName: "",
                familyName: "",
                emailAddress: "",
                phoneNumber: "",
            });
            setError(null);
            setValidationErrors({
                givenName: "",
                familyName: "",
                emailAddress: "",
                phoneNumber: "",
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">
                            Edit Team Member: {teamMember?.givenName} {teamMember?.familyName}
                        </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <ErrorMessage message={error} />}

                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={formData.givenName}
                                        onChange={(e) => handleInputChange("givenName", e.target.value)}
                                        placeholder="Enter first name"
                                        disabled={loading}
                                    />
                                    {validationErrors.givenName && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.givenName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={formData.familyName}
                                        onChange={(e) => handleInputChange("familyName", e.target.value)}
                                        placeholder="Enter last name"
                                        disabled={loading}
                                    />
                                    {validationErrors.familyName && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.familyName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={formData.emailAddress}
                                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                                    placeholder="email@example.com"
                                    disabled={loading}
                                />
                                {validationErrors.emailAddress && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.emailAddress}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    placeholder="+61400000000"
                                    disabled={loading}
                                />
                                {validationErrors.phoneNumber && (
                                    <p className="text-xs text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Include country code (e.g., +61 for Australia)
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditTeamMemberModal;
