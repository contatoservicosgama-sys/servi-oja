
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout as AdminLayout } from './components/Layout';
import { ClientLayout } from './components/ClientLayout';
import { Dashboard } from './components/Dashboard';
import { ProviderList } from './components/ProviderList';
import { PaymentList } from './components/PaymentList';
import { ExpirationControl } from './components/ExpirationControl';
import { ServiceManagement } from './components/ServiceManagement';
import { CityManagement } from './components/CityManagement';
import { Reports } from './components/Reports';
import { MessageTemplates } from './components/MessageTemplates';

// Client Components
import { ClientHome } from './components/ClientHome';
import { ClientProviderList } from './components/ClientProviderList';
import { RegistrationFlow } from './components/RegistrationFlow';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="prestadores" element={<ProviderList />} />
              <Route path="pagamentos" element={<PaymentList />} />
              <Route path="vencimentos" element={<ExpirationControl />} />
              <Route path="servicos" element={<ServiceManagement />} />
              <Route path="cidades" element={<CityManagement />} />
              <Route path="relatorios" element={<Reports />} />
              <Route path="mensagens" element={<MessageTemplates />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Client/Public Routes */}
        <Route path="/*" element={
          <ClientLayout>
            <Routes>
              <Route index element={<ClientHome />} />
              <Route path="busca/:serviceId" element={<ClientProviderList />} />
              <Route path="cadastro" element={<RegistrationFlow />} />
            </Routes>
          </ClientLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
