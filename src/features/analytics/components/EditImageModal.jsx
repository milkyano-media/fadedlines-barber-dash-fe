import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const EditImageModal = ({ isOpen, onClose, onSuccess, teamService, barber }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle image file selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload PNG, JPG, or JPEG only.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB.');
      return;
    }

    // Revoke previous preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
    setError(null);
  };

  /**
   * Remove selected image preview
   */
  const handleRemovePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);
  };

  /**
   * Upload/update profile image
   */
  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await teamService.updateProfileImage(barber.squareId, selectedImage);
      console.log('✅ Image updated successfully');
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Error updating image:', err);
      setError(err.response?.data?.error || 'Failed to update image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete profile image
   */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this profile image?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await teamService.deleteProfileImage(barber.squareId);
      console.log('✅ Image deleted successfully');
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.response?.data?.error || 'Failed to delete image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clean up and close modal
   */
  const handleClose = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen || !barber) return null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005';
  const currentImageUrl = barber.details?.profileImageUrl
    ? `${API_BASE_URL}${barber.details.profileImageUrl}`
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Edit Profile Image - {barber.givenName} {barber.familyName}
            </CardTitle>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <ErrorMessage message={error} />}

          {/* Current Image */}
          {currentImageUrl && !imagePreview && (
            <div>
              <label className="text-sm font-medium mb-2 block">Current Image</label>
              <div className="relative inline-block">
                <img
                  src={currentImageUrl}
                  alt={`${barber.givenName} ${barber.familyName}`}
                  className="w-32 h-32 object-cover rounded-lg border-2 border-muted"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Image Preview or Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {imagePreview ? 'New Image Preview' : 'Select New Image'}
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
                />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  disabled={loading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                  id="edit-image-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="edit-image-upload"
                  className={`cursor-pointer flex flex-col items-center space-y-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload new image
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB (min 300x300px)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpload}
              disabled={loading || !selectedImage}
              className="flex-1"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </>
              )}
            </Button>

            {currentImageUrl && (
              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="destructive"
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditImageModal;
