import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./admin/AdminLayout";
import Orders from "./admin/pages/Orders";
import Categories from "./admin/pages/Categories";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import Products from "./admin/pages/Products";
import Dashboard from "./admin/pages/Dashboard";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import { Navigate } from "react-router-dom";
import OrderDetails from "./admin/pages/OrderDetails";
import AdminProfile from "./admin/pages/AdminProfile";

//user ui import
import Home from "./user/pages/Home";
import ProductDetail from "./user/pages/ProductDetail";
import Cart from "./user/pages/Cart";
import Checkout from "./user/pages/Checkout";
import PaymentSuccess from "./user/pages/PaymentSuccess"; 
import Navbar from "./user/components/Navbar";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import Profile from "./user/pages/Profile";
import ShowOrder from "./user/pages/showOrder";


function App() {
  // layout component that runs inside Router so useLocation works
  const AppLayout = ({ children }) => {
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith("/admin");
    return (
      <>
        {!hideNavbar && <Navbar />}
        {children}
      </>
    );
  };
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

       {/* Wrap Routes with AppLayout so it can access location */}
      <AppLayout>
      <Routes>

        {/* ui route */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="/login" element={<Login/>} />   
        <Route path="/register" element={<Register/>} />  
        <Route  path="/profile"  element={ <Profile /> }/>
        <Route path="/orders" element={<ShowOrder />} />

        

        {/* ui routes ends here */}

        {/*Admin panel routes */}

        {/* Admin Login - not protected */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
      </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
