import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    axios.get(`http://localhost:5000/buyer/cart/${userId}`)
      .then(res => setCartItems(res.data.cart))
      .catch(err => {
        console.error('Failed to load cart:', err);
        setError('Failed to load cart');
      });
  }, [userId]);

  const handleCheckout = () => {
    axios.post('http://localhost:5000/buyer/orders/place', { userId })
      .then(() => {
        alert('Order placed successfully!');
        navigate('/buyer/products');
      })
      .catch(err => {
        console.error('Checkout failed:', err);
        setError('Checkout failed');
      });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold text-center mb-8">Confirm Your Order</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium text-blue-600 dark:text-blue-400">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="text-right mt-6">
              <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
