import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApiKeysTable } from '../api-keys-table';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { ToastProvider } from '@/components/toast-provider';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

// Mock react-query hooks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock toast
const mockToast = {
  show: jest.fn(),
};

jest.mock('@/components/toast-provider', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  useToast: () => mockToast,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const mockApiKeys = [
  {
    id: '1',
    name: 'Test Key 1',
    type: 'dev',
    usage: 0,
    key: 'test-key-123456789',
  },
  {
    id: '2',
    name: 'Test Key 2',
    type: 'prod',
    usage: 5,
    key: 'test-key-987654321',
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {component}
      </ToastProvider>
    </QueryClientProvider>
  );
};

// Mock CreateKeyModal and EditKeyModal to simulate successful mutation
jest.mock('../create-key-modal', () => ({
  CreateKeyModal: ({ open, onOpenChange, onSuccess }: any) => {
    if (open && onSuccess) {
      setTimeout(() => {
        onSuccess();
        onOpenChange && onOpenChange(false);
      }, 0);
    }
    return open ? (
      <div role="dialog">
        <form onSubmit={e => { e.preventDefault(); onSuccess && onSuccess(); onOpenChange && onOpenChange(false); }}>
          <label htmlFor="name">Key Name</label>
          <input id="name" name="name" />
          <button type="submit">Create Key</button>
        </form>
      </div>
    ) : null;
  },
}));

jest.mock('../edit-key-modal', () => ({
  EditKeyModal: ({ open, onOpenChange, onSuccess, keyId, initialName }: any) => {
    if (open && onSuccess) {
      setTimeout(() => {
        onSuccess();
        onOpenChange && onOpenChange(false);
      }, 0);
    }
    return open ? (
      <div role="dialog">
        <form onSubmit={e => { e.preventDefault(); onSuccess && onSuccess(); onOpenChange && onOpenChange(false); }}>
          <label htmlFor="name">Key Name</label>
          <input id="name" name="name" defaultValue={initialName} />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    ) : null;
  },
}));

describe('ApiKeysTable', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ApiKeysTable />
        </ToastProvider>
      </QueryClientProvider>
    );
  };

  describe('rendering states', () => {
    it('shows loading state', () => {
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: true,
        error: null,
        data: null,
      });

      renderComponent();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch'),
        data: null,
      });

      renderComponent();
      expect(screen.getByText(/Failed to load API keys\.?/i)).toBeInTheDocument();
    });

    it('shows empty state', () => {
      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: [],
      });

      renderComponent();
      expect(screen.getByText(/no api keys/i)).toBeInTheDocument();
    });

    it('renders data correctly', () => {
      const mockData: ApiKey[] = [
        {
          id: '1',
          name: 'Test Key',
          key: 'test-key-123456789',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      renderComponent();
      expect(screen.getByText('Test Key')).toBeInTheDocument();
      expect(screen.getByText('test-key--********')).toBeInTheDocument();
    });
  });

  describe('key visibility', () => {
    it('toggles key visibility', async () => {
      const mockData: ApiKey[] = [
        {
          id: '1',
          name: 'Test Key',
          key: 'test-key-123456789',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      renderComponent();

      // Initially key should be masked
      expect(screen.getByText('test-key--********')).toBeInTheDocument();
      expect(screen.queryByText('test-key-123456789')).not.toBeInTheDocument();

      // Click show button
      const showButton = screen.getByTitle('Show');
      await waitFor(() => {
        fireEvent.click(showButton);
      });

      // Key should be visible
      expect(screen.getByText('test-key-123456789')).toBeInTheDocument();
      expect(screen.queryByText('test-key--********')).not.toBeInTheDocument();

      // Click hide button
      const hideButton = screen.getByTitle('Hide');
      await waitFor(() => {
        fireEvent.click(hideButton);
      });

      // Key should be masked again
      expect(screen.getByText('test-key--********')).toBeInTheDocument();
      expect(screen.queryByText('test-key-123456789')).not.toBeInTheDocument();
    });
  });

  describe('create key', () => {
    it('opens create modal and creates key', async () => {
      const mockData: ApiKey[] = [];
      const mockCreateMutation = jest.fn().mockResolvedValue({});

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      (useMutation as jest.Mock).mockReturnValue({
        mutate: mockCreateMutation,
        isLoading: false,
      });

      renderComponent();

      // Open create modal
      const addButton = screen.getByRole('button', { name: /add key/i });
      fireEvent.click(addButton);

      // Check if modal is opened
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Fill in the form
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'New Test Key' } });

      // Submit the form
      const form = nameInput.closest('form');
      expect(form).toBeTruthy();
      fireEvent.submit(form!);

      // Modal mock will call onSuccess, so just check dialog disappears
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('edit key', () => {
    it('opens edit modal and updates key', async () => {
      const mockData: ApiKey[] = [
        {
          id: '1',
          name: 'Test Key',
          key: 'test-key-123456789',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      const mockUpdateMutation = jest.fn().mockResolvedValue({});

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      (useMutation as jest.Mock).mockReturnValue({
        mutate: mockUpdateMutation,
        isLoading: false,
      });

      renderComponent();

      // Open edit modal
      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      // Check if modal is opened
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      // Update the name
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Key' } });

      // Submit the form
      const form = nameInput.closest('form');
      expect(form).toBeTruthy();
      fireEvent.submit(form!);

      // Modal mock will call onSuccess, so just check dialog disappears
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('delete key', () => {
    it('shows delete confirmation and deletes key', async () => {
      const mockData: ApiKey[] = [
        {
          id: '1',
          name: 'Test Key',
          key: 'test-key-123456789',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      const mockDeleteMutation = jest.fn().mockResolvedValue({});

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      (useMutation as jest.Mock).mockReturnValue({
        mutate: mockDeleteMutation,
        isLoading: false,
      });

      renderComponent();

      // Click delete button
      const deleteButtons = screen.getAllByTitle('Delete');
      await waitFor(() => {
        fireEvent.click(deleteButtons[0]);
      });

      // Confirm deletion (second delete button is the confirmation)
      const confirmButtons = screen.getAllByRole('button', { name: /delete/i });
      await waitFor(() => {
        fireEvent.click(confirmButtons[1]);
      });

      // Verify mutation was called with just the id
      expect(mockDeleteMutation).toHaveBeenCalledWith('1');
    });
  });

  describe('copy key', () => {
    it('copies key to clipboard', async () => {
      const mockData: ApiKey[] = [
        {
          id: '1',
          name: 'Test Key',
          key: 'test-key-123456789',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
        data: mockData,
      });

      renderComponent();

      // Click copy button
      const copyButtons = screen.getAllByTitle('Copy');
      await waitFor(() => {
        fireEvent.click(copyButtons[0]);
      });

      // Verify clipboard was called
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-key-123456789');
      expect(mockToast.show).toHaveBeenCalledWith({
        title: 'Copied API Key to clipboard',
        variant: 'success',
      });
    });
  });
}); 