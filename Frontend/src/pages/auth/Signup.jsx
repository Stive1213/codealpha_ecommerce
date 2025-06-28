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
      setTimeout(() => navigate('/signin'), 1500); // Delay so user can see message
    }).catch(() => {
      setServerError('Signup failed. Email may already be used.');
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="mb-2 w-full border p-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          className="mb-2 w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="password"
          className="mb-2 w-full border p-2"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <label className="block mb-4">
          <input
            type="checkbox"
            checked={requestSeller}
            onChange={(e) => setRequestSeller(e.target.checked)}
            className="mr-2"
          />
          I want to become a seller
        </label>

        {serverError && <p className="text-red-500 mb-2 text-center">{serverError}</p>}
        {successMessage && <p className="text-green-500 mb-2 text-center">{successMessage}</p>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
