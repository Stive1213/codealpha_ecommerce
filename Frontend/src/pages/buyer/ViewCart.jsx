import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ViewCart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5000/cart/${userId}`)
      .then(res => setItems(res.data.cart))
      .catch(err => console.error('Error loading cart:', err.message));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          <ul className="space-y-3 mb-4">
            {items.map(item => (
              <li key={item.id} className="bg-white p-4 rounded shadow flex justify-between">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="text-green-600 font-semibold">${item.price * item.quantity}</p>
              </li>
            ))}
          </ul>
          <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
          <Link to="/buyer/checkout" className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}

export default ViewCart;
