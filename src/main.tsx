if (import.meta.env.DEV) {
  import("react-grab");
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import Signup from './Signup.tsx'
import Dashboard from './Dashboard.tsx'
import Orders from './Orders.tsx'
import OrderDetail from './OrderDetail.tsx'
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
import AppKr from './AppKr.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/kr" element={<AppKr />} />
        <Route path="/kr/login" element={<Login locale="kr" />} />
        <Route path="/kr/signup" element={<Signup locale="kr" />} />
        <Route path="/kr/dashboard" element={<Dashboard locale="kr" />} />
        <Route path="/kr/dashboard/orders" element={<Orders locale="kr" />} />
        <Route path="/kr/dashboard/orders/:orderId" element={<OrderDetail locale="kr" />} />
        <Route path="/kr/dashboard/products" element={<Products locale="kr" />} />
        <Route path="/kr/dashboard/inventory" element={<Inventory locale="kr" />} />
        <Route path="/kr/dashboard/licenses" element={<Licenses locale="kr" />} />
        <Route path="/kr/dashboard/providers" element={<Providers locale="kr" />} />
        <Route path="/kr/dashboard/merchants" element={<Merchants locale="kr" />} />
        <Route path="/kr/dashboard/customers" element={<Customers locale="kr" />} />
        <Route path="/kr/dashboard/workflow" element={<WorkflowPage locale="kr" />} />
        <Route path="/kr/dashboard/analytics" element={<Analytics locale="kr" />} />
        <Route path="/kr/dashboard/settings" element={<Settings locale="kr" />} />
        <Route path="/kr/dashboard/workspace" element={<Workspace locale="kr" />} />
        <Route path="/kr/dashboard/channels" element={<Channels locale="kr" />} />
        <Route path="/kr/dashboard/onboarding" element={<QuickSetup locale="kr" />} />
        <Route path="/kr/dashboard/create-workspace" element={<QuickSetup locale="kr" />} />
        <Route path="/kr/dashboard/quick-setup" element={<QuickSetup locale="kr" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/orders/:orderId" element={<OrderDetail />} />
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
