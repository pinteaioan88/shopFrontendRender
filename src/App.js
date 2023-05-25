import React from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap"
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceorderScreen from "./screens/PlaceorderScreen";
import OrderScreen from "./screens/OrderScreen";
import { useEffect, useState } from 'react';
import axios from 'axios'
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';

const App = () => {
  const [clientID, setClientID] = useState('');
 
  useEffect(() => {
    const getClientId = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
 
      setClientID(clientId);
      console.log(clientID);
    };
 
    if (!window.paypal) {
      getClientId();
    }
  }, [clientID]);
    return (
     <>
      {clientID && (
        <PayPalScriptProvider options={{ 'client-id': clientID }}>
          <Router> 
            <Header /> 
              <main className="py-3">
                  <Container>
                    <Routes>
                      <Route exact path="/" element={<HomeScreen />} />
                      <Route exact path="/page/:pageNumber" element={<HomeScreen />} />
                      <Route exact path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
                      <Route exact path="/search/:keyword" element={<HomeScreen />} />
                      <Route path="/login" element={<LoginScreen />} />
                      <Route path="/order/:id" element={<OrderScreen />} />
                      <Route path="/placeorder" element={<PlaceorderScreen />} />
                      <Route path="/payment" element={<PaymentScreen />} />
                      <Route path="/shipping" element={<ShippingScreen />} />
                      <Route path="/register" element={<RegisterScreen />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/product/:id" element={<ProductScreen />} />
                      <Route path="/cart/:id?" element={<CartScreen />} />
                      <Route path="/admin/userlist" element={<UserListScreen />} />
                      <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
                      <Route exact path="/admin/productlist" element={<ProductListScreen />} />
                      <Route exact path="/admin/productlist/:pageNumber" element={<ProductListScreen />} />
                      <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                      <Route path="/admin/orderlist" element={<OrderListScreen />} />
                    </Routes>
                  </Container>
              </main>
            <Footer/>
          </Router>
      </PayPalScriptProvider>
      )}
      </>
    )
}

export default App;
