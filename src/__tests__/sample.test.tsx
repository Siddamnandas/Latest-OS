import React from 'react';
import { render, screen } from '@testing-library/react';

function Greeting() {
  return <h1>Hello, Jest!</h1>;
}

describe('Basic functionality', () => {
  test('renders greeting', () => {
    render(<Greeting />);
    expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
  });

  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });
});
