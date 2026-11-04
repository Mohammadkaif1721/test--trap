
import { useEffect, useState } from "react";
import {
  Activity,
  Code,
  Globe,
  MessageSquare,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabase";

const activityIcons = {
  code_scan: Code,
  url_scan: Globe,
  message_check: MessageSquare,
  cyber_alert: Bell,
};

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadActivity() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      setActivities(data || []);
    } catch (err) {
      setError(err.message || "Unable to load activity.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-[#DC143C]" size={28} />
              <h1 className="text-3xl font-bold">
                Recent Activity
              </h1>
            </div>
            <p className="text-gray-400">
              Track your security scans and analysis history.
            </p>
          </div>

          <button
            onClick={loadActivity}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 hover:border-[#DC143C] transition disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#101010] overflow-hidden">

          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">Activity History</h2>
            <span className="text-sm text-gray-400">
              {activities.length} records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <RefreshCw className="animate-spin mx-auto mb-3" />
              Loading activity...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              {error}
              <button
                onClick={loadActivity}
                className="block mx-auto mt-4 text-white underline"
              >
                Try again
              </button>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#DC143C]/10">
                <Activity size={28} className="text-[#DC143C]" />
              </div>
              <h3 className="text-lg font-semibold">
                No activity yet
              </h3>
              <p className="text-gray-400 mt-2">
                Your completed scans and security checks will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {activities.map((item) => {
                const Icon = activityIcons[item.activity_type] || Activity;
                const isThreat = item.status === "threat_detected";

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 px-5 py-5 hover:bg-white/[0.02] transition"
                  >
                    <div className={`rounded-lg p-3 ${
                      isThreat
                        ? "bg-red-500/10 text-red-400"
                        : "bg-[#DC143C]/10 text-[#FF526E]"
                    }`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-400 mt-1 break-words">
                        {item.description || "No additional details"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <Clock size={13} />
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <div className={`flex items-center gap-1 text-xs ${
                      isThreat ? "text-red-400" : "text-emerald-400"
                    }`}>
                      {isThreat
                        ? <AlertTriangle size={15} />
                        : <CheckCircle2 size={15} />}
                      <span className="hidden sm:inline">
                        {isThreat ? "Threat detected" : item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}
