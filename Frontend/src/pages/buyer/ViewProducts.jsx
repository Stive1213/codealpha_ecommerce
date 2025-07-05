import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-2" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>${product.price}</p>
            <button
              onClick={() => navigate(`/buyer/product/${product.id}`)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewProducts;
