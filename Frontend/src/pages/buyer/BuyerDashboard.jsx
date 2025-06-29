function BuyerDashboard() {
  const mockProducts = [
    { id: 1, name: 'Wireless Headphones', price: '$99' },
    { id: 2, name: 'Smart Watch', price: '$150' },
    { id: 3, name: 'Laptop Stand', price: '$25' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome Buyer 👤</h1>
      <p className="mb-6 text-green-600">You're signed in successfully!</p>

      <h2 className="text-xl font-semibold mb-3">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map(product => (
          <div key={product.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-md">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-700">{product.price}</p>
            <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerDashboard;
