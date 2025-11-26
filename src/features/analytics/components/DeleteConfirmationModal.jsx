import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

/**
 * Delete confirmation modal for team member deletion
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, memberName, isDeleting = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-xl">Delete Team Member</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <p className="text-sm font-medium">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-bold text-red-600 dark:text-red-400">{memberName}</span>?
                        </p>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">This action will:</p>
                            <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                                <li>
                                    Delete <strong>ALL their services</strong> from Square
                                </li>
                                <li>
                                    Delete <strong>their category</strong> from Square
                                </li>
                                <li>Deactivate them in Square</li>
                                <li>Remove completely from local database</li>
                                <li>Remove from booking availability</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">
                                ⚠️ This action cannot be undone automatically.
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                                You can restore by manually re-creating from Square Dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <LoadingSpinner size="small" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Permanently"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteConfirmationModal;
