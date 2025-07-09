import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestSeller, setRequestSeller] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Enter a valid email';
    }
    if (password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    }
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    axios.post('http://localhost:5000/users', {
      name,
      email,
      password,
      requestSeller
    }).then(() => {
      setSuccessMessage('Registered successfully! Redirecting...');
      setTimeout(() => navigate('/signin'), 1500); 
    }).catch(() => {
      setServerError('Signup failed. Email may already be used.');
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={requestSeller}
              onChange={(e) => setRequestSeller(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <span>I want to become a seller</span>
          </label>

          {serverError && <p className="text-red-500 text-center text-sm">{serverError}</p>}
          {successMessage && <p className="text-green-500 text-center text-sm">{successMessage}</p>}

          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
