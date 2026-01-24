import { useEffect, useState } from "react";
import api from "../../services/api";
import SubmissionTable from "../../components/admin/SubmissionTable";

export default function UserDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMySubmissions();
  }, []);

  const loadMySubmissions = async () => {
    try {
      setLoading(true);

      /* ===============================
         1️⃣ Load USER submissions
      =============================== */
      const res = await api.get("/submissions/me");
      const rows = res.data || [];
      setSubmissions(rows);

      /* ===============================
         2️⃣ Load ALL columns (ADMIN SOURCE)
         👉 ensures user View == admin View
      =============================== */
      const colRes = await api.get("/submissions");
      const colRows = colRes.data || [];

      const colSet = new Set();
      colRows.forEach((row) => {
        try {
          const parsed = JSON.parse(row.data);
          const formData = parsed.data || {};
          Object.values(formData).forEach((f) => {
            if (f?.name) colSet.add(f.name);
          });
        } catch {}
      });

      setAllColumns(Array.from(colSet));

      /* ===============================
         3️⃣ Visible columns (same as admin)
      =============================== */
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

  /* ===============================
     Search filter
  =============================== */
  const filteredSubmissions = submissions.filter((s) => {
    let text = s.status + " ";
    try {
      const formData = JSON.parse(s.data).data || {};
      Object.values(formData).forEach((f) => {
        text += `${f.value} `;
      });
    } catch {}
    return text.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <h1>My Submissions</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search my submissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      {filteredSubmissions.length === 0 ? (
        <p className="no-data">No submissions found</p>
      ) : (
        <SubmissionTable
          submissions={filteredSubmissions}
          columns={visibleColumns}
          allColumns={allColumns}
          readOnly={true}   // 🔒 no Action column
        />
      )}
    </div>
  );
}
