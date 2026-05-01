export const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID").format(angka);
};