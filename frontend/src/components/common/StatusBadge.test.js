import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  test('renders known statuses', () => {
    render(<StatusBadge status="Near Expiry" />);

    expect(screen.getByText('Near Expiry')).toBeInTheDocument();
  });

  test('renders unknown statuses with fallback styling', () => {
    render(<StatusBadge status="Unknown" />);

    const badge = screen.getByText('Unknown');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });
});
