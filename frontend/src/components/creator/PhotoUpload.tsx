import { useState, useEffect } from "react";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import type { CampaignPhoto } from "@/types/campaign";

import { getAssetUrl } from "@/utils/url";

interface PhotoUploadProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PhotoUpload({
  campaignId,
  campaignTitle,
  onClose,
  onSuccess,
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<CampaignPhoto[]>([]);
  // ... (omitting unchanged lines for brevity in tool call, standard replacement)
  // Actually I need to be precise. 
  // I will split this into two chunks: one for imports/constant, one for usage.

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/campaigns/${campaignId}/photos`);
      setPhotos(response.data.data);
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file count (max 10 total)
    if (photos.length + selectedFiles.length + files.length > 10) {
      setError("Maximum 10 photos allowed per campaign");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type,
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError(
        "Some files were rejected. Only JPG/PNG files under 5MB are allowed.",
      );
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one photo to upload");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      console.log("Uploading files:", selectedFiles); // Debug log

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      // Explicitly set Content-Type to undefined to let browser set boundary
      await api.post(`/campaigns/${campaignId}/photos`, formData, {
        headers: {
          "Content-Type": undefined,
        },
      });

      // Clear selected files and reload photos
      setSelectedFiles([]);
      setPreviewUrls([]);
      await loadPhotos();

      // Show success message
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await api.delete(`/campaigns/${campaignId}/photos/${photoId}`);
      await loadPhotos();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to delete photo");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage Campaign Photos</h2>
            <p className="text-sm text-gray-600 mt-1">{campaignTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG up to 5MB each. Maximum 10 photos per campaign.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Current: {photos.length} photos | Selected:{" "}
                {selectedFiles.length} photos
              </p>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Selected Photos to Upload
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveSelected(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-4 w-full"
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload ${selectedFiles.length} Photo(s)`}
              </Button>
            </div>
          )}

          {/* Existing Photos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Current Campaign Photos
            </h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No photos uploaded yet</p>
                <p className="text-sm text-gray-500">
                  Upload photos to showcase your campaign
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={getAssetUrl(photo.photo_url)}
                      alt="Campaign photo"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Prevent infinite loop
                        e.currentTarget.src = "/placeholder-campaign.jpg";
                      }}
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
