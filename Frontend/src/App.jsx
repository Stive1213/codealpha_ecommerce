import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Signin from './pages/auth/Signin';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import Waitlist from './pages/seller/Waitlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingSellers from './pages/admin/PendingSellers';
import AllUsers from './pages/admin/AllUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/waiting-approval" element={<Waitlist />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pending-sellers" element={<PendingSellers />} />
        <Route path="/admin/all-users" element={<AllUsers />} />

        {/* Optional default route */}
        <Route path="*" element={<Signin />} /> {/* fallback to signin instead of signup */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
