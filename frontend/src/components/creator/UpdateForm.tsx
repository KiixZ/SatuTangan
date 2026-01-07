import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";

interface UpdateFormProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateForm({
  campaignId,
  campaignTitle,
  onClose,
  onSuccess,
}: UpdateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);

      if (photoFile) {
        submitData.append("photo", photoFile);
      }

      await api.post(`/campaigns/${campaignId}/updates`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Failed to post update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Post Campaign Update</h2>
            <p className="text-sm text-gray-600 mt-1">{campaignTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="text-sm">
              Keep your donors informed about the progress of your campaign.
              Share updates, milestones, and how their contributions are making
              a difference.
            </p>
          </div>

          <div>
            <Label htmlFor="title">Update Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., First Week Progress Update"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Update Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Share what's happening with your campaign..."
              rows={6}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo (Optional)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handlePhotoChange}
              disabled={isLoading}
            />
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded"
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Add a photo to make your update more engaging. Accepted formats:
              JPG, PNG. Max size: 5MB
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Posting..." : "Post Update"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
