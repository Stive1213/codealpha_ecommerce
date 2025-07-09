import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewCart() {
  const userId = localStorage.getItem('userId');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = () => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    axios.get(`http://localhost:5000/buyer/cart/${userId}`)
      .then(res => setCart(res.data.cart))
      .catch(err => {
        console.error('Failed to load cart:', err);
        setError('Failed to load cart');
      });
  };

  const removeItem = (itemId) => {
    axios.delete(`http://localhost:5000/buyer/cart/remove/${itemId}`)
      .then(() => fetchCart())
      .catch(err => {
        console.error('Failed to remove item:', err);
        setError('Failed to remove item');
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="flex gap-4 items-center">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <p className="mt-4 font-bold text-xl">Total: ${total.toFixed(2)}</p>

          <button
            onClick={goToCheckout}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewCart;
