import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get(`http://localhost:5000/buyer/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch((err) => {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      });
  }, [id]);

  const addToCart = () => {
    if (!userId) {
      setError('Please log in to add items to your cart');
      return;
    }

    axios
      .post('http://localhost:5000/buyer/cart/add', {
        userId,
        productId: id,
        quantity: 1,
      })
      .then(() => alert('Added to cart!'))
      .catch((err) => {
        console.error('Failed to add to cart:', err);
        setError(err.response?.data?.message || 'Failed to add to cart');
      });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center text-red-500 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h1>
        <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">${product.price}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>

        <button
          onClick={addToCart}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
