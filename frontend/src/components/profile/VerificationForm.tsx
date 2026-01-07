import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

interface VerificationStatus {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function VerificationForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    ktp_name: "",
    ktp_number: "",
    account_number: "",
    bank_name: "",
  });
  const [files, setFiles] = useState<{
    ktp_photo: File | null;
    bank_account_photo: File | null;
    terms_photo: File | null;
  }>({
    ktp_photo: null,
    bank_account_photo: null,
    terms_photo: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await api.get("/users/verification/status");
      if (response.data.success) {
        setVerificationStatus(response.data.data.verification);
      }
    } catch (err: any) {
      // No verification found is okay
      if (err.response?.status !== 404) {
        console.error("Error fetching verification status:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [fieldName]: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate files
    if (!files.ktp_photo || !files.bank_account_photo || !files.terms_photo) {
      setError("Semua dokumen wajib diupload");
      return;
    }

    // Validate KTP number
    if (!/^[0-9]{16}$/.test(formData.ktp_number)) {
      setError("Nomor KTP harus 16 digit");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("full_name", formData.full_name);
      submitData.append("ktp_name", formData.ktp_name);
      submitData.append("ktp_number", formData.ktp_number);
      submitData.append("account_number", formData.account_number);
      submitData.append("bank_name", formData.bank_name);
      submitData.append("ktp_photo", files.ktp_photo);
      submitData.append("bank_account_photo", files.bank_account_photo);
      submitData.append("terms_photo", files.terms_photo);

      const response = await api.post("/users/verification", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess(
          "Pengajuan verifikasi berhasil dikirim. Mohon tunggu review dari admin.",
        );
        fetchVerificationStatus();
        // Reset form
        setFiles({
          ktp_photo: null,
          bank_account_photo: null,
          terms_photo: null,
        });
      }
    } catch (err: any) {
      // Handle validation errors with details
      if (err.response?.data?.error?.details) {
        const validationErrors = err.response.data.error.details;
        const errorMessages = validationErrors
          .map((e: any) => `${e.path}: ${e.msg}`)
          .join(", ");
        setError(errorMessages);
      } else {
        setError(
          err.response?.data?.error?.message ||
            "Gagal mengirim pengajuan verifikasi",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Show status if verification exists
  if (verificationStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Verifikasi Creator</CardTitle>
          <CardDescription>
            Status pengajuan verifikasi Anda sebagai campaign creator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Status
              </Label>
              <div className="mt-1">
                {verificationStatus.status === "PENDING" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Menunggu Review
                  </span>
                )}
                {verificationStatus.status === "APPROVED" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Disetujui
                  </span>
                )}
                {verificationStatus.status === "REJECTED" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Ditolak
                  </span>
                )}
              </div>
            </div>

            {verificationStatus.status === "PENDING" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Pengajuan verifikasi Anda sedang dalam proses review. Kami
                  akan mengirimkan notifikasi melalui email setelah review
                  selesai.
                </p>
              </div>
            )}

            {verificationStatus.status === "APPROVED" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Selamat! Anda telah terverifikasi sebagai campaign creator.
                  Anda sekarang dapat membuat dan mengelola campaign donasi.
                </p>
              </div>
            )}

            {verificationStatus.status === "REJECTED" && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Alasan Penolakan:
                  </p>
                  <p className="text-sm text-red-700">
                    {verificationStatus.rejection_reason ||
                      "Tidak ada alasan yang diberikan"}
                  </p>
                </div>
                <Button
                  onClick={() => setVerificationStatus(null)}
                  className="w-full"
                >
                  Ajukan Ulang Verifikasi
                </Button>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>
                Diajukan pada:{" "}
                {new Date(verificationStatus.created_at).toLocaleDateString(
                  "id-ID",
                )}
              </p>
              <p>
                Terakhir diupdate:{" "}
                {new Date(verificationStatus.updated_at).toLocaleDateString(
                  "id-ID",
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show form if no verification or rejected
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi Sebagai Campaign Creator</CardTitle>
        <CardDescription>
          Lengkapi formulir berikut untuk menjadi campaign creator terverifikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                placeholder="Nama lengkap Anda"
              />
            </div>

            <div>
              <Label htmlFor="ktp_name">Nama Sesuai KTP</Label>
              <Input
                id="ktp_name"
                name="ktp_name"
                type="text"
                value={formData.ktp_name}
                onChange={handleInputChange}
                required
                placeholder="Nama sesuai KTP"
              />
            </div>

            <div>
              <Label htmlFor="ktp_number">Nomor KTP</Label>
              <Input
                id="ktp_number"
                name="ktp_number"
                type="text"
                value={formData.ktp_number}
                onChange={handleInputChange}
                required
                placeholder="16 digit nomor KTP"
                maxLength={16}
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan 16 digit nomor KTP
              </p>
            </div>

            <div>
              <Label htmlFor="ktp_photo">Foto KTP</Label>
              <Input
                id="ktp_photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleFileChange(e, "ktp_photo")}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG (Max 5MB)
              </p>
            </div>

            <div>
              <Label htmlFor="account_number">Nomor Rekening</Label>
              <Input
                id="account_number"
                name="account_number"
                type="text"
                value={formData.account_number}
                onChange={handleInputChange}
                required
                placeholder="Nomor rekening bank"
              />
            </div>

            <div>
              <Label htmlFor="bank_name">Nama Bank</Label>
              <Input
                id="bank_name"
                name="bank_name"
                type="text"
                value={formData.bank_name}
                onChange={handleInputChange}
                required
                placeholder="Contoh: BCA, Mandiri, BNI"
              />
            </div>

            <div>
              <Label htmlFor="bank_account_photo">Foto Buku Tabungan</Label>
              <Input
                id="bank_account_photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleFileChange(e, "bank_account_photo")}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG (Max 5MB)
              </p>
            </div>

            <div>
              <Label htmlFor="terms_photo">
                Foto Persetujuan Syarat & Ketentuan
              </Label>
              <Input
                id="terms_photo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleFileChange(e, "terms_photo")}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload foto Anda memegang KTP dengan tulisan "Saya setuju dengan
                syarat dan ketentuan"
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Dengan mengajukan verifikasi, Anda menyetujui bahwa data yang
              diberikan adalah benar dan dapat diverifikasi. Proses verifikasi
              biasanya memakan waktu 1-3 hari kerja.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Mengirim..." : "Ajukan Verifikasi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
