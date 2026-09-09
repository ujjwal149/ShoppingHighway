import {
  Route,
  Routes,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  useAuthStore,
} from "./stores/auth.store";

import AuthModal from "./components/auth/AuthModal";

import Header from "./components/layout/Header";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

import RequireAuth from "./components/auth/RequireAuth";

import Footer from "./components/layout/Footer";

function App() {

  const customer =
  useAuthStore(
    (state) =>
      state.customer,
  );

const isInitialized =
  useAuthStore(
    (state) =>
      state.isInitialized,
  );

const initializeAuth =
  useAuthStore(
    (state) =>
      state.initializeAuth,
  );

const openAuthModal =
  useAuthStore(
    (state) =>
      state.openAuthModal,
  );

useEffect(() => {
  initializeAuth();
}, [initializeAuth]);


useEffect(() => {
  console.log(
    "AUTH MODAL CHECK:",
    {
      isInitialized,
      customer,
      dismissed:
        localStorage.getItem(
          "shoppinghighway-auth-prompt-dismissed",
        ),
    },
  );

  if (!isInitialized) {
    return;
  }

  if (customer) {
    return;
  }

  const dismissed =
    localStorage.getItem(
      "shoppinghighway-auth-prompt-dismissed",
    );

  if (!dismissed) {
    console.log(
      "OPENING AUTH MODAL",
    );

    openAuthModal(
      "login",
    );
  }
}, [
  customer,
  isInitialized,
  openAuthModal,
]);
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f1] text-[#171717]">
      <Header />
      <AuthModal />
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/products/:productId"
            element={<ProductDetailsPage />}
          />

          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />

        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;