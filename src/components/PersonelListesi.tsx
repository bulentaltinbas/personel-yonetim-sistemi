import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Button, Space, Spin } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { maskTC, maskPhone, getStatusColor } from '../utils/helpers';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Personel {
  key: string;
  ad: string;
  soyad: string;
  kimlikNo: string;
  telefon: string;
  ilce: string;
  gorev: string;
  durum: string;
}

const PersonelListesi: React.FC = () => {
  const [personelData, setPersonelData] = useState<Personel[]>([]);
  const [ilceler, setIlceler] = useState<string[]>([]);
  const [filterIlce, setFilterIlce] = useState<string | null>(null);
  const [filterDurum, setFilterDurum] = useState<string | null>(null);
  const [loading, setLoading
  ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const personelSnapshot = await getDocs(collection(db, 'personel'));
      const ilceSnapshot = await getDocs(collection(db, 'ilceler'));
      setPersonelData(personelSnapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Personel)));
      setIlceler(ilceSnapshot.docs.map(doc => doc.data().ad));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddPersonel = async () => {
    // Example: Add new personel (simplified)
    await addDoc(collection(db, 'personel'), {
      ad: 'Yeni',
      soyad: 'Personel',
      kimlikNo: '12345678900',
      telefon: '05320000000',
      ilce: ilceler[0] || 'Merkez',
      gorev: 'İmam',
      durum: 'Aktif'
    });
    const snapshot = await getDocs(collection(db, 'personel'));
    setPersonelData(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Personel)));
  };

  const filteredData = personelData.filter(p => {
    const ilceMatch = filterIlce ? p.ilce === filterIlce : true;
    const durumMatch = filterDurum ? p.durum === filterDurum : true;
    return ilceMatch && durumMatch;
  });

  const columns: ColumnsType<Personel> = [
    { title: 'Adı', dataIndex: 'ad', key: 'ad' },
    { title: 'Soyadı', dataIndex: 'soyad', key: 'soyad' },
    { title: 'TC Kimlik No', dataIndex: 'kimlikNo', key: 'kimlikNo', render: text => <span className="font-mono">{maskTC(text)}</span> },
    { title: 'Telefon', dataIndex: 'telefon', key: 'telefon', render: text => <span className="font-mono">{maskPhone(text)}</span> },
    { title: 'İlçe', dataIndex: 'ilce', key: 'ilce' },
    { title: 'Görev', dataIndex: 'gorev', key: 'gorev' },
    {
      title: 'Durum',
      dataIndex: 'durum',
      key: 'durum',
      render: text => {
        const { color, bg } = getStatusColor(text);
        return <span className={`px-2 py-1 rounded-lg ${color} ${bg}`}>{text}</span>;
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link">Detay</Button>
          <Button type="link">Vekalet</Button>
        </Space>
      )
    }
  ];

if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
if (!personelData.length) return <div className="text-center py-10">No data available</div>;

  return (
    <Card title="Personel Listesi" className="shadow-md">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input placeholder="Ara..." prefix={<SearchOutlined />} className="w-60" />
        <Select
          placeholder="İlçe"
          className="w-40"
          allowClear
          onChange={(val) => setFilterIlce(val)}
        >
          {ilceler.map((ilce, idx) => <Option key={idx} value={ilce}>{ilce}</Option>)}
        </Select>
        <Select
          placeholder="Durum"
          className="w-40"
          allowClear
          onChange={(val) => setFilterDurum(val)}
        >
          <Option value="Aktif">Aktif</Option>
          <Option value="İzinli">İzinli</Option>
          <Option value="Vekalet">Vekalet</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPersonel}>Yeni Personel</Button>
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

export default PersonelListesi;