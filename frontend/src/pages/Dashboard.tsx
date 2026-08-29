import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import SummaryCards from "../components/SummaryCards";
import DiscrepancyChart from "../components/DescrepancyChart";
import RiskChart from "../components/RiskChart";
import ResultsTable from "../components/ResultsTable";

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Protect Route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [summaryRes, breakdownRes] =
        await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/discrepancies"),
        ]);

      setSummary(summaryRes.data);
      setBreakdown(breakdownRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-bold text-slate-900">
              Revenue Reconciliation Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Real-time overview of reconciliation results
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-5
              py-2
              rounded-lg
              shadow
            "
          >
            Logout
          </button>

        </div>

        {/* Revenue Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Revenue Overview
          </h2>

          <SummaryCards summary={summary} />
        </section>

        {/* Charts */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Discrepancy Analysis
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <DiscrepancyChart data={breakdown} />
            <RiskChart data={breakdown} />
          </div>
        </section>

        {/* Results */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Investigation Queue
          </h2>

          <ResultsTable />
        </section>

      </div>
    </div>
  );
}