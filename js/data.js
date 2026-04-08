const products = [
  {
    id: 1,
    name: "Golden Hera Necklace",
    category: "necklaces",
    price: 499,
    originalPrice: 899,
    stock: 12,
    brand: "masaya",
    rating: 4.8,
    reviews: 56,
    image: "https://images.pexels.com/photos/9428723/pexels-photo-9428723.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "gold", hex: "#E5C158" }, { color: "silver", hex: "#EAEAEA" }],
    description: "Intricately designed golden collar necklace inspired by ancient Greek aesthetics."
  },
  {
    id: 2,
    name: "Emerald Cut Diamond Ring",
    category: "rings",
    price: 399,
    originalPrice: 750,
    stock: 5,
    brand: "masaya",
    rating: 4.8,
    reviews: 64,
    image: "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/2675323/pexels-photo-2675323.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "platinum", hex: "#E5E4E2" }],
    description: "A breathtaking 2-carat emerald-cut diamond set in platinum with a shimmering halo."
  },
  {
    id: 3,
    name: "Classic Gold Link Chain",
    category: "necklaces",
    price: 299,
    stock: 0,
    brand: "masaya",
    rating: 4.7,
    reviews: 215,
    image: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "gold", hex: "#E5C158" }],
    description: "18k solid yellow gold classic link chain, perfect for layering or standalone elegance."
  },
  {
    id: 4,
    name: "Diamond Embellished Necklace",
    category: "necklaces",
    price: 450,
    stock: 25,
    brand: "masaya",
    rating: 4.9,
    reviews: 310,
    image: "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/851219/pexels-photo-851219.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "rosegold", hex: "#B76E79" }, { color: "gold", hex: "#E5C158" }],
    description: "Traditional black beads intertwined with a modern 18k gold and diamond pendant."
  },
  {
    id: 5,
    name: "Sapphire Teardrop Pendant",
    category: "necklaces",
    price: 499,
    originalPrice: 950,
    stock: 8,
    brand: "masaya",
    rating: 4.9,
    reviews: 86,
    image: "https://images.pexels.com/photos/1738622/pexels-photo-1738622.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/247296/pexels-photo-247296.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "whitegold", hex: "#D9D9D9" }],
    description: "A deep blue Ceylon sapphire teardrop surrounded by micropavé diamonds."
  },
  {
    id: 7,
    name: "Vintage Ruby Ring",
    category: "rings",
    price: 499,
    stock: 2,
    brand: "masaya",
    rating: 4.8,
    reviews: 42,
    image: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "platinum", hex: "#E5E4E2" }],
    description: "A stunning Burmese ruby set in a vintage-inspired art deco diamond encrusted platinum band."
  },
  {
    id: 10,
    name: "Tennis Bracelet 3 Carat",
    category: "bracelets",
    price: 450,
    stock: 15,
    brand: "masaya",
    rating: 4.9,
    reviews: 112,
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/1457816/pexels-photo-1457816.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "whitegold", hex: "#D9D9D9" }, { color: "yellowgold", hex: "#E5C158" }],
    description: "A string of brilliant-cut diamonds matching perfectly to create an endless loop of light."
  },
  {
    id: 11,
    name: "Minimalist Gold Hoops",
    category: "earrings",
    price: 199,
    stock: 50,
    brand: "masaya",
    rating: 4.5,
    reviews: 450,
    image: "https://images.pexels.com/photos/3661266/pexels-photo-3661266.jpeg?auto=compress&cs=tinysrgb&w=800",
    imageHover: "https://images.pexels.com/photos/1457798/pexels-photo-1457798.jpeg?auto=compress&cs=tinysrgb&w=800",
    variants: [{ color: "gold", hex: "#E5C158" }, { color: "rosegold", hex: "#B76E79" }, { color: "silver", hex: "#EAEAEA" }],
    description: "Essential solid gold hoop earrings. Thick, durable and lightweight for all day wear."
  }
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
