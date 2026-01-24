import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

export default function RootLayout() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <Outlet />
    </motion.main>
  );
}
