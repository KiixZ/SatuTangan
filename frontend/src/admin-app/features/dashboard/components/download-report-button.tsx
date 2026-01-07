import { useState } from 'react';
import { Button } from '@admin/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@admin/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { downloadReport, type ReportFormat } from '@admin/lib/report-generator';
import { getAdminStats, getDonationTrends } from '../data/dashboard-api';
import { toast } from 'sonner';

export function DownloadReportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<ReportFormat | null>(null);

  const handleDownload = async (format: ReportFormat) => {
    setIsLoading(true);
    setLoadingFormat(format);

    try {
      // Fetch the latest data
      const [stats, trends] = await Promise.all([
        getAdminStats(),
        getDonationTrends(30),
      ]);

      // Generate and download the report
      await downloadReport(format, stats, trends);

      toast.success(
        `Laporan berhasil diunduh dalam format ${format.toUpperCase()}`,
        {
          description: 'File akan tersimpan di folder Downloads Anda.',
        }
      );
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Gagal mengunduh laporan', {
        description: 'Terjadi kesalahan saat membuat laporan. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
      setLoadingFormat(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Mengunduh...' : 'Download Laporan'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleDownload('pdf')}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          <div className="flex flex-col">
            <span>Download PDF</span>
            <span className="text-xs text-muted-foreground">
              Format dokumen untuk cetak
            </span>
          </div>
          {loadingFormat === 'pdf' && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload('excel')}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span>Download Excel</span>
            <span className="text-xs text-muted-foreground">
              Format spreadsheet untuk analisis
            </span>
          </div>
          {loadingFormat === 'excel' && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
