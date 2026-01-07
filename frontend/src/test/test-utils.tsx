import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data helpers
export const mockCampaign = {
  id: '1',
  title: 'Test Campaign',
  description: 'Test Description',
  category_id: 'cat1',
  category_name: 'Education',
  creator_id: 'user1',
  creator_name: 'Test Creator',
  target_amount: 10000000,
  collected_amount: 5000000,
  thumbnail_url: 'https://example.com/image.jpg',
  start_date: new Date('2024-01-01').toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'ACTIVE' as const,
  is_emergency: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  full_name: 'Test User',
  phone_number: '081234567890',
  role: 'DONOR' as const,
  is_email_verified: true,
  created_at: new Date().toISOString(),
};

export const mockDonation = {
  id: '1',
  campaign_id: '1',
  user_id: '1',
  donor_name: 'Test Donor',
  donor_email: 'donor@example.com',
  donor_phone: '081234567890',
  amount: 100000,
  prayer: 'Test prayer',
  is_anonymous: false,
  status: 'SUCCESS' as const,
  midtrans_order_id: 'ORDER-123',
  created_at: new Date().toISOString(),
};
