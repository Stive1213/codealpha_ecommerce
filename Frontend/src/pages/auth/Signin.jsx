import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.post('http://localhost:5000/users/login', { email, password })
      .then(res => {
        const { role } = res.data.user;

        if (role === 'buyer') navigate('/buyer/dashboard');
        else if (role === 'seller') navigate('/seller/dashboard');
        else if (role === 'pending_seller') navigate('/seller/waiting-approval');
        else if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      })
      .catch(() => {
        setError('Invalid email or password');
      });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="mb-2 w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="mb-2 w-full border p-2"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 mb-2 text-center">{error}</p>
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Sign In
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
