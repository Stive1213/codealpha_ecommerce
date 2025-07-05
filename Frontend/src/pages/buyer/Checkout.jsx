import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleCheckout = () => {
    axios.post('http://localhost:5000/orders/place', { userId })
      .then(() => {
        alert('Order placed successfully!');
        navigate('/buyer/products');
      })
      .catch(err => console.error('Checkout failed:', err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Checkout</h1>
      <p>Click below to place your order.</p>
      <button onClick={handleCheckout} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
