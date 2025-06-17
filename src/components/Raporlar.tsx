import React, { useState, useEffect } from 'react';
import { Card, Select, Button, DatePicker, Divider, Table, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Rapor {
  key: string;
  raporAdi: string;
  tarih: string;
  olusturan: string;
  format: string;
}

const Raporlar: React.FC = () => {
  const [ilceler, setIlceler] = useState<string[]>([]);
  const [raporlar, setRaporlar] = useState<Rapor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const ilceSnapshot = await getDocs(collection(db, 'ilceler'));
      const raporSnapshot = await getDocs(collection(db, 'raporlar'));
      setIlceler(ilceSnapshot.docs.map(doc => doc.data().ad));
      setRaporlar(raporSnapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Rapor)));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreateRapor = async () => {
    await addDoc(collection(db, 'raporlar'), {
      raporAdi: 'Yeni Rapor',
      tarih: new Date().toLocaleDateString('tr-TR'),
      olusturan: 'Ahmet Müftüoğlu',
      format: 'PDF'
    });
    const snapshot = await getDocs(collection(db, 'raporlar'));
    setRaporlar(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Rapor)));
  };

  const columns: ColumnsType<Rapor> = [
    { title: 'Rapor Adı', dataIndex: 'raporAdi', key: 'raporAdi' },
    { title: 'Tarih', dataIndex: 'tarih', key: 'tarih' },
    { title: 'Oluşturan', dataIndex: 'olusturan', key: 'olusturan' },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (text) => (
        <span className={`px-2 py-1 rounded-lg ${text === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {text}
        </span>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Button type="link" icon={<DownloadOutlined />}>İndir</Button>
      )
    }
  ];

  if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  return (
    <Card title="Rapor Oluşturma" className="shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
          <RangePicker className="w-full" format="DD.MM.YYYY" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
          <Select mode="multiple" className="w-full" allowClear>
            {ilceler.map((ilce, idx) => <Option key={idx} value={ilce}>{ilce}</Option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
          <Select mode="multiple" className="w-full" allowClear>
            <Option value="Aktif">Aktif</Option>
            <Option value="İzinli">İzinli</Option>
            <Option value="Vekalet">Vekalet</Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rapor Türü</label>
          <Select className="w-full" defaultValue="personel">
            <Option value="personel">Personel Listesi</Option>
            <Option value="vekalet">Vekalet Raporu</Option>
            <Option value="ozet">İlçe Özeti</Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <Select className="w-full" defaultValue="PDF">
            <Option value="PDF">PDF</Option>
            <Option value="Excel">Excel</Option>
          </Select>
        </div>
      </div>
      <Divider />
      <div className="flex justify-end">
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleCreateRapor} className="!rounded-button">
          Rapor Oluştur
        </Button>
      </div>
      <Divider orientation="left">Önceki Raporlar</Divider>
      <Table
        columns={columns}
        dataSource={raporlar}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        className="overflow-x-auto"
      />
    </Card>
  );
};

export default Raporlar;