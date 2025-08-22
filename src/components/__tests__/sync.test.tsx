import { render, screen } from '@testing-library/react';
import { LiveCoupleSync } from '../LiveCoupleSync';

describe('LiveCoupleSync', () => {
  it('renders', () => {
    render(<LiveCoupleSync />);
    expect(screen.getByText('Couple Sync 🔄')).toBeInTheDocument();
  });
});