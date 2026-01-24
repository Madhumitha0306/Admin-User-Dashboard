import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/report-export-dropdown.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import "../../styles/_reportExport.css";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function AdminReportExport() {
  const [filters, setFilters] = useState({
    date: "",
    month: "",
    year: "",
    status: "all"
  });

  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadReport();
  }, [filters]);

  const loadYears = async () => {
    const res = await api.get("/submissions");
    const uniqueYears = [
      ...new Set(
        res.data.map(r => new Date(r.created_at).getFullYear())
      ),
    ].sort((a, b) => b - a);
    setYears(uniqueYears);
  };

  const loadReport = async () => {
    const res = await api.get("/submissions/report", { params: filters });
    setData(res.data);
    setNoData(res.data.length === 0);
  };

  const exportCSV = async () => {
    const res = await api.get("/submissions/report/export", {
      params: filters,
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered-report.csv";
    a.click();
  };

  return (
    <div className="report-export-page">
      <h1>Report Export</h1>

      <div className="filters">
        <select onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}>
          <option value="">Date</option>
          {[...Array(31)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <select onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}>
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <select onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
          <option value="">Year</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>

        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="chart-card">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#82cbdcff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              strokeWidth={4}
              dot={{ r: 6, fill: "#22d3ee" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence>
        {noData && (
          <motion.div
            className="no-data-popup"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            No data available for selected filters
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
