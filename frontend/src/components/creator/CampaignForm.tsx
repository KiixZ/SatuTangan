import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import { getAssetUrl } from "@/utils/url";
import type { Campaign, Category } from "@/types/campaign";

interface CampaignFormProps {
  campaign: Campaign | null;
  onClose: () => void;
  onSuccess: () => void;
}

import { useAuth } from "@/hooks/useAuth";

export default function CampaignForm({
  campaign,
  onClose,
  onSuccess,
}: CampaignFormProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: campaign?.title || "",
    description: campaign?.description || "",
    category_id: campaign?.category_id || "",
    target_amount: campaign?.target_amount?.toString() || "",
    start_date: campaign?.start_date
      ? new Date(campaign.start_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    end_date: campaign?.end_date
      ? new Date(campaign.end_date).toISOString().split("T")[0]
      : "",
    status: campaign?.status || "DRAFT",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    getAssetUrl(campaign?.thumbnail_url),
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      console.log("Categories response:", response.data);
      // Handle different possible response structures
      if (response.data.data?.categories) {
        setCategories(response.data.data.categories);
      } else if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error(
          "Unexpected categories response structure:",
          response.data,
        );
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Current User Role:", user?.role);
      console.log("Current User ID:", user?.id);

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category_id", formData.category_id);
      submitData.append("target_amount", formData.target_amount);
      submitData.append("start_date", formData.start_date);
      submitData.append("end_date", formData.end_date);
      submitData.append("status", formData.status);

      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      // Debug FormData
      console.log("Submitting FormData entries:");
      for (const pair of submitData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      if (campaign) {
        // Update existing campaign
        await api.put(`/campaigns/${campaign.id}`, submitData);
      } else {
        // Create new campaign
        await api.post("/campaigns", submitData);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Campaign creation error:", err);
      // Log full error response for debugging
      if (err.response) {
        console.log("Error Status:", err.response.status);
        console.log("Error Data:", err.response.data);
      }
      setError(err.response?.data?.error?.message || "Failed to save campaign");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </h2>
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

          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter campaign title"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your campaign in detail"
              rows={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="category_id">Category *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                handleSelectChange("category_id", value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target_amount">Target Amount (IDR) *</Label>
            <Input
              id="target_amount"
              name="target_amount"
              type="number"
              value={formData.target_amount}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Enter target amount"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail Image *</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleThumbnailChange}
              required={!campaign}
              disabled={isLoading}
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: JPG, PNG. Max size: 5MB
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Saving..."
                : campaign
                  ? "Update Campaign"
                  : "Create Campaign"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
