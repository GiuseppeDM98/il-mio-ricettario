import { render, screen } from '@testing-library/react';
import { Header } from './header';
import { useAuth } from '@/lib/hooks/useAuth';

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Header', () => {
  const mockProps = {
    sidebarOpen: false,
    onSidebarToggle: jest.fn(),
  };

  it('renders the header with user information when a user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        displayName: 'Test User',
      },
      signOut: jest.fn(),
    });

    render(<Header {...mockProps} />);

    expect(screen.getByText('Il Mio Ricettario')).toBeInTheDocument();
    expect(screen.getByText('Ciao, Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders the header without user information when no user is logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      signOut: jest.fn(),
    });

    render(<Header {...mockProps} />);

    expect(screen.getByText('Il Mio Ricettario')).toBeInTheDocument();
    expect(screen.queryByText('Ciao,')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});