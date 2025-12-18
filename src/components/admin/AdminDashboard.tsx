import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Car,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
} from "lucide-react";
import { API_CONFIG } from "../../config/api";

interface DashboardStats {
  totalGuests: number;
  totalCheckIns: number;
  vipCount: number;
  spouseCount: number;
  associateCount: number;
  withCarCount: number;
  day1CheckIns: number;
  day2CheckIns: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    totalCheckIns: 0,
    vipCount: 0,
    spouseCount: 0,
    associateCount: 0,
    withCarCount: 0,
    day1CheckIns: 0,
    day2CheckIns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    // In dev mode, show mock data
    if (API_CONFIG.DEV_MODE) {
      setTimeout(() => {
        setStats({
          totalGuests: 156,
          totalCheckIns: 98,
          vipCount: 45,
          spouseCount: 38,
          associateCount: 73,
          withCarCount: 82,
          day1CheckIns: 62,
          day2CheckIns: 36,
        });
        setLoading(false);
      }, 1000);
    } else {
      // In production, fetch from backend
      try {
        // Add API call here when backend stats endpoint is ready
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Event Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time overview of registrations and check-ins
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Guests"
            value={stats.totalGuests}
            icon={Users}
            color="bg-indigo-600"
            subtitle="All registered guests"
          />
          <StatCard
            title="Total Check-Ins"
            value={stats.totalCheckIns}
            icon={UserCheck}
            color="bg-green-600"
            subtitle="Guests who attended"
          />
          <StatCard
            title="VIP Guests"
            value={stats.vipCount}
            icon={Users}
            color="bg-purple-600"
            subtitle="Main invited guests"
          />
          <StatCard
            title="With Vehicles"
            value={stats.withCarCount}
            icon={Car}
            color="bg-blue-600"
            subtitle="Parking required"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Guest Type Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-100">
                <PieChart className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Guest Type Breakdown
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">VIP Guests</p>
                  <p className="text-sm text-gray-600">Main invited guests</p>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {stats.vipCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Spouses</p>
                  <p className="text-sm text-gray-600">Accompanying spouses</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.spouseCount}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Associates</p>
                  <p className="text-sm text-gray-600">PAs & Associates</p>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.associateCount}
                </span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Check-Ins */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Day-by-Day Attendance
              </h2>
            </div>
            <div className="space-y-4">
              {API_CONFIG.EVENT_DAYS.map((day, index) => {
                const count =
                  index === 0 ? stats.day1CheckIns : stats.day2CheckIns;
                const percentage =
                  stats.totalGuests > 0
                    ? Math.round((count / stats.totalGuests) * 100)
                    : 0;

                return (
                  <div key={day}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{day}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentage}% attendance rate
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                View Guest List
              </span>
            </a>
            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <UserCheck className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                View Check-Ins
              </span>
            </a>
            <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Export Reports</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">📊 Dashboard Guide</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Real-time data:</strong> Stats update automatically from
              Google Sheets
            </li>
            <li>
              • <strong>Export data:</strong> Download CSV reports for analysis
            </li>
            <li>
              • <strong>Quick actions:</strong> Direct links to Google Sheets
              for detailed management
            </li>
            <li>
              • <strong>Refresh:</strong> Click refresh to get latest numbers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
