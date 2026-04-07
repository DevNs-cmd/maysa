// Catalog data builder (emerald theme). Generates ~70 items.
const baseItems = [
  { name: 'Emerald Arc Ring', category: 'rings', price: 14500, img: 'https://images.pexels.com/photos/2675323/pexels-photo-2675323.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1739007/pexels-photo-1739007.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Verdant Halo Ring', category: 'rings', price: 18900, img: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1191535/pexels-photo-1191535.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Glass Leaf Necklace', category: 'necklaces', price: 16500, img: 'https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/851219/pexels-photo-851219.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Dewdrop Pendant', category: 'necklaces', price: 21400, img: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Brume Studs', category: 'earrings', price: 9800, img: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/10182604/pexels-photo-10182604.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Aurora Climbers', category: 'earrings', price: 13200, img: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/3661266/pexels-photo-3661266.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Ribbon Chain Bracelet', category: 'bracelets', price: 15800, img: 'https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Verdure Tennis', category: 'bracelets', price: 26800, img: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1191535/pexels-photo-1191535.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Glass Helix Cuff', category: 'bracelets', price: 18600, img: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457804/pexels-photo-1457804.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Mist Ear Cuff', category: 'accessories', price: 8200, img: 'https://images.pexels.com/photos/1457804/pexels-photo-1457804.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Studio Clip Set', category: 'accessories', price: 6200, img: 'https://images.pexels.com/photos/2235563/pexels-photo-2235563.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/2235563/pexels-photo-2235563.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Glassline Anklet', category: 'accessories', price: 7200, img: 'https://images.pexels.com/photos/269923/pexels-photo-269923.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200' }
];

const swatchPalettes = [
  ['#dfe8e4', '#85c9a6', '#f3d8a5'],
  ['#e9f5ef', '#1f6a4b', '#0f2f25'],
  ['#f8f3e7', '#bca67a', '#2c5f4e']
];

const catalog = [];
let idCounter = 1;
while (catalog.length < 70) {
  for (const item of baseItems) {
    if (catalog.length >= 70) break;
    const priceJitter = Math.round((Math.random() * 2500) - 1200);
    const swatches = swatchPalettes[Math.floor(Math.random() * swatchPalettes.length)];
    catalog.push({
      id: idCounter++,
      name: item.name,
      category: item.category,
      price: Math.max(800, item.price + priceJitter),
      img: item.img,
      img2: item.img2 || item.img,
      badge: Math.random() > 0.85 ? 'New' : (Math.random() > 0.92 ? 'Limited' : ''),
      swatches
    });
  }
}
