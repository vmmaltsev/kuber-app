import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext } from 'react';
import './App.css';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { API_ENDPOINTS, REFRESH_INTERVAL_OPTIONS } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import CurrentTimeBlock from './components/CurrentTimeBlock';
import { useLocalStorage } from './hooks/useLocalStorage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 60_000,
    },
  },
});

function AppContent() {
  const [refreshInterval, setRefreshInterval] = useLocalStorage<number>('refresh-interval', 5000);
  const { theme } = useContext(ThemeContext);

  return (
    <main className={`main-app ${theme}`}>
      <header className="app-header">
        <h1>Hey Team! 👋</h1>
        <ThemeToggle />
      </header>

      <div className="refresh-controls">
        <label htmlFor="refresh-rate">Auto-refresh interval: </label>
        <select
          id="refresh-rate"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
        >
          {REFRESH_INTERVAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {API_ENDPOINTS.map((api) => (
        <CurrentTimeBlock key={api.url} api={api.url} refreshInterval={refreshInterval} />
      ))}
    </main>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
