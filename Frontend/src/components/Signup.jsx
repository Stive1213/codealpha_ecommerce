function Signup({ handleRegister, setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => handleRegister(name, email, password)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
        <button
          onClick={() => setView('login')}
          className="text-blue-500"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;