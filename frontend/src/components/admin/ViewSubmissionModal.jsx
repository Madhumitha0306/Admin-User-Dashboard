import "../../styles/modals/ViewSubmissionModal.css";

export default function ViewSubmissionModal({ submission, columns, onClose }) {
  let formData = {};
  try {
    formData = JSON.parse(submission.data).data || {};
  } catch {}

  return (
    <div className="view-modal-backdrop" onClick={onClose}>
      <div className="view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="view-modal-header">
          <h2>Submission Details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="view-modal-body">
          {columns.map((col, index) => {
            const field = Object.values(formData).find(
              (f) => f.name === col
            );

            const value =
              field?.value ??
              field?.raw ??
              field?.label ??
              "-";

            return (
              <div key={index} className="detail-row">
                <span className="detail-label">{col}</span>
                <span className="detail-value">
                  {value === "" ? "-" : value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
