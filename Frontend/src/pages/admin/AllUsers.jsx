import { useEffect, useState } from 'react';
import axios from 'axios';

function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/users/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data.users))
    .catch(err => console.error('❌ Error fetching users:', err.message));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="w-full bg-white border rounded-lg overflow-hidden text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;
