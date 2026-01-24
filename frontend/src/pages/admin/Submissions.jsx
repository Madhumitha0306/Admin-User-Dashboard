import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import SubmissionTable from "../../components/admin/SubmissionTable";
import ExportCSVButton from "../../components/admin/ExportCSVButton";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const statusFilter = query.get("status");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/submissions");
      const rows = res.data || [];
      setSubmissions(rows);

      // Detect ALL columns dynamically (for View modal)
      const colSet = new Set();
      rows.forEach((row) => {
        try {
          const formData = JSON.parse(row.data).data || {};
          Object.values(formData).forEach((f) => {
            if (f?.name) colSet.add(f.name);
          });
        } catch {}
      });

      const detectedColumns = Array.from(colSet);
      setAllColumns(detectedColumns);

      // Visible columns ONLY for table
      setVisibleColumns([
        "Email",
        "Purpose of Visit",
        "Visit Date",
      ]);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, rejectionReason = null) => {
    try {
      setLoading(true);
      await api.patch(`/submissions/${id}/status`, {
        status,
        rejectionReason,
      });
      loadSubmissions();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions
    .filter((s) => {
      let text = s.status + " ";
      try {
        const formData = JSON.parse(s.data).data || {};
        Object.values(formData).forEach((f) => {
          text += `${f.value} `;
        });
      } catch {}
      return text.toLowerCase().includes(search.toLowerCase());
    })
    .filter((s) => {
      if (!statusFilter) return true;
      return s.status === statusFilter;
    });

  const csvData = filteredSubmissions.map((s) => {
    let row = { id: s.id, status: s.status };
    let formData = {};

    try {
      formData = JSON.parse(s.data).data || {};
    } catch {}

    allColumns.forEach((col) => {
      const field = Object.values(formData).find((f) => f.name === col);
      row[col] = field?.value ?? "-";
    });

    return row;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="submissions-page">
      <div className="compact-header">
        <h1>
          {statusFilter === "pending"
            ? `Pending Submissions (${filteredSubmissions.length})`
            : `All Submissions (${filteredSubmissions.length})`}
        </h1>

        <div className="admin-toolbar">
          <input
            type="text"
            className="compact-search"
            placeholder=" Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ExportCSVButton rows={csvData} />
        </div>
      </div>

      <SubmissionTable
        submissions={filteredSubmissions}
        columns={visibleColumns}
        allColumns={allColumns}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
