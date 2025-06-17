import React, { useState, useEffect } from 'react';
import { Card, Statistic, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'swiper/css';
import 'swiper/css/pagination';

interface Ilce {
  ad: string;
  toplamPersonel: number;
  aktifPersonel: number;
  izinliPersonel: number;
  vekaletDurumu: number;
}

const Dashboard: React.FC = () => {
  const [ilceler, setIlceler] = useState<Ilce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIlceler = async () => {
      const querySnapshot = await getDocs(collection(db, 'ilceler'));
      const ilceData = querySnapshot.docs.map(doc => doc.data() as Ilce);
      setIlceler(ilceData);
      setLoading(false);
    };
    fetchIlceler();
  }, []);

  if (loading) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  const toplamPersonel = ilceler.reduce((acc, ilce) => acc + ilce.toplamPersonel, 0);
  const aktifPersonel = ilceler.reduce((acc, ilce) => acc + ilce.aktifPersonel, 0);
  const izinliPersonel = ilceler.reduce((acc, ilce) => acc + ilce.izinliPersonel, 0);
  const vekaletDurumu = ilceler.reduce((acc, ilce) => acc + ilce.vekaletDurumu, 0);

  const ilceDagilimOption = {
    animation: false,
    title: { text: 'İlçe Bazlı Personel Dağılımı', left: 'center', textStyle: { fontWeight: 'normal', fontSize: 16 } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Toplam', 'Aktif', 'İzinli', 'Vekalet'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: ilceler.map(ilce => ilce.ad) },
    yAxis: { type: 'value' },
    series: [
      { name: 'Toplam', type: 'bar', data: ilceler.map(ilce => ilce.toplamPersonel), color: '#4096ff' },
      { name: 'Aktif', type: 'bar', data: ilceler.map(ilce => ilce.aktifPersonel), color: '#52c41a' },
      { name: 'İzinli', type: 'bar', data: ilceler.map(ilce => ilce.izinliPersonel), color: '#faad14' },
      { name: 'Vekalet', type: 'bar', data: ilceler.map(ilce => ilce.vekaletDurumu), color: '#f5222d' }
    ]
  };

  const personelDurumOption = {
    animation: false,
    title: { text: 'Personel Durum Dağılımı', left: 'center', textStyle: { fontWeight: 'normal', fontSize: 16 } },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center', data: ['Aktif', 'İzinli', 'Vekalet'] },
    series: [
      {
        name: 'Personel Durumu',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: [
          { value: aktifPersonel, name: 'Aktif', itemStyle: { color: '#52c41a' } },
          { value: izinliPersonel, name: 'İzinli', itemStyle: { color: '#faad14' } },
          { value: vekaletDurumu, name: 'Vekalet', itemStyle: { color: '#f5222d' } }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic title="Toplam Personel" value={toplamPersonel} valueStyle={{ color: '#4096ff' }} prefix={<i className="fas fa-users mr-2"></i>} />
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic title="Aktif Personel" value={aktifPersonel} valueStyle={{ color: '#52c41a' }} prefix={<i className="fas fa-user-check mr-2"></i>} />
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic title="İzinli Personel" value={izinliPersonel} valueStyle={{ color: '#faad14' }} prefix={<i className="fas fa-user-clock mr-2"></i>} />
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic title="Vekalet Durumu" value={vekaletDurumu} valueStyle={{ color: '#f5222d' }} prefix={<i className="fas fa-user-tag mr-2"></i>} />
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="İlçe Bazlı Dağılım Grafiği" className="shadow-md">
          <ReactECharts option={ilceDagilimOption} style={{ height: '400px' }} />
        </Card>
        <Card title="Personel Durum Dağılımı" className="shadow-md">
          <ReactECharts option={personelDurumOption} style={{ height: '400px' }} />
        </Card>
      </div>
      <Card title="İlçe Bazlı Personel Özeti" className="shadow-md">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          {ilceler.map((ilce, index) => (
            <SwiperSlide key={index}>
              <Card className="border border-gray-200 h-full">
                <div className="flex items-center mb-4">
                  <i className="fas fa-map-marker-alt text-xl text-green-600 mr-2"></i>
                  <h3 className="text-lg font-medium">{ilce.ad}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toplam Personel:</span>
                    <span className="font-medium">{ilce.toplamPersonel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aktif Personel:</span>
                    <span className="font-medium text-green-600">{ilce.aktifPersonel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">İzinli Personel:</span>
                    <span className="font-medium text-yellow-600">{ilce.izinliPersonel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vekalet Durumu:</span>
                    <span className="font-medium text-blue-600">{ilce.vekaletDurumu}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Detayları Görüntüle</button>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Card>
    </div>
  );
};

export default Dashboard;