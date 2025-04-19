type ErrorMessageProps = Readonly<{
  error: Error;
}>;

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return <div className="error-message" style={{ color: 'red' }}>
    <strong>Ошибка:</strong> {error.message}
  </div>;
} 