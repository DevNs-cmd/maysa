// Catalog data builder (emerald theme). Generates ~70 items.
const baseItems = [
  // RINGS
  { name: 'Emerald Arc Ring', category: 'rings', price: 350, img: 'https://images.pexels.com/photos/2675323/pexels-photo-2675323.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Verdant Halo Ring', category: 'rings', price: 420, img: 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457805/pexels-photo-1457805.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Solitaire Glass Ring', category: 'rings', price: 499, img: 'https://images.pexels.com/photos/1457805/pexels-photo-1457805.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457802/pexels-photo-1457802.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Vintage Emerald Band', category: 'rings', price: 380, img: 'https://images.pexels.com/photos/1457802/pexels-photo-1457802.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1191535/pexels-photo-1191535.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Prism Facet Ring', category: 'rings', price: 290, img: 'https://images.pexels.com/photos/1191535/pexels-photo-1191535.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/2675323/pexels-photo-2675323.jpeg?auto=compress&cs=tinysrgb&w=1200' },

  // NECKLACES
  { name: 'Glass Leaf Necklace', category: 'necklaces', price: 380, img: 'https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/9428723/pexels-photo-9428723.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Dewdrop Pendant', category: 'necklaces', price: 450, img: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Hera Gold Choker', category: 'necklaces', price: 470, img: 'https://images.pexels.com/photos/9428723/pexels-photo-9428723.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Diamond Glass Drop', category: 'necklaces', price: 495, img: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Aesthetic Set Link', category: 'necklaces', price: 320, img: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200' },

  // EARRINGS
  { name: 'Brume Studs', category: 'earrings', price: 280, img: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Aurora Climbers', category: 'earrings', price: 320, img: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/3661266/pexels-photo-3661266.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Classic Gold Hoops', category: 'earrings', price: 210, img: 'https://images.pexels.com/photos/3661266/pexels-photo-3661266.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457804/pexels-photo-1457804.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Mist Ear Cuff', category: 'earrings', price: 150, img: 'https://images.pexels.com/photos/1457804/pexels-photo-1457804.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/10182604/pexels-photo-10182604.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Cascade Drop Studs', category: 'earrings', price: 240, img: 'https://images.pexels.com/photos/10182604/pexels-photo-10182604.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1200' },

  // BRACELETS
  { name: 'Ribbon Chain Bracelet', category: 'bracelets', price: 310, img: 'https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Verdure Tennis', category: 'bracelets', price: 480, img: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457788/pexels-photo-1457788.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Glass Helix Cuff', category: 'bracelets', price: 360, img: 'https://images.pexels.com/photos/1457788/pexels-photo-1457788.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/10181958/pexels-photo-10181958.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Lustre Pearl Chain', category: 'bracelets', price: 399, img: 'https://images.pexels.com/photos/10181958/pexels-photo-10181958.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=1200' },

  // ACCESSORIES
  { name: 'Studio Clip Set', category: 'accessories', price: 150, img: 'https://images.pexels.com/photos/2235563/pexels-photo-2235563.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/2235563/pexels-photo-2235563.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Glassline Anklet', category: 'accessories', price: 210, img: 'https://images.pexels.com/photos/269923/pexels-photo-269923.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { name: 'Prism Hair Pin', category: 'accessories', price: 99, img: 'https://images.pexels.com/photos/2235563/pexels-photo-2235563.jpeg?auto=compress&cs=tinysrgb&w=1200', img2: 'https://images.pexels.com/photos/269923/pexels-photo-269923.jpeg?auto=compress&cs=tinysrgb&w=1200' }
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
    const priceJitter = Math.round((Math.random() * 50) - 25);
    const swatches = swatchPalettes[Math.floor(Math.random() * swatchPalettes.length)];
    catalog.push({
      id: idCounter++,
      name: item.name,
      category: item.category,
      price: Math.min(499, Math.max(99, item.price + priceJitter)),
      img: item.img,
      img2: item.img2 || item.img,
      badge: Math.random() > 0.85 ? 'New' : (Math.random() > 0.92 ? 'Limited' : ''),
      swatches
    });
  }
}
