import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-home"
    >
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <Link to="/admin/submissions" className="stat-card submissions-card">
          <h3>Submissions</h3>
          <p>Manage all User submissions</p>
          <div className="stat-arrow">→</div>
        </Link>
        
        <Link to="/admin/analytics" className="stat-card analytics-card">
          <h3>Analytics</h3>
          <p>View submission statistics</p>
          <div className="stat-arrow">→</div>
        </Link>
      </div>
    </motion.div>
  );
}
