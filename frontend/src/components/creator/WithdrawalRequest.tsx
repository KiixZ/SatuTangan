import { useState, useEffect } from 'react';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/services/api';

interface WithdrawalRequestProps {
  campaignId: string;
  campaignTitle: string;
  collectedAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface WithdrawalInfo {
  totalWithdrawn: number;
  availableAmount: number;
  pendingAmount: number;
}

export default function WithdrawalRequest({
  campaignId,
  campaignTitle,
  collectedAmount,
  onClose,
  onSuccess,
}: WithdrawalRequestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);
  const [error, setError] = useState('');
  const [withdrawalInfo, setWithdrawalInfo] = useState<WithdrawalInfo>({
    totalWithdrawn: 0,
    availableAmount: collectedAmount,
    pendingAmount: 0,
  });
  const [formData, setFormData] = useState({
    amount: '',
    note: '',
  });

  useEffect(() => {
    fetchWithdrawalInfo();
  }, []);

  const fetchWithdrawalInfo = async () => {
    try {
      setIsFetchingInfo(true);
      const response = await api.get(`/withdrawals/campaign/${campaignId}`);
      const data = response.data.data;

      // Calculate pending amount
      const pendingWithdrawals = data.withdrawals.filter(
        (w: any) => w.status === 'PROCESSING'
      );
      const pendingAmount = pendingWithdrawals.reduce(
        (sum: number, w: any) => sum + Number(w.amount),
        0
      );

      setWithdrawalInfo({
        totalWithdrawn: data.total_withdrawn,
        availableAmount: data.available_amount - pendingAmount,
        pendingAmount,
      });
    } catch (error: any) {
      console.error('Failed to fetch withdrawal info:', error);
      // If error, use default values
      setWithdrawalInfo({
        totalWithdrawn: 0,
        availableAmount: collectedAmount,
        pendingAmount: 0,
      });
    } finally {
      setIsFetchingInfo(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.amount);

    // Validate amount
    if (isNaN(amount) || amount < 1000) {
      setError('Jumlah penarikan minimal Rp 1.000');
      return;
    }

    if (amount > withdrawalInfo.availableAmount) {
      setError(
        `Jumlah melebihi dana tersedia. Maksimal: ${formatCurrency(withdrawalInfo.availableAmount)}`
      );
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/withdrawals/request', {
        campaign_id: campaignId,
        amount,
        note: formData.note,
      });

      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.error?.details) {
        const validationErrors = err.response.data.error.details;
        const errorMessages = validationErrors
          .map((e: any) => `${e.path}: ${e.msg}`)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error?.message || 'Gagal mengajukan penarikan dana');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ajukan Penarikan Dana</h2>
              <p className="text-sm text-gray-600 mt-1">{campaignTitle}</p>
            </div>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Withdrawal Info */}
          {isFetchingInfo ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Total Dana Terkumpul:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(collectedAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-700">Sudah Dicairkan:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(withdrawalInfo.totalWithdrawn)}
                </span>
              </div>
              {withdrawalInfo.pendingAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Dalam Proses:</span>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(withdrawalInfo.pendingAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="font-semibold text-gray-900">Dana Tersedia:</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatCurrency(withdrawalInfo.availableAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Informasi Penting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Penarikan akan diproses oleh admin dalam 1-3 hari kerja</li>
                <li>Dana akan ditransfer ke rekening yang terdaftar</li>
                <li>Minimal penarikan Rp 1.000</li>
                <li>Status penarikan bisa dilihat di dashboard campaign Anda</li>
              </ul>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Jumlah Penarikan (Rp) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              required
              placeholder="Masukkan jumlah yang ingin ditarik"
              disabled={isLoading || isFetchingInfo}
              min="1000"
              step="1000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maksimal: {formatCurrency(withdrawalInfo.availableAmount)}
            </p>
          </div>

          <div>
            <Label htmlFor="note">Catatan (Opsional)</Label>
            <Textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Tambahkan catatan untuk penarikan ini (contoh: untuk pembelian kebutuhan kampanye)"
              rows={4}
              disabled={isLoading}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.note.length}/1000 karakter
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || isFetchingInfo || withdrawalInfo.availableAmount <= 0}
              className="flex-1"
            >
              {isLoading ? 'Mengirim...' : 'Ajukan Penarikan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
