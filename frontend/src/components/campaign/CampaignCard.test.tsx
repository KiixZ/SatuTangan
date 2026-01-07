import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CampaignCard } from './CampaignCard';
import type { Campaign } from '../../types/campaign';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CampaignCard component', () => {
  const mockCampaign: Campaign = {
    id: '1',
    title: 'Help Build School',
    description: 'Help us build a school for underprivileged children',
    category_id: 'cat1',
    category_name: 'Education',
    creator_id: 'user1',
    creator_name: 'John Doe',
    target_amount: 10000000,
    collected_amount: 5000000,
    thumbnail_url: 'https://example.com/image.jpg',
    start_date: new Date('2024-01-01').toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'ACTIVE',
    is_emergency: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render campaign card with basic information', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Help Build School')).toBeInTheDocument();
    expect(screen.getByText(/Help us build a school/)).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('should display emergency badge for emergency campaigns', () => {
    const emergencyCampaign = { ...mockCampaign, is_emergency: true };
    renderWithRouter(<CampaignCard campaign={emergencyCampaign} />);

    expect(screen.getByText('🚨 DARURAT')).toBeInTheDocument();
  });

  it('should not display emergency badge for non-emergency campaigns', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    expect(screen.queryByText('🚨 DARURAT')).not.toBeInTheDocument();
  });

  it('should display formatted currency amounts', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText(/Rp5\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText(/Target: Rp10\.000\.000/)).toBeInTheDocument();
  });

  it('should display progress percentage', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  it('should display days left', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText(/\d+ hari lagi/)).toBeInTheDocument();
  });

  it('should display campaign thumbnail image', () => {
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    const image = screen.getByAltText('Help Build School');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should navigate to campaign detail when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    const card = screen.getByText('Help Build School').closest('div[class*="Card"]');
    if (card) {
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('/campaigns/1');
    }
  });

  it('should navigate to campaign detail when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    const button = screen.getByRole('button', { name: /donasi sekarang/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/campaigns/1');
  });

  it('should display progress bar with correct width', () => {
    const { container } = renderWithRouter(<CampaignCard campaign={mockCampaign} />);

    const progressBar = container.querySelector('.bg-green-600');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('should cap progress bar at 100% when collected exceeds target', () => {
    const overTargetCampaign = {
      ...mockCampaign,
      collected_amount: 15000000,
    };
    const { container } = renderWithRouter(<CampaignCard campaign={overTargetCampaign} />);

    const progressBar = container.querySelector('.bg-green-600');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('should handle campaigns with zero collected amount', () => {
    const zeroCampaign = {
      ...mockCampaign,
      collected_amount: 0,
    };
    renderWithRouter(<CampaignCard campaign={zeroCampaign} />);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });
});
