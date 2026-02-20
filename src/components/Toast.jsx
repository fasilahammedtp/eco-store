import "./Toast.css";

function Toast({ message, show, type }) {
  if (!show) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}
export default Toast;