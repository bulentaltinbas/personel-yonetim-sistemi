import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Divider, Table, Spin } from 'antd';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Ilce {
  key: string;
  ad: string;
  toplamPersonel: number;
}

const Ayarlar: React.FC = () => {
  const [ilceler, setIlceler] = useState<Ilce[]>([]);
  const [kurumAdi, setKurumAdi] = useState('İl Müftülüğü');
  const [emailBildirim, setEmailBildirim] = useState('aktif');
  const [raporlama, setRaporlama] = useState('haftalik');
  const [kullaniciAd, setKullaniciAd] = useState('Ahmet Müftüoğlu');
  const [email, setEmail] = useState('ahmet.muftuoglu@diyanet.gov.tr');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIlceler = async () => {
      const snapshot = await getDocs(collection(db, 'ilceler'));
      setIlceler(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Ilce)));
      setLoading(false);
    };
    fetchIlceler();
  }, []);

  const handleSaveSettings = async () => {
    // Save system settings (simplified)
    await updateDoc(doc(db, 'settings', 'general'), {
      kurumAdi,
      emailBildirim,
      raporlama
    });
  };

  const handleUpdateUser = async () => {
    // Update user info (simplified)
    await updateDoc(doc(db, 'users', 'current'), {
      adSoyad: kullaniciAd,
      email
    });
  };

  const handleAddIlce = async () => {
    await addDoc(collection(db, 'ilceler'), {
      ad: 'Yeni İlçe',
      toplamPersonel: 0,
      aktifPersonel: 0,
      izinliPersonel: 0,
      vekaletDurumu: 0
    });
    const snapshot = await getDocs(collection(db, 'ilceler'));
    setIlceler(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() } as Ilce)));
  };

  const columns: ColumnsType<Ilce> = [
    { title: 'İlçe Adı', dataIndex: 'ad', key: 'ad' },
    { title: 'Toplam Personel', dataIndex: 'toplamPersonel', key: 'toplamPersonel' },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Button type="link">Düzenle</Button>
      )
    }
  ];

  if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Sistem Ayarları" className="shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kurum Adı</label>
            <Input value={kurumAdi} onChange={(e) => setKurumAdi(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Bildirimleri</label>
            <Select value={emailBildirim} onChange={setEmailBildirim} className="w-full">
              <Option value="aktif">Aktif</Option>
              <Option value="pasif">Pasif</Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Otomatik Raporlama</label>
            <Select value={raporlama} onChange={setRaporlama} className="w-full">
              <Option value="gunluk">Günlük</Option>
              <Option value="haftalik">Haftalık</Option>
              <Option value="aylik">Aylık</Option>
              <Option value="pasif">Pasif</Option>
            </Select>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button type="primary" onClick={handleSaveSettings}>Kaydet</Button>
        </div>
      </Card>
      <Card title="Kullanıcı Ayarları" className="shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <Input value={kullaniciAd} onChange={(e) => setKullaniciAd(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
            <Input.Password placeholder="Yeni şifre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <Input.Password placeholder="Şifreyi tekrar girin" />
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button type="primary" onClick={handleUpdateUser}>Güncelle</Button>
        </div>
      </Card>
      <Card title="İlçe Yönetimi" className="shadow-md">
        <Table
          columns={columns}
          dataSource={ilceler}
          pagination={false}
          rowKey="key"
        />
        <div className="mt-4">
          <Button type="primary" onClick={handleAddIlce}>Yeni İlçe Ekle</Button>
        </div>
      </Card>
      <Card title="Yedekleme & Geri Yükleme" className="shadow-md md:col-span-2">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Sistem Yedeği Al</h3>
            <Button type="primary">Yedekle</Button>
          </div>
          <Divider />
          <div>
            <h3 className="font-medium mb-2">Yedekten Geri Yükle</h3>
            <Button>Geri Yükle</Button>
          </div>
          <Divider />
          <div>
            <h3 className="font-medium mb-2">Yedekleme Sıklığı</h3>
            <Select defaultValue="haftalik" className="w-full md:w-64">
              <Option value="gunluk">Günlük</Option>
              <Option value="haftalik">Haftalık</Option>
              <Option value="aylik">Aylık</Option>
              <Option value="pasif">Pasif</Option>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Ayarlar;