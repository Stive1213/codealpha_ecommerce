import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './pages/auth/Signup';
import Signin from './pages/auth/Signin';

import SellerDashboard from './pages/seller/SellerDashboard';
import Waitlist from './pages/seller/Waitlist';

import AdminDashboard from './pages/admin/AdminDashboard';
import PendingSellers from './pages/admin/PendingSellers';
import AllUsers from './pages/admin/AllUsers';

// Buyer Pages
import ViewProducts from './pages/buyer/ViewProducts';
import ProductDetail from './pages/buyer/ProductDetail';
import ViewCart from './pages/buyer/ViewCart';
import Checkout from './pages/buyer/Checkout';

// Buyer Layout with Navbar
import BuyerLayout from './layouts/BuyerLayout'; // Create this file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Seller */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/waiting-approval" element={<Waitlist />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending-sellers" element={<PendingSellers />} />
        <Route path="/admin/all-users" element={<AllUsers />} />

        {/* Buyer routes wrapped inside BuyerLayout */}
        <Route path="/buyer" element={<BuyerLayout />}>
          <Route path="products" element={<ViewProducts />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<ViewCart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
