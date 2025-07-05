import { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
  const userId = localStorage.getItem('userId');
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    axios.get(`http://localhost:5000/cart/${userId}`)
      .then(res => setCart(res.data.cart))
      .catch(err => console.error('Failed to load cart:', err));
  };

  const removeItem = (itemId) => {
    axios.delete(`http://localhost:5000/cart/remove/${itemId}`)
      .then(() => fetchCart());
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="flex gap-4 items-center">
                <p>${item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <p className="mt-4 font-bold text-xl">Total: ${total}</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
