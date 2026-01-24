import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [submissions, setSubmissions] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ DATE RANGE PICKER
  const [dateRange, setDateRange] = useState("7d"); // 7d, 30d, 90d, all
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const datePresets = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/submissions");
      const data = res.data || [];
      setSubmissions(data);

      const counts = data.reduce((acc, submission) => {
        const status = submission.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: counts.total || 0,
        pending: counts.pending || 0,
        approved: counts.approved || 0,
        rejected: counts.rejected || 0
      });

      // ✅ LINE CHART DATA - Filter by date range
      let filteredData = data;
      
      if (dateRange !== "all") {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filteredData = data.filter(sub => 
          new Date(sub.created_at) >= cutoffDate
        );
      }

      const dateCounts = filteredData.reduce((acc, submission) => {
        const date = new Date(submission.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const lineChartData = Object.entries(dateCounts)
        .map(([date, submissions]) => ({
          date,
          submissions,
          approved: Math.floor(submissions * 0.6), // Demo data
          rejected: Math.floor(submissions * 0.1)
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setLineData(lineChartData);

    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const barData = [
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' }
  ];

  const pieData = [
    { name: 'Approved', value: stats.approved, fill: '#10b981' },
    { name: 'Rejected', value: stats.rejected, fill: '#ef4444' },
    { name: 'Pending', value: stats.pending, fill: '#f59e0b' }
  ];

  const total = stats.total || 0;
  const approvedPct = total ? ((stats.approved / total) * 100).toFixed(1) : 0;
  const rejectedPct = total ? ((stats.rejected / total) * 100).toFixed(1) : 0;
  const pendingPct = total ? ((stats.pending / total) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="analytics-page"
    >
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <div className="stats-summary">
          <div className="stat-card total-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
          <div className="stat-card approved-card">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">{approvedPct}% Approved</div>
          </div>
          <div className="stat-card rejected-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">{rejectedPct}% Rejected</div>
          </div>
          <div className="stat-card pending-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">{pendingPct}% Pending</div>
          </div>
        </div>
      </div>

      {/* ✅ DATE RANGE SELECTOR */}
      <div className="date-range-selector">
        <div className="date-range-tabs">
          {datePresets.map(preset => (
            <motion.button
              key={preset.value}
              className={`date-tab ${dateRange === preset.value ? 'active' : ''}`}
              onClick={() => setDateRange(preset.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="charts-grid">
        {/* ✅ LINE CHART - EXACT MATCH */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card line-chart-card"
          whileHover={{ y: -5 }}
        >
          <div className="chart-header">
            <h3>Submission History</h3>
            <div className="chart-period">{dateRange.toUpperCase()}</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid 
                  vertical={false} 
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  interval={Math.max(0, lineData.length - 5)}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  dot={{
                    fill: '#4f46e5',
                    strokeWidth: 3,
                    r: 6
                  }}
                  activeDot={{
                    r: 10,
                    strokeWidth: 3,
                    stroke: '#4f46e5'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BAR CHART */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chart-card"
          whileHover={{ y: -5 }}
        >
          <h3>Status Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* PIE CHART */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-card"
          whileHover={{ y: -5 }}
        >
          <h3>Approval Rate</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="recent-submissions">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {submissions.slice(-5).map((submission) => (
            <div key={submission.id} className="activity-item">
              <span className={`status-badge status-${submission.status}`}>
                {submission.status}
              </span>
              <span className="activity-info">
                Submission #{submission.id} - {new Date(submission.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


