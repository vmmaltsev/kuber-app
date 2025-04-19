import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { useCurrentTime } from '../api/useCurrentTime';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

type CurrentTimeBlockProps = Readonly<{
  api: string;
  refreshInterval: number;
}>;

export default function CurrentTimeBlock({ api, refreshInterval }: CurrentTimeBlockProps) {
  const { theme } = useContext(ThemeContext);
  const { data, error, isFetching, isLoading } = useCurrentTime(api, refreshInterval);

  if (isLoading) return <Loader />;
  if (error instanceof Error) return <ErrorMessage error={error} />;

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