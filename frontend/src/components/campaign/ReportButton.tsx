import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { reportService } from '@/services/reportService';
import { useAuth } from '@/hooks/useAuth';

interface ReportButtonProps {
  campaignId: string;
  campaignTitle: string;
}

export function ReportButton({ campaignId, campaignTitle }: ReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map reason to readable text
      const reasonMap: Record<string, string> = {
        fraud: 'Penipuan',
        misleading: 'Informasi Menyesatkan',
        inappropriate: 'Konten Tidak Pantas',
        spam: 'Spam',
        other: 'Lainnya',
      };

      await reportService.submitReport({
        campaign_id: campaignId,
        reporter_email: formData.email,
        reason: reasonMap[formData.reason] || formData.reason,
        description: formData.description,
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setFormData({ reason: '', description: '', email: user?.email || '' });
      }, 2000);
    } catch (error: any) {
      console.error('Failed to submit report:', error);
      const errorMessage = error.response?.data?.error?.message || 'Gagal mengirim laporan. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Flag className="h-4 w-4 mr-2" />
        Laporkan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Laporkan Campaign</DialogTitle>
            <DialogDescription>
              Laporkan campaign "{campaignTitle}" jika Anda menemukan konten yang mencurigakan atau melanggar ketentuan.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">Laporan Terkirim</p>
              <p className="text-sm text-muted-foreground mt-2">
                Terima kasih. Laporan Anda akan ditinjau oleh tim kami.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Alasan Pelaporan</Label>
                  <Select
                    value={formData.reason}
                    onValueChange={(value) =>
                      setFormData({ ...formData, reason: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih alasan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fraud">Penipuan</SelectItem>
                      <SelectItem value="misleading">Informasi Menyesatkan</SelectItem>
                      <SelectItem value="inappropriate">Konten Tidak Pantas</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Detail</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan masalah yang Anda temukan..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Anda</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
