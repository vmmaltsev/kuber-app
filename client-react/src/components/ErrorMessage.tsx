export default function ErrorMessage({ error }: { error: Error }) {
  return <div className="error-message" style={{ color: 'red' }}>
    <strong>Ошибка:</strong> {error.message}
  </div>;
} 