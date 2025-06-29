function AdminDashboard() {
  const mockUsers = [
    { id: 1, name: 'Alice', role: 'buyer' },
    { id: 2, name: 'Bob', role: 'seller', approved: false },
    { id: 3, name: 'Charlie', role: 'seller', approved: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">3</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Pending Sellers</h2>
          <p className="text-2xl">1</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Approved Sellers</h2>
          <p className="text-2xl">1</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
      <table className="w-full bg-white border rounded-lg overflow-hidden text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Approval</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(user => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2 capitalize">{user.role}</td>
              <td className="px-4 py-2">
                {user.role === 'seller' ? (user.approved ? '✅ Approved' : '⏳ Pending') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
