import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { FloatingActionButton } from './FloatingActionButton';

describe('FloatingActionButton accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<FloatingActionButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('can be toggled with keyboard', async () => {
    const user = userEvent.setup();
    const { getByLabelText, queryByText } = render(<FloatingActionButton />);
    const button = getByLabelText('Toggle actions');
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(queryByText('Daily Sync')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(queryByText('Daily Sync')).not.toBeInTheDocument()
    );
  });
});
