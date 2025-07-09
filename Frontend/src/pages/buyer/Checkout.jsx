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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Order</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <p className="mt-4 text-xl font-bold">Total: ${total.toFixed(2)}</p>

          <button
            onClick={handleCheckout}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
