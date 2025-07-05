import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/signin'); // Redirect to signin after logout
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/buyer/products" className="hover:underline">
          MyShop
        </Link>
      </div>

      <div className="space-x-6">
        <Link to="/buyer/products" className="hover:underline">
          Products
        </Link>
        <Link to="/buyer/cart" className="hover:underline">
          Cart
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
