import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewCart() {
  const userId = localStorage.getItem('userId');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCart = () => {
    if (!userId) {
      setError('User not logged in.');
      return;
    }

    axios.get(`http://localhost:5000/buyer/cart/${userId}`)
      .then(res => {
        setCart(res.data.cart);
        setError('');
      })
      .catch(err => {
        console.error('Cart load error:', err);
        setError('Failed to load cart.');
      });
  };

  const removeItem = (itemId) => {
    axios.delete(`http://localhost:5000/buyer/cart/remove/${itemId}`)
      .then(() => {
        fetchCart();
        setMessage('Item removed successfully.');
        setTimeout(() => setMessage(''), 3000); // Clear after 3 seconds
      })
      .catch(err => {
        console.error('Remove item error:', err);
        setError('Failed to remove item.');
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const goToCheckout = () => {
    navigate('/buyer/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4 py-10 text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Your Cart</h1>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {message && (
          <p className="text-center text-green-500 mb-4">{message}</p>
        )}

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right mt-6">
              <p className="text-xl font-bold text-gray-800 dark:text-white">Total: ${total.toFixed(2)}</p>
              <button
                onClick={goToCheckout}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCart;
