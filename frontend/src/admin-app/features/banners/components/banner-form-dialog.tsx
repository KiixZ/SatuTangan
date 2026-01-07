import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@admin/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@admin/components/ui/form';
import { Input } from '@admin/components/ui/input';
import { Textarea } from '@admin/components/ui/textarea';
import { Button } from '@admin/components/ui/button';
import { Switch } from '@admin/components/ui/switch';
import { useBanners } from './banners-provider';
import { createBannerSchema, CreateBannerInput } from '../data/schema';
import { bannersApi } from '../data/banners-api';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function BannerFormDialog() {
  const { selectedBanner, isFormOpen, setIsFormOpen, setBanners } = useBanners();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateBannerInput>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: '',
      description: '',
      link_url: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (selectedBanner) {
      form.reset({
        title: selectedBanner.title,
        description: selectedBanner.description || '',
        link_url: selectedBanner.link_url || '',
        is_active: selectedBanner.is_active,
      });
      setImagePreview(`${API_URL}${selectedBanner.image_url}`);
    } else {
      form.reset({
        title: '',
        description: '',
        link_url: '',
        is_active: true,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [selectedBanner, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(selectedBanner ? `${API_URL}${selectedBanner.image_url}` : null);
  };

  const onSubmit = async (data: CreateBannerInput) => {
    if (!selectedBanner && !imageFile) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedBanner) {
        // Update existing banner
        const updatedBanner = await bannersApi.updateBanner(
          selectedBanner.id,
          data,
          imageFile || undefined
        );

        setBanners((prev) =>
          prev.map((b) => (b.id === selectedBanner.id ? updatedBanner : b))
        );

        toast.success('Banner updated successfully');
      } else {
        // Create new banner
        if (!imageFile) {
          toast.error('Please select an image');
          return;
        }

        const newBanner = await bannersApi.createBanner(data, imageFile);
        setBanners((prev) => [newBanner, ...prev]);
        toast.success('Banner created successfully');
      }

      setIsFormOpen(false);
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error('Banner form error:', error);
      const errorMessage =
        error.response?.data?.error?.message || 'Failed to save banner';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedBanner ? 'Edit Banner' : 'Create New Banner'}
          </DialogTitle>
          <DialogDescription>
            {selectedBanner
              ? 'Update the banner information below.'
              : 'Fill in the information to create a new banner.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>Banner Image *</FormLabel>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload image
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
                {!imagePreview && (
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG (max 5MB). Will be converted to WebP.
              </p>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter banner title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter banner description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Set whether this banner is active and visible
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedBanner ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
