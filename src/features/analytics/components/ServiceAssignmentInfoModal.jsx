import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink, X, CheckCircle } from 'lucide-react';

/**
 * Info modal to guide users to Square dashboard for service assignment
 */
const ServiceAssignmentInfoModal = ({
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">Permissions & Service Assignment Required</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Success message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">
                  {barberName} has been created successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                  Services have been created in Square.
                </p>
              </div>
            </div>

            {/* Manual step required */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-3">
                📋 One more step: Assign services & permissions to {barberName}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-500 mb-3">
                Due to Square API limitations, you need to manually assign the permissions and created services to this team member through Square's dashboard.
              </p>
              <ol className="text-sm text-blue-700 dark:text-blue-500 space-y-2 ml-4 list-decimal">
                <li>Click "Open Square Dashboard" below</li>
                <li>In the 'Overview' tab, click <strong>"Finish Setup"</strong> to add permissions</li>
                <li>Then navigate to 'Appointments' tab, Click <strong>"Add to Appointments"</strong></li>
                <li>Toogle on the 'Bookable by customers online' and assign the Services bookable online</li>
                <li>Click 'edit' the <strong>Services bookable online</strong> and select the created services</li>
                <li>Click 'edit' the <strong>Online booking profile</strong> and Setup the Online booking profile, also put the barber's instagram in the name as IG@username</li>
                <li>Check the Booking Notifications section</li>
              </ol>
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

export default ServiceAssignmentInfoModal;
