const products = [
  {
    id: 1,
    name: "Royal Chrono Automatic Watch",
    category: "watches",
    price: 12500,
    brand: "masaya",
    rating: 4.9,
    reviews: 128,
    image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Exquisite craftsmanship meets modern engineering in this signature automatic timepiece featuring an 18k gold dial and sapphire crystal."
  },
  {
    id: 2,
    name: "Emerald Cut Diamond Ring",
    category: "rings",
    price: 8900,
    brand: "masaya",
    rating: 4.8,
    reviews: 64,
    image: "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A breathtaking 2-carat emerald-cut diamond set in platinum with a shimmering halo."
  },
  {
    id: 3,
    name: "Classic Gold Link Chain",
    category: "necklaces",
    price: 3200,
    brand: "masaya",
    rating: 4.7,
    reviews: 215,
    image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "18k solid yellow gold classic link chain, perfect for layering or standalone elegance."
  },
  {
    id: 4,
    name: "Midnight Tourbillon Men's Watch",
    category: "watches",
    price: 45000,
    brand: "masaya",
    rating: 5.0,
    reviews: 12,
    image: "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A masterpiece of horology. The Midnight Tourbillon reveals the beating heart of the watch through an intricate skeleton dial."
  },
  {
    id: 5,
    name: "Sapphire Teardrop Pendant",
    category: "necklaces",
    price: 6500,
    brand: "masaya",
    rating: 4.9,
    reviews: 86,
    image: "https://images.pexels.com/photos/1738622/pexels-photo-1738622.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A deep blue Ceylon sapphire teardrop surrounded by micropavé diamonds."
  },
  {
    id: 6,
    name: "Rose Gold Perpetual Watch",
    category: "watches",
    price: 18500,
    brand: "masaya",
    rating: 4.7,
    reviews: 95,
    image: "https://images.pexels.com/photos/1034425/pexels-photo-1034425.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Elegant 18k rose gold perpetual calendar watch suitable for any formal occasion."
  },
  {
    id: 7,
    name: "Vintage Ruby Ring",
    category: "rings",
    price: 11200,
    brand: "masaya",
    rating: 4.8,
    reviews: 42,
    image: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A stunning Burmese ruby set in a vintage-inspired art deco diamond encrusted platinum band."
  },
  {
    id: 8,
    name: "Platinum Diving Watch",
    category: "watches",
    price: 14000,
    brand: "masaya",
    rating: 4.6,
    reviews: 156,
    image: "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Water resistant to 300m, featuring a scratch-resistant ceramic bezel and helium escape valve."
  },
  {
    id: 9,
    name: "Diamond Embellished Mangalsutra",
    category: "mangalsutra",
    price: 2100,
    brand: "masaya",
    rating: 4.9,
    reviews: 310,
    image: "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Traditional black beads intertwined with a modern 18k gold and diamond pendant."
  },
  {
    id: 10,
    name: "Tennis Bracelet 3 Carat",
    category: "bracelets",
    price: 5400,
    brand: "masaya",
    rating: 4.9,
    reviews: 112,
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "A string of brilliant-cut diamonds matching perfectly to create an endless loop of light."
  },
  {
    id: 11,
    name: "Minimalist Gold Hoops",
    category: "earrings",
    price: 1200,
    brand: "masaya",
    rating: 4.5,
    reviews: 450,
    image: "https://images.pexels.com/photos/3661266/pexels-photo-3661266.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Essential solid gold hoop earrings. Thick, durable and lightweight for all day wear."
  },
  {
    id: 12,
    name: "Pearl Drop Earrings",
    category: "earrings",
    price: 850,
    brand: "masaya",
    rating: 4.7,
    reviews: 88,
    image: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Lustrous South Sea pearls suspended from a delicate diamond stud."
  }
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price * 80);
};
