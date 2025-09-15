import 'dotenv/config';
import { connect, model } from 'mongoose';
import { ProductSchema } from '../src/product/schemas/product.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Create the model for seeding
const ProductModel = model('Product', ProductSchema);

// Indian e-commerce dummy products with proper images
const dummyProducts = [
  {
    name: "Samsung Galaxy M34 5G",
    description: "6000mAh Battery | 50MP Triple Camera | 6GB RAM, 128GB Storage | Android 13",
    price: 18999,
    originalPrice: 24999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    stock: 45,
    rating: 4.3,
  },
  {
    name: "Woodland Men's Leather Jacket",
    description: "Genuine Leather | Water Resistant | Premium Quality | Available in Multiple Sizes",
    price: 4999,
    originalPrice: 7999,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    stock: 25,
    rating: 4.5,
  },
  {
    name: "The Alchemist by Paulo Coelho",
    description: "International Bestseller | Inspirational Fiction | Paperback Edition",
    price: 299,
    originalPrice: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
    stock: 100,
    rating: 4.7,
  },
  {
    name: "Philips Air Fryer HD9200/90",
    description: "1.2 Kg Capacity | Rapid Air Technology | Dishwasher Safe | 1400W",
    price: 8999,
    originalPrice: 12999,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    stock: 30,
    rating: 4.2,
  },
  {
    name: "Yonex Arcsaber 11 Badminton Racquet",
    description: "Professional Grade | Strung Racquet | 83g Weight | Medium Flex",
    price: 12500,
    originalPrice: 15000,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=500&fit=crop",
    stock: 15,
    rating: 4.6,
  },
  {
    name: "LEGO Classic Creative Bricks Set",
    description: "790 Pieces | Age 4-99 | Building Blocks | Educational Toy",
    price: 3499,
    originalPrice: 4499,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558060370-e1598b2db9f5?w=500&h=500&fit=crop",
    stock: 40,
    rating: 4.8,
  },
  {
    name: "Lakme Absolute Perfect Radiance Kit",
    description: "Skin Lightening Facial Kit | For All Skin Types | Professional Results",
    price: 999,
    originalPrice: 1299,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
    stock: 60,
    rating: 4.1,
  },
  {
    name: "Bosch 13-piece Drill Set",
    description: "HSS Drill Bits | For Metal & Wood | Professional Quality | Storage Case Included",
    price: 1899,
    originalPrice: 2499,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop",
    stock: 35,
    rating: 4.4,
  },
  {
    name: "MTR Ready to Eat Meals Combo",
    description: "Pack of 6 | Variety Pack | Preservative Free | Ready in 2 Minutes",
    price: 450,
    originalPrice: 600,
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop",
    stock: 80,
    rating: 4.0,
  },
  {
    name: "OnePlus Buds Pro 2",
    description: "Active Noise Cancellation | 39 Hours Battery | Wireless Charging Case",
    price: 11999,
    originalPrice: 14999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    stock: 50,
    rating: 4.5,
  },
  {
    name: "Allen Solly Women's Cotton Kurta",
    description: "Pure Cotton | Machine Washable | Available in S, M, L, XL | Ethnic Wear",
    price: 1299,
    originalPrice: 1999,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    stock: 75,
    rating: 4.3,
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    description: "By Yuval Noah Harari | Non-Fiction | International Bestseller | Hardcover",
    price: 599,
    originalPrice: 799,
    category: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
    stock: 90,
    rating: 4.6,
  },
  {
    name: "Havells Ceiling Fan 1200mm",
    description: "Energy Efficient | 3 Year Warranty | Copper Winding | High Air Delivery",
    price: 2499,
    originalPrice: 3299,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    stock: 20,
    rating: 4.2,
  },
  {
    name: "Nike Revolution 6 Running Shoes",
    description: "Men's Running Shoes | Comfortable Foam Midsole | Breathable Mesh Upper",
    price: 3995,
    originalPrice: 4995,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    stock: 65,
    rating: 4.4,
  },
  {
    name: "Hot Wheels Track Builder Set",
    description: "Unlimited Track Combinations | 20 Track Pieces | 1 Hot Wheels Car Included",
    price: 1499,
    originalPrice: 1999,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558060370-e1598b2db9f5?w=500&h=500&fit=crop",
    stock: 55,
    rating: 4.7,
  },
  {
    name: "Himalaya Herbals Face Wash Combo",
    description: "Neem & Turmeric | Pack of 3 | For Oily Skin | Natural Ingredients",
    price: 285,
    originalPrice: 390,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
    stock: 120,
    rating: 4.1,
  },
  {
    name: "Castrol GTX Engine Oil",
    description: "20W-50 | 3.5 Liters | Multi-Grade | For Petrol & Diesel Engines",
    price: 1250,
    originalPrice: 1500,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    stock: 40,
    rating: 4.3,
  },
  {
    name: "Tata Tea Premium Blend",
    description: "500g Pack | Strong & Refreshing | Assam Tea Leaves | Rich Aroma",
    price: 225,
    originalPrice: 280,
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1594631661960-0a158db80c3c?w=500&h=500&fit=crop",
    stock: 150,
    rating: 4.2,
  },
  {
    name: "Boat Stone 650 Bluetooth Speaker",
    description: "10W Output | IPX5 Water Resistant | 7 Hours Playback | Bass Boost",
    price: 1999,
    originalPrice: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    stock: 85,
    rating: 4.0,
  },
  {
    name: "US Polo Assn. Men's T-Shirt",
    description: "100% Cotton | Regular Fit | Casual Wear | Available in Multiple Colors",
    price: 899,
    originalPrice: 1299,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    stock: 95,
    rating: 4.2,
  },
  {
    name: "Rich Dad Poor Dad",
    description: "By Robert Kiyosaki | Personal Finance | Bestselling Book | Paperback",
    price: 399,
    originalPrice: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    stock: 110,
    rating: 4.5,
  },
  {
    name: "Prestige Deluxe Alpha Pressure Cooker",
    description: "5 Liters | Stainless Steel | Induction Base | 5 Years Warranty",
    price: 2899,
    originalPrice: 3899,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
    stock: 30,
    rating: 4.6,
  },
  {
    name: "Puma Men's Running Shoes",
    description: "Lightweight | Shock Absorption | Breathable Upper | For Daily Training",
    price: 2999,
    originalPrice: 3999,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    stock: 70,
    rating: 4.3,
  },
  {
    name: "Barbie Dreamhouse Dollhouse",
    description: "3 Stories | 8 Rooms | Furniture Included | Pink & Purple Design",
    price: 8999,
    originalPrice: 11999,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558060370-e1598b2db9f5?w=500&h=500&fit=crop",
    stock: 12,
    rating: 4.8,
  },
  {
    name: "Mamaearth Vitamin C Face Cream",
    description: "50ml | Anti-Aging | Natural Ingredients | For All Skin Types",
    price: 599,
    originalPrice: 799,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
    stock: 88,
    rating: 4.4,
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await ProductModel.deleteMany({});
    console.log('Cleared existing products');

    // Insert dummy products
    const createdProducts = await ProductModel.insertMany(dummyProducts);
    console.log(`✅ Successfully created ${createdProducts.length} products`);

    // Display some stats
    const totalValue = createdProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const lowStockCount = createdProducts.filter(p => p.stock < 20).length;
    const categories = [...new Set(createdProducts.map(p => p.category))];

    console.log('\n📊 Database Stats:');
    console.log(`Total Products: ${createdProducts.length}`);
    console.log(`Categories: ${categories.length} (${categories.join(', ')})`);
    console.log(`Total Inventory Value: ₹${totalValue.toLocaleString('en-IN')}`);
    console.log(`Low Stock Items: ${lowStockCount}`);
    console.log(`Average Price: ₹${Math.round(createdProducts.reduce((sum, p) => sum + p.price, 0) / createdProducts.length).toLocaleString('en-IN')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts();