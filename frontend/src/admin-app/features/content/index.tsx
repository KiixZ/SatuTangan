import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Textarea } from "@admin/components/ui/textarea";
import { Label } from "@admin/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function Content() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/content/about-us`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContent(response.data.data.content || "");
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Content doesn't exist yet, set default
        setContent(
          `
<h1>Tentang SatuTangan</h1>
<p>SatuTangan adalah platform penggalangan dana terpercaya yang menghubungkan para donatur dengan berbagai campaign sosial yang membutuhkan bantuan.</p>

<h2>Visi Kami</h2>
<p>Menjadi platform penggalangan dana terdepan di Indonesia yang memfasilitasi perubahan positif di masyarakat melalui transparansi dan kepercayaan.</p>

<h2>Misi Kami</h2>
<ul>
  <li>Menyediakan platform yang aman dan transparan untuk penggalangan dana</li>
  <li>Membantu individu dan organisasi mencapai tujuan sosial mereka</li>
  <li>Membangun kepercayaan antara donatur dan penerima bantuan</li>
  <li>Mendorong partisipasi masyarakat dalam kegiatan sosial</li>
</ul>

<h2>Nilai-Nilai Kami</h2>
<ul>
  <li><strong>Transparansi:</strong> Kami berkomitmen untuk memberikan informasi yang jelas dan akurat tentang setiap campaign</li>
  <li><strong>Kepercayaan:</strong> Kami memverifikasi setiap campaign creator untuk memastikan keamanan donasi</li>
  <li><strong>Integritas:</strong> Kami menjalankan platform dengan standar etika tertinggi</li>
  <li><strong>Dampak:</strong> Kami fokus pada hasil nyata yang membawa perubahan positif</li>
</ul>
        `.trim(),
        );
      } else {
        toast.error("Failed to load content");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/content/about-us`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Content saved successfully");
    } catch (error) {
      console.error("Save content error:", error);
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">Edit the About Us page content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Us Content</CardTitle>
          <CardDescription>
            Edit the HTML content for the About Us page. You can use basic HTML
            tags like h1, h2, p, ul, li, strong, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">HTML Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Enter HTML content..."
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Preview the changes on the public About Us page after saving
                </p>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How the content will appear on the About Us page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export alias for backward compatibility
export { Content as ContentEditor };
