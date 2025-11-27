import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ocean Notes brand', () => {
  render(<App />);
  const brandText = screen.getByText(/Ocean Notes/i);
  expect(brandText).toBeInTheDocument();
});
