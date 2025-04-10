import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './App.css';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 60_000,
    },
  },
});

interface ApiResponse {
  api: string;
  currentTime: string;
  requestCount: number;
}

interface CurrentTimeProps {
  api: string;
  refreshInterval: number;
}

function CurrentTime({ api, refreshInterval }: CurrentTimeProps) {
  const { theme } = useContext(ThemeContext);

  const { data, error, isFetching, isLoading } = useQuery<ApiResponse>({
    queryKey: [api],
    queryFn: () => axios.get(api).then((res) => res.data),
    refetchInterval: refreshInterval,
  });

  if (isLoading) return <p>Loading {api}...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <section className={`current-time-block ${theme}`}>
      <hr />
      <p><strong>API:</strong> {data?.api}</p>
      <p><strong>Time from DB:</strong> {data?.currentTime}</p>
      <p><strong>Request Count:</strong> {data?.requestCount}</p>
      {isFetching && <small className="updating-indicator">Updating...</small>}
    </section>
  );
}

function AppContent() {
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    const saved = localStorage.getItem('refresh-interval');
    return saved ? parseInt(saved, 10) : 5000;
  });

  useEffect(() => {
    localStorage.setItem('refresh-interval', refreshInterval.toString());
  }, [refreshInterval]);

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
          <option value="1000">1s</option>
          <option value="5000">5s</option>
          <option value="10000">10s</option>
          <option value="30000">30s</option>
          <option value="60000">1 min</option>
        </select>
      </div>

      <CurrentTime api="/api/golang/" refreshInterval={refreshInterval} />
      <CurrentTime api="/api/node/" refreshInterval={refreshInterval} />
    </main>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
