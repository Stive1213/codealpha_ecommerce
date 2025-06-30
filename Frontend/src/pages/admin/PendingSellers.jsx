import { useEffect, useState } from 'react';
import axios from 'axios';

function PendingSellers() {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/users/pending-sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPending(res.data.sellers);
    } catch (err) {
      console.error('❌ Error fetching pending sellers:', err.message);
    }
  };

  const approveSeller = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/users/approve-seller/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPending(); // Refresh list
    } catch (err) {
      console.error('❌ Error approving seller:', err.message);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Sellers</h1>
      {pending.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="w-full bg-white border rounded-lg overflow-hidden text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => approveSeller(user.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingSellers;
