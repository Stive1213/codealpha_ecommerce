function SellerDashboard() {
  const mockMyProducts = [
    { id: 1, name: 'Bluetooth Speaker', stock: 12 },
    { id: 2, name: 'Phone Case', stock: 40 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <p className="mb-6 text-green-600">You can now manage your products!</p>

      <h2 className="text-xl font-semibold mb-3">Your Products</h2>
      <div className="space-y-3">
        {mockMyProducts.map(product => (
          <div key={product.id} className="bg-white border rounded-lg p-4 shadow flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboard;
