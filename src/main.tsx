import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import Signup from './Signup.tsx'
import Dashboard from './Dashboard.tsx'
import Orders from './Orders.tsx'
import Products from './Products.tsx'
import Inventory from './Inventory.tsx'
import Merchants from './Merchants.tsx'
import Onboarding from './Onboarding.tsx'
import Delivery from './Delivery.tsx'
import NotFound from './NotFound.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/products" element={<Products />} />
        <Route path="/dashboard/inventory" element={<Inventory />} />
        <Route path="/dashboard/merchants" element={<Merchants />} />
        <Route path="/dashboard/onboarding" element={<Onboarding />} />
        <Route path="/delivery/:code" element={<Delivery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
