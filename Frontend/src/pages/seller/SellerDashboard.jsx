import { useEffect, useState } from 'react';
import axios from 'axios';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [editingId, setEditingId] = useState(null); // Track editing product ID
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Fetch products for this seller
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products/my', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId
        }
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error('❌ Error fetching products:', err.message);
    }
  };

  // Fetch orders for seller's products
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId
        }
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('❌ Error fetching orders:', err.message);
    }
  };

  // Add or update product
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update product
        await axios.put(`http://localhost:5000/products/update/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId
          }
        });
      } else {
        // Add new product
        await axios.post('http://localhost:5000/products/add', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId
          }
        });
      }
      setForm({ name: '', description: '', price: '', image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(`❌ Error ${editingId ? 'updating' : 'adding'} product:`, err.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: '', description: '', price: '', image: '' });
      }
      fetchProducts();
    } catch (err) {
      console.error('❌ Error deleting product:', err.message);
    }
  };

  // Start editing a product: fill form with data
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
  };

  // Cancel editing mode
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', image: '' });
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-3 space-x-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Your Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow p-4 rounded">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p>{product.description}</p>
            <p className="text-green-600 font-semibold">${product.price}</p>
            {product.image && <img src={product.image} alt="" className="h-32 object-cover mt-2" />}
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Orders for Your Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Order ID</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{order.order_id}</td>
                <td className="p-2">{order.buyer_name} ({order.buyer_email})</td>
                <td className="p-2">{order.product_name}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">${order.price}</td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerDashboard;
