import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Constants for API endpoints
const API_URLS = {
  ALL_USERS: 'http://localhost:5000/users/all',
  PENDING_SELLERS: 'http://localhost:5000/users/pending-sellers',
};

/**
 * AdminDashboard component displays admin panel with user statistics and navigation
 * @returns {JSX.Element} Admin dashboard UI
 */
function AdminDashboard() {
  // State for users and pending sellers
  const [users, setUsers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      try {
        // Fetch all users and pending sellers concurrently
        const [usersResponse, pendingResponse] = await Promise.all([
          axios.get(API_URLS.ALL_USERS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_URLS.PENDING_SELLERS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersResponse.data.users);
        setPendingSellers(pendingResponse.data.sellers);
      } catch (error) {
        console.error('❌ Error fetching admin data:', error.message);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived state for approved sellers
  const approvedSellers = users.filter((user) => user.role === 'seller');

  // Card component for dashboard statistics
  const StatCard = ({ title, count, bgColor, icon }) => (
    <div className={`${bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
          Admin Dashboard
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.732a1 1 0 011.414 0L10 7.586l.854-.854a1 1 0 111.414 1.414L11.414 9l.854.854a1 1 0 11-1.414 1.414L10 10.414l-.854.854a1 1 0 11-1.414-1.414L8.586 9l-.854-.854a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-600 text-lg animate-pulse">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Users"
                count={users.length}
                bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                icon="👤"
              />
              <StatCard
                title="Pending Sellers"
                count={pendingSellers.length}
                bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
                icon="⏳"
              />
              <StatCard
                title="Approved Sellers"
                count={approvedSellers.length}
                bgColor="bg-gradient-to-br from-green-50 to-green-100"
                icon="✅"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/admin/pending-sellers"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Manage Pending Sellers
              </Link>
              <Link
                to="/admin/all-users"
                className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                View All Users
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;