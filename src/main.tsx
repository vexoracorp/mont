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
import Licenses from './Licenses.tsx'
import Providers from './Providers.tsx'
import Merchants from './Merchants.tsx'
import Customers from './Customers.tsx'
import Analytics from './Analytics.tsx'
import Settings from './Settings.tsx'
import Workspace from './Workspace.tsx'
import Channels from './Channels.tsx'
import WorkflowPage from './Workflow.tsx'
import QuickSetup from './QuickSetup.tsx'
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
        <Route path="/dashboard/licenses" element={<Licenses />} />
        <Route path="/dashboard/providers" element={<Providers />} />
        <Route path="/dashboard/merchants" element={<Merchants />} />
        <Route path="/dashboard/customers" element={<Customers />} />
        <Route path="/dashboard/workflow" element={<WorkflowPage />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/workspace" element={<Workspace />} />
        <Route path="/dashboard/channels" element={<Channels />} />
        <Route path="/dashboard/onboarding" element={<QuickSetup />} />
        <Route path="/dashboard/create-workspace" element={<QuickSetup />} />
        <Route path="/dashboard/quick-setup" element={<QuickSetup />} />
        <Route path="/delivery/:code" element={<Delivery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
