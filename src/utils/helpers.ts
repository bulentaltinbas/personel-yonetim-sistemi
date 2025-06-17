/**
 * TC Kimlik numarasını maskeler
 * @param tc - TC Kimlik No
 * @returns Maskelenmiş TC (örn: 123****8901)
 */
export const maskTC = (tc: string): string => {
  if (!tc || tc.length !== 11) return tc;
  return tc.replace(/\d(?=\d{2})/g, '*');
};

/**
 * Telefon numarasını maskeler
 * @param tel - Telefon numarası
 * @returns Maskelenmiş telefon (örn: 0532***4567)
 */
export const maskPhone = (tel: string): string => {
  if (!tel || tel.length !== 10) return tel;
  return tel.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
};

/**
 * Tarihi belirtilen formatta döndürür
 * @param date - Tarih stringi veya Date objesi
 * @param format - İstenen format (default: DD.MM.YYYY)
 * @returns Formatlanmış tarih stringi
 */
export const formatDate = (date: string | Date, format = 'DD.MM.YYYY'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Geçersiz Tarih';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString());
};

/**
 * Duruma göre renk sınıfı döndürür
 * @param durum - Personel durumu
 * @returns {color: string, bg: string} - Renk sınıfları
 */
export const getStatusColor = (durum: string): { color: string, bg: string } => {
  switch (durum) {
    case 'Aktif':
      return { color: 'text-green-800', bg: 'bg-green-100' };
    case 'İzinli':
      return { color: 'text-yellow-800', bg: 'bg-yellow-100' };
    case 'Vekalet':
      return { color: 'text-blue-800', bg: 'bg-blue-100' };
    default:
      return { color: 'text-gray-800', bg: 'bg-gray-100' };
  }
};