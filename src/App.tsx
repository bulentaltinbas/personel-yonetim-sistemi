import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SwapOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import PersonelListesi from './components/PersonelListesi';
import VekaletTakibi from './components/VekaletTakibi';
import Raporlar from './components/Raporlar';
import Ayarlar from './components/Ayarlar';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <i className="fas fa-mosque text-2xl text-green-700 mr-2"></i>
            <h1 className="text-xl font-semibold text-gray-800">Personel Yönetim Sistemi</h1>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[activeTab]}
            onSelect={({ key }) => setActiveTab(key)}
            className="border-0"
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
            <Menu.Item key="personel" icon={<TeamOutlined />}>Personel</Menu.Item>
            <Menu.Item key="vekalet" icon={<SwapOutlined />}>Vekalet</Menu.Item>
            <Menu.Item key="raporlar" icon={<FileTextOutlined />}>Raporlar</Menu.Item>
            <Menu.Item key="ayarlar" icon={<SettingOutlined />}>Ayarlar</Menu.Item>
          </Menu>
        </div>
        {user && (
          <div className="flex items-center">
            <span className="mr-4">{user.email}</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
              Çıkış Yap
            </button>
          </div>
        )}
      </Header>
      <Content className="p-6 bg-gray-50">{renderTab()}</Content>
      <Footer className="text-center bg-white border-t py-4 text-gray-500">
        © 2025 Personel Yönetim Sistemi - Tüm Hakları Saklıdır
      </Footer>
    </Layout>
  );

function renderTab() {
  console.log("Rendering tab:", activeTab);
  switch (activeTab) {
    case 'dashboard': return <Dashboard />;
    case 'personel': return <PersonelListesi />;
    case 'vekalet': return <VekaletTakibi />;
    case 'raporlar': return <Raporlar />;
    case 'ayarlar': return <Ayarlar />;
    default: return <Dashboard />;
  }
}
};

export default App;