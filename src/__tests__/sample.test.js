const React = require('react');
const { render, screen } = require('@testing-library/react');

function Greeting() {
  return React.createElement('h1', null, 'Hello, Jest!');
}

test('renders greeting', () => {
  render(React.createElement(Greeting));
  expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});
