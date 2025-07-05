import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data.product))
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

  const addToCart = () => {
    axios.post('http://localhost:5000/cart/add', {
      userId,
      productId: id,
      quantity: 1
    }).then(() => alert('Added to cart!'))
      .catch(err => console.error('Failed to add to cart', err));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <img src={product.image} alt={product.name} className="h-64 w-full object-cover mb-4" />
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-lg text-green-600">${product.price}</p>
      <p>{product.description}</p>
      <button onClick={addToCart} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;
