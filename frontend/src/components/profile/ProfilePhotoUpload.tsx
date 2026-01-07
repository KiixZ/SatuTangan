import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  userName?: string;
  onPhotoUpdated?: (photoUrl: string) => void;
}

export const ProfilePhotoUpload = ({
  currentPhotoUrl,
  userName = "User",
  onPhotoUpdated,
}: ProfilePhotoUploadProps) => {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, JPEG, or PNG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const result = await userService.uploadProfilePhoto(file);
      setPhotoUrl(result.profile_photo_url);

      if (onPhotoUpdated) {
        onPhotoUpdated(result.profile_photo_url);
      }

      toast({
        title: "Success",
        description: "Profile photo updated successfully.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error.response?.data?.error?.message || "Failed to upload photo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {photoUrl ? (
              <img
                src={`${API_URL}${photoUrl}`}
                alt={userName}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center border-4 border-gray-200">
                <span className="text-4xl font-semibold text-accent-foreground">
                  {getInitials()}
                </span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-lg">{userName}</h3>
            <p className="text-sm text-muted-foreground">
              {photoUrl ? "Update your profile photo" : "Add a profile photo"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="w-full max-w-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                {photoUrl ? "Change Photo" : "Upload Photo"}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Allowed: JPG, JPEG, PNG (max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
