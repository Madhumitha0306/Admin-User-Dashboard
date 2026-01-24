import { useState } from "react";
import "../../styles/modals/RejectReasonModal.css";


export default function RejectReasonModal({ onSubmit, onCancel }) {
  const [reason, setReason] = useState("");

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Reject Submission</h3>
        <textarea
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn cancel" onClick={onCancel}>Cancel</button>
          <button
            className="btn danger"
            disabled={!reason.trim()}
            onClick={() => onSubmit(reason)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
