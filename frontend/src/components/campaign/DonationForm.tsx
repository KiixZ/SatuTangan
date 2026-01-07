import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import donationService from "../../services/donationService";
import type { CreateDonationParams } from "../../services/donationService";
import { useAuth } from "../../hooks/useAuth";
import { loadMidtransScript } from "../../utils/midtrans";

interface DonationFormProps {
  campaignId: string;
  campaignTitle: string;
  onSuccess?: () => void;
}

export default function DonationForm({
  campaignId,
  campaignTitle,
  onSuccess,
}: DonationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    amount: "",
    prayer: "",
    isAnonymous: false,
  });

  // Auto-fill data for logged-in users
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        donorName: user.full_name || "",
        donorEmail: user.email || "",
        donorPhone: user.phone_number || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 10000) {
        throw new Error("Minimum donation amount is Rp 10,000");
      }

      const params: CreateDonationParams = {
        campaignId,
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        donorPhone: formData.donorPhone,
        amount,
        prayer: formData.prayer || undefined,
        isAnonymous: formData.isAnonymous,
      };

      const response = await donationService.createDonation(params);

      // Load Midtrans Snap script dynamically
      await loadMidtransScript();

      // Use Midtrans Snap to process payment
      if (window.snap) {
        window.snap.pay(response.token, {
          onSuccess: function () {
            if (onSuccess) onSuccess();
            window.location.href = "/donation/success";
          },
          onPending: function () {
            window.location.href = "/donation/pending";
          },
          onError: function () {
            window.location.href = "/donation/error";
          },
          onClose: function () {
            setLoading(false);
          },
        });
      } else {
        throw new Error("Midtrans Snap not loaded");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "Failed to create donation",
      );
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(parseInt(number) || 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donasi untuk {campaignTitle}</CardTitle>
        <CardDescription>
          {user
            ? `Lanjutkan donasi sebagai ${user.full_name || user.email}`
            : "Isi form di bawah untuk melanjutkan donasi"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* User info for logged-in users */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.full_name || "User"}
                  </p>
                  <p
                    className="text-sm text-gray-600 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                  {user.phone_number && (
                    <p className="text-sm text-gray-600">{user.phone_number}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Show personal info fields only for non-logged-in users */}
          {!user && (
            <>
              <div>
                <Label htmlFor="donorName">Nama Lengkap *</Label>
                <Input
                  id="donorName"
                  name="donorName"
                  type="text"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <Label htmlFor="donorEmail">Email *</Label>
                <Input
                  id="donorEmail"
                  name="donorEmail"
                  type="email"
                  value={formData.donorEmail}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="donorPhone">Nomor Telepon *</Label>
                <Input
                  id="donorPhone"
                  name="donorPhone"
                  type="tel"
                  value={formData.donorPhone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="08123456789"
                />
              </div>

              <div className="text-center py-2">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Login dulu
                  </Link>{" "}
                  untuk donasi lebih cepat
                </p>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="amount">Nominal Donasi (Rp) *</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              value={formData.amount}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Minimal Rp 10,000"
            />
            {formData.amount && (
              <p className="text-sm text-gray-500 mt-1">
                Rp {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="prayer">Doa / Ulasan (Opsional)</Label>
            <textarea
              id="prayer"
              name="prayer"
              value={formData.prayer}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tulis doa atau ulasan Anda..."
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.prayer.length}/1000 karakter
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isAnonymous"
              name="isAnonymous"
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isAnonymous" className="cursor-pointer">
              Donasi sebagai Hamba Allah (Anonim)
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Memproses..." : "Lanjutkan ke Pembayaran"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang
            berlaku
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
