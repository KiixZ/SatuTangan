import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid verification link');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        {status === 'loading' && (
          <>
            <CardHeader>
              <CardTitle>Verifying Email...</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </>
        )}

        {status === 'success' && (
          <>
            <CardHeader>
              <CardTitle>Email Verified!</CardTitle>
              <CardDescription>Your email has been successfully verified</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  Your account is now active. You can login to start using the platform.
                </div>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {status === 'error' && (
          <>
            <CardHeader>
              <CardTitle>Verification Failed</CardTitle>
              <CardDescription>We couldn't verify your email address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {errorMessage}
                </div>
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
