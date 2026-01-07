import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type {
  AdminStats,
  DonationTrend,
} from "@admin/features/dashboard/data/dashboard-api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const xlsxUtils = XLSX.utils as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const xlsxWriteFile = XLSX.writeFile as any;

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("id-ID").format(num);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export interface ReportData {
  stats: AdminStats;
  trends?: DonationTrend[];
  generatedAt: Date;
}

export function generatePDFReport(data: ReportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Dashboard Admin", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Donation Campaign Platform", pageWidth / 2, 28, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Dibuat pada: ${formatDate(data.generatedAt)}`, pageWidth / 2, 36, {
    align: "center",
  });
  doc.setTextColor(0);

  // Line separator
  doc.setDrawColor(200);
  doc.line(14, 42, pageWidth - 14, 42);

  // Statistics Summary Section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Statistik", 14, 52);

  const statsTableData = [
    ["Total Donasi", formatCurrency(data.stats.totalDonations)],
    ["Total Donatur", formatNumber(data.stats.totalDonors)],
    ["Total Pengguna", formatNumber(data.stats.totalUsers)],
    ["Campaign Creator", formatNumber(data.stats.totalCreators)],
    ["Total Campaign", formatNumber(data.stats.totalCampaigns)],
    ["Campaign Aktif", formatNumber(data.stats.activeCampaigns)],
    ["Campaign Selesai", formatNumber(data.stats.completedCampaigns)],
    ["Verifikasi Pending", formatNumber(data.stats.pendingVerifications)],
    ["Laporan Pending", formatNumber(data.stats.pendingReports)],
    ["Total Pencairan", formatCurrency(data.stats.totalWithdrawals)],
  ];

  autoTable(doc, {
    startY: 58,
    head: [["Metrik", "Nilai"]],
    body: statsTableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 80 },
      1: { halign: "right", cellWidth: 80 },
    },
  });

  // Donation Trends Section (if available)
  if (data.trends && data.trends.length > 0) {
    const finalY = doc.lastAutoTable.finalY || 120;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Tren Donasi (30 Hari Terakhir)", 14, finalY + 15);

    const trendsTableData = data.trends.map((trend) => [
      new Date(trend.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      formatCurrency(trend.total_amount),
      formatNumber(trend.donation_count),
    ]);

    autoTable(doc, {
      startY: finalY + 22,
      head: [["Tanggal", "Total Donasi", "Jumlah Transaksi"]],
      body: trendsTableData,
      theme: "striped",
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { halign: "right", cellWidth: 60 },
        2: { halign: "center", cellWidth: 50 },
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
    doc.text(
      "Donation Campaign Platform - Admin Report",
      14,
      doc.internal.pageSize.getHeight() - 10,
    );
  }

  // Save the PDF
  const fileName = `laporan-dashboard-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}

export function generateExcelReport(data: ReportData): void {
  const workbook = xlsxUtils.book_new();

  // Sheet 1: Summary Statistics
  const summaryData = [
    ["Laporan Dashboard Admin"],
    ["Donation Campaign Platform"],
    [`Dibuat pada: ${formatDate(data.generatedAt)}`],
    [],
    ["RINGKASAN STATISTIK"],
    [],
    ["Metrik", "Nilai", "Keterangan"],
    ["Total Donasi", data.stats.totalDonations, "Total donasi terkumpul"],
    ["Total Donatur", data.stats.totalDonors, "Donatur unik"],
    ["Total Pengguna", data.stats.totalUsers, "Pengguna terdaftar"],
    ["Campaign Creator", data.stats.totalCreators, "Creator terverifikasi"],
    ["Total Campaign", data.stats.totalCampaigns, "Semua campaign"],
    [
      "Campaign Aktif",
      data.stats.activeCampaigns,
      "Campaign yang sedang berjalan",
    ],
    [
      "Campaign Selesai",
      data.stats.completedCampaigns,
      "Campaign yang telah selesai",
    ],
    ["Verifikasi Pending", data.stats.pendingVerifications, "Menunggu review"],
    [
      "Laporan Pending",
      data.stats.pendingReports,
      "Laporan yang perlu ditinjau",
    ],
    [
      "Total Pencairan",
      data.stats.totalWithdrawals,
      "Dana yang telah dicairkan",
    ],
  ];

  const summarySheet = xlsxUtils.aoa_to_sheet(summaryData);

  // Set column widths
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 35 }];

  // Merge cells for header
  summarySheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } },
  ];

  xlsxUtils.book_append_sheet(workbook, summarySheet, "Ringkasan");

  // Sheet 2: Donation Trends (if available)
  if (data.trends && data.trends.length > 0) {
    const trendsData = [
      ["TREN DONASI (30 HARI TERAKHIR)"],
      [],
      ["Tanggal", "Total Donasi (Rp)", "Jumlah Transaksi"],
      ...data.trends.map((trend) => [
        new Date(trend.date).toLocaleDateString("id-ID"),
        trend.total_amount,
        trend.donation_count,
      ]),
    ];

    const trendsSheet = xlsxUtils.aoa_to_sheet(trendsData);

    trendsSheet["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 20 }];

    trendsSheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

    xlsxUtils.book_append_sheet(workbook, trendsSheet, "Tren Donasi");
  }

  // Sheet 3: Raw Data for Analysis
  const rawData = [
    ["DATA MENTAH UNTUK ANALISIS"],
    [],
    ["Key", "Value"],
    ["total_donations", data.stats.totalDonations],
    ["total_donors", data.stats.totalDonors],
    ["total_users", data.stats.totalUsers],
    ["total_creators", data.stats.totalCreators],
    ["total_campaigns", data.stats.totalCampaigns],
    ["active_campaigns", data.stats.activeCampaigns],
    ["completed_campaigns", data.stats.completedCampaigns],
    ["pending_verifications", data.stats.pendingVerifications],
    ["pending_reports", data.stats.pendingReports],
    ["total_withdrawals", data.stats.totalWithdrawals],
    [],
    ["generated_at", data.generatedAt.toISOString()],
  ];

  const rawSheet = xlsxUtils.aoa_to_sheet(rawData);

  rawSheet["!cols"] = [{ wch: 25 }, { wch: 30 }];

  rawSheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  xlsxUtils.book_append_sheet(workbook, rawSheet, "Data Mentah");

  // Save the Excel file
  const fileName = `laporan-dashboard-${new Date().toISOString().split("T")[0]}.xlsx`;
  xlsxWriteFile(workbook, fileName);
}

export type ReportFormat = "pdf" | "excel";

export async function downloadReport(
  format: ReportFormat,
  stats: AdminStats,
  trends?: DonationTrend[],
): Promise<void> {
  const reportData: ReportData = {
    stats,
    trends,
    generatedAt: new Date(),
  };

  if (format === "pdf") {
    generatePDFReport(reportData);
  } else {
    generateExcelReport(reportData);
  }
}
