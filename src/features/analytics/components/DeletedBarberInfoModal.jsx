import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, X, Trash2 } from 'lucide-react';

/**
 * Info modal to guide users to Square dashboard to remove deleted barber from appointments
 */
const DeletedBarberInfoModal = ({
  isOpen,
  onClose,
  barberName,
  barberSquareId
}) => {
  if (!isOpen) return null;

  const squareUrl = `https://app.squareup.com/dashboard/team/team-members/${barberSquareId}`;

  const handleOpenSquare = () => {
    window.open(squareUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(squareUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl">Manual Removal Required</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Success message */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  {barberName} has been deactivated successfully!
                </p>
                <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                  Services and category have been removed from Square.
                </p>
              </div>
            </div>

            {/* Manual step required */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-400 mb-3">
                ⚠️ Important: Remove {barberName} from Square Appointments
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-500 mb-3">
                Due to Square API limitations, the team member has been <strong>deactivated</strong> but not fully removed from Square. You need to manually remove them from the Appointments list.
              </p>
              <ol className="text-sm text-orange-700 dark:text-orange-500 space-y-2 ml-4 list-decimal">
                <li>Click "Open Square Dashboard" below</li>
                <li>Navigate to the <strong>'Appointments'</strong> tab</li>
                <li>In the 'Bookable by customers online' section, click <strong>'Edit'</strong></li>
                <li>Find <strong>{barberName}</strong> in the team members list</li>
                <li>Remove/uncheck them from the appointments list</li>
                <li>Save the changes</li>
              </ol>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 font-medium">
                💡 Note: The team member will remain in Square as "Inactive" but won't be bookable online.
              </p>
            </div>

            {/* Square dashboard link */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Square Dashboard URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background border rounded px-3 py-2 truncate">
                  {squareUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              I'll do it later
            </Button>
            <Button
              onClick={handleOpenSquare}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Square Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeletedBarberInfoModal;
