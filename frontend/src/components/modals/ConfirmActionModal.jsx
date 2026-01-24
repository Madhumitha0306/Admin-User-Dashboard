import "../../styles/modals/ConfirmActionModal.css";

export default function ConfirmActionModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn cancel" onClick={onCancel}>Cancel</button>
          <button className="btn confirm" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}
