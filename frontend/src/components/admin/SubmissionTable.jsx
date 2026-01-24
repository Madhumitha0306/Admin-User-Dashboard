import { useState } from "react";
import { createPortal } from "react-dom";
import ConfirmActionModal from "../modals/ConfirmActionModal";
import RejectReasonModal from "../modals/RejectReasonModal";
import ViewSubmissionModal from "./ViewSubmissionModal";

export default function SubmissionTable({
  submissions,
  columns,
  allColumns,
  onUpdateStatus,
  readOnly = false,
}) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [viewSubmission, setViewSubmission] = useState(null);

  const closeModals = () => {
    setSelectedSubmission(null);
    setActionType(null);
    setViewSubmission(null);
  };

  return (
    <>
      <div className="table-container">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>Status</th>
                <th>View</th>
                {!readOnly && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {submissions.map((s) => {
                let formData = {};
                try {
                  formData = JSON.parse(s.data).data || {};
                } catch {}

                return (
                  <tr key={s.id}>
                    {columns.map((c) => {
                      const field = Object.values(formData).find(
                        (f) => f.name === c
                      );
                      return (
                        <td key={c} title={field?.value || "-"}>
                          {field?.value?.substring(0, 40) || "-"}
                        </td>
                      );
                    })}

                    <td className="status-cell">
                      <span className={`status-badge status-${s.status}`}>
                        {s.status}         
                      </span>
                      {readOnly && s.status === "rejected" && (
                        <div className="rejection-reason">
                          Reason: {s.rejection_reason || "-"}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        className="action-btn view-btn"
                        onClick={() => setViewSubmission(s)}
                      >
                        👁 View
                      </button>
                    </td>

                    {!readOnly && (
                      <td className="action-cell">
                        {s.status === "pending" ? (
                          <div className="action-buttons">
                            <button
                              className="action-btn approve-btn"
                              onClick={() => {
                                setSelectedSubmission(s);
                                setActionType("approve");
                              }}
                            >
                              Approve
                            </button>

                            <button
                              className="action-btn reject-btn"
                              onClick={() => {
                                setSelectedSubmission(s);
                                setActionType("reject");
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewSubmission &&
        createPortal(
          <ViewSubmissionModal
            submission={viewSubmission}
            columns={allColumns}
            onClose={() => setViewSubmission(null)}
          />,
          document.body
        )}

      {actionType === "approve" &&
        selectedSubmission &&
        createPortal(
          <ConfirmActionModal
            title="Approve Submission"
            message="Are you sure you want to approve this submission?"
            onCancel={closeModals}
            onConfirm={() => {
              onUpdateStatus(selectedSubmission.id, "approved");
              closeModals();
            }}
          />,
          document.body
        )}

      {actionType === "reject" &&
        selectedSubmission &&
        createPortal(
          <RejectReasonModal
            onCancel={closeModals}
            onSubmit={(reason) => {
              onUpdateStatus(selectedSubmission.id, "rejected", reason);
              closeModals();
            }}
          />,
          document.body
        )}
    </>
  );
}
