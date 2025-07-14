import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => {
        setProducts(res.data.products);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Available Products</h1>

      {error && (
        <p className="text-center text-red-500 mb-6">{error}</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 text-center">
              {product.name}
            </h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">${product.price}</p>
            <button
              onClick={() => navigate(`/buyer/product/${product.id}`)}
              className="mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewProducts;
