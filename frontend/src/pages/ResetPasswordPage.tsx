import { useNavigate, useParams } from 'react-router-dom';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Reset Link</h2>
          <p className="mt-2 text-gray-600">The password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="mt-4 text-primary hover:underline"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ResetPasswordForm token={token} onSuccess={handleSuccess} />
    </div>
  );
}
