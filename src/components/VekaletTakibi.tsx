import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Spin } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Vekalet {
  key: string;
  asilPersonel: string;
  vekaletEden: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  neden: string;
  durum: string;
}

const VekaletTakibi: React.FC = () => {
  const [vekaletData, setVekaletData] = useState<Vekalet[]>([]);
  const [filterDurum, setFilterDurum] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'vekalet'));
      setVekaletData(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Vekalet)));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddVekalet = async () => {
    await addDoc(collection(db, 'vekalet'), {
      asilPersonel: 'Yeni Personel',
      vekaletEden: 'Vekil Personel',
      baslangicTarihi: '2025-06-17',
      bitisTarihi: '2025-06-27',
      neden: 'Yıllık İzin',
      durum: 'Aktif'
    });
    const snapshot = await getDocs(collection(db, 'vekalet'));
    setVekaletData(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Vekalet)));
  };

  const filteredData = vekaletData.filter(p => filterDurum ? p.durum === filterDurum : true);

  const columns: ColumnsType<Vekalet> = [
    { title: 'Asıl Personel', dataIndex: 'asilPersonel', key: 'asilPersonel' },
    { title: 'Vekalet Eden', dataIndex: 'vekaletEden', key: 'vekaletEden' },
    { title: 'Başlangıç Tarihi', dataIndex: 'baslangicTarihi', key: 'baslangicTarihi' },
    { title: 'Bitiş Tarihi', dataIndex: 'bitisTarihi', key: 'bitisTarihi' },
    { title: 'Neden', dataIndex: 'neden', key: 'neden' },
    {
      title: 'Durum',
      dataIndex: 'durum',
      key: 'durum',
      render: (text) => (
        <span className={`px-2 py-1 rounded-lg ${text === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {text}
        </span>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link">Düzenle</Button>
          <Button type="link" danger>Kaldır</Button>
        </Space>
      )
    }
  ];

  if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  return (
    <Card title="Vekalet Takip Listesi" className="shadow-md">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input placeholder="Ara..." prefix={<SearchOutlined />} className="w-60" />
        <Select
          placeholder="Durum"
          className="w-40"
          allowClear
          onChange={(val) => setFilterDurum(val)}
        >
          <Option value="Aktif">Aktif</Option>
          <Option value="Pasif">Pasif</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVekalet}>Yeni Vekalet</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        rowKey="key"
        className="overflow-x-auto"
      />
    </Card>
  );
};

export default VekaletTakibi;