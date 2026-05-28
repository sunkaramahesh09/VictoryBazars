import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Branch from "../models/Branch.js";

dotenv.config();

const branches = [
  {
    name: "Ravulapalem Main",
    district: "Dr. B.R. Ambedkar Konaseema",
    address: "8-452/2, CRC Road, Ravulapalem",
    city: "Ravulapalem",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Amalapuram",
    district: "Dr. B.R. Ambedkar Konaseema",
    address: "Main Road, Amalapuram",
    city: "Amalapuram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Razole",
    district: "Dr. B.R. Ambedkar Konaseema",
    address: "Station Road, Razole",
    city: "Razole",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Mummidivaram",
    district: "Dr. B.R. Ambedkar Konaseema",
    address: "Market Street, Mummidivaram",
    city: "Mummidivaram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Rajahmundry Main",
    district: "East Godavari",
    address: "T Nagar, Rajahmundry",
    city: "Rajahmundry",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Rajahmundry Innespeta",
    district: "East Godavari",
    address: "Innespeta, Rajahmundry",
    city: "Rajahmundry",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kakinada Main",
    district: "East Godavari",
    address: "Main Road, Kakinada",
    city: "Kakinada",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kakinada APSRTC",
    district: "East Godavari",
    address: "APSRTC Road, Kakinada",
    city: "Kakinada",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Pithapuram",
    district: "East Godavari",
    address: "NH Road, Pithapuram",
    city: "Pithapuram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tuni",
    district: "East Godavari",
    address: "Bypass Road, Tuni",
    city: "Tuni",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Bhimavaram Main",
    district: "West Godavari",
    address: "Main Road, Bhimavaram",
    city: "Bhimavaram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Bhimavaram 2nd Branch",
    district: "West Godavari",
    address: "Circle Road, Bhimavaram",
    city: "Bhimavaram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tanuku",
    district: "West Godavari",
    address: "Bus Stand Road, Tanuku",
    city: "Tanuku",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tadepalligudem",
    district: "West Godavari",
    address: "RTC Road, Tadepalligudem",
    city: "Tadepalligudem",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Narsapur",
    district: "West Godavari",
    address: "Beach Road, Narsapur",
    city: "Narsapur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Palakollu",
    district: "West Godavari",
    address: "Main Bazaar, Palakollu",
    city: "Palakollu",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Eluru Main",
    district: "West Godavari",
    address: "Eluru Main Road",
    city: "Eluru",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Eluru LR Nagar",
    district: "West Godavari",
    address: "LR Nagar, Eluru",
    city: "Eluru",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Vijayawada Benz Circle",
    district: "NTR District",
    address: "Benz Circle, Vijayawada",
    city: "Vijayawada",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Vijayawada Governorpet",
    district: "NTR District",
    address: "Governorpet, Vijayawada",
    city: "Vijayawada",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Vijayawada Auto Nagar",
    district: "NTR District",
    address: "Auto Nagar, Vijayawada",
    city: "Vijayawada",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Guntur Main",
    district: "Guntur",
    address: "Brodipet, Guntur",
    city: "Guntur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Guntur Arundelpet",
    district: "Guntur",
    address: "Arundelpet, Guntur",
    city: "Guntur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tenali",
    district: "Guntur",
    address: "Main Road, Tenali",
    city: "Tenali",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Narasaraopet",
    district: "Palnadu",
    address: "NH65, Narasaraopet",
    city: "Narasaraopet",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Macherla",
    district: "Palnadu",
    address: "Macherla Town",
    city: "Macherla",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Visakhapatnam MVP Colony",
    district: "Visakhapatnam",
    address: "MVP Colony, Vizag",
    city: "Visakhapatnam",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Visakhapatnam Seethammadhara",
    district: "Visakhapatnam",
    address: "Seethammadhara, Vizag",
    city: "Visakhapatnam",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Nellore Main",
    district: "Sri Potti Sriramulu Nellore",
    address: "Trunk Road, Nellore",
    city: "Nellore",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Nellore 2nd Branch",
    district: "Sri Potti Sriramulu Nellore",
    address: "Grand Trunk Rd, Nellore",
    city: "Nellore",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Ongole Main",
    district: "Prakasam",
    address: "Kurnool Road, Ongole",
    city: "Ongole",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Chirala",
    district: "Prakasam",
    address: "Main Road, Chirala",
    city: "Chirala",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kurnool Main",
    district: "Kurnool",
    address: "Bellary Road, Kurnool",
    city: "Kurnool",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kurnool 2nd",
    district: "Kurnool",
    address: "Hospital Road, Kurnool",
    city: "Kurnool",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kadapa Main",
    district: "YSR Kadapa",
    address: "MG Road, Kadapa",
    city: "Kadapa",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tirupati Main",
    district: "Tirupati",
    address: "Renigunta Road, Tirupati",
    city: "Tirupati",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Tirupati 2nd",
    district: "Tirupati",
    address: "Tiruchanur Road, Tirupati",
    city: "Tirupati",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Srikakulam",
    district: "Srikakulam",
    address: "Main Road, Srikakulam",
    city: "Srikakulam",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Vizianagaram",
    district: "Vizianagaram",
    address: "Old Town, Vizianagaram",
    city: "Vizianagaram",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Anakapalle",
    district: "Anakapalli",
    address: "Main Road, Anakapalle",
    city: "Anakapalle",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Rajam",
    district: "Srikakulam",
    address: "Rajam Town",
    city: "Rajam",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kavali",
    district: "Sri Potti Sriramulu Nellore",
    address: "Kavali Town",
    city: "Kavali",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Bapatla",
    district: "Bapatla",
    address: "Main Road, Bapatla",
    city: "Bapatla",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Markapur",
    district: "Prakasam",
    address: "Markapur Town",
    city: "Markapur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Proddatur",
    district: "YSR Kadapa",
    address: "Proddatur Town",
    city: "Proddatur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Hindupur",
    district: "Sri Sathya Sai",
    address: "Main Road, Hindupur",
    city: "Hindupur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Anantapur",
    district: "Sri Sathya Sai",
    address: "Anantapur Town",
    city: "Anantapur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Dhone",
    district: "Kurnool",
    address: "Dhone Town",
    city: "Dhone",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Nandyal",
    district: "Nandyal",
    address: "Nandyal Town",
    city: "Nandyal",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Giddalur",
    district: "Prakasam",
    address: "Giddalur Town",
    city: "Giddalur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Palasa",
    district: "Srikakulam",
    address: "Palasa Town",
    city: "Palasa",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Srikalahasti",
    district: "Tirupati",
    address: "Srikalahasti Town",
    city: "Srikalahasti",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Kandukur",
    district: "Sri Potti Sriramulu Nellore",
    address: "Kandukur Town",
    city: "Kandukur",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Madanapalle",
    district: "Annamayya",
    address: "Madanapalle Town",
    city: "Madanapalle",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
  {
    name: "Rajampet",
    district: "Annamayya",
    address: "Rajampet Town",
    city: "Rajampet",
    phone: "+91 9256265626",
    timing: "9:00 AM – 9:00 PM",
  },
];

const products = [
  {
    name: "Aashirvaad Atta 10kg",
    category: "Staples",
    price: 359,
    mrp: 399,
    stock: 150,
    unit: "10 kg",
    description:
      "Premium whole wheat atta for soft rotis. Made from select whole wheat grains.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Aashirvaad+Atta",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Tata Salt 1kg",
    category: "Staples",
    price: 24,
    mrp: 26,
    stock: 500,
    unit: "1 kg",
    description: "Iodized salt for healthy cooking.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Tata+Salt",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Fortune Sunflower Oil 5L",
    category: "Staples",
    price: 695,
    mrp: 750,
    stock: 80,
    unit: "5 L",
    description: "Refined sunflower oil, rich in Vitamin E.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Fortune+Oil",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Amul Butter 500g",
    category: "Dairy & Eggs",
    price: 280,
    mrp: 295,
    stock: 60,
    unit: "500 g",
    description: "Pasteurized butter made from fresh cream.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Amul+Butter",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Amul Full Cream Milk 1L",
    category: "Dairy & Eggs",
    price: 68,
    mrp: 70,
    stock: 200,
    unit: "1 L",
    description: "Fresh full cream milk, rich in calcium.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Amul+Milk",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Farm Fresh Eggs (30 pcs)",
    category: "Dairy & Eggs",
    price: 210,
    mrp: 225,
    stock: 100,
    unit: "30 pieces",
    description: "Fresh farm eggs, protein-rich.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Farm+Eggs",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Coca Cola 2L",
    category: "Beverages",
    price: 99,
    mrp: 110,
    stock: 120,
    unit: "2 L",
    description: "Classic refreshing cola drink.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Coca+Cola",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Tropicana Orange Juice 1L",
    category: "Beverages",
    price: 130,
    mrp: 145,
    stock: 90,
    unit: "1 L",
    description: "100% pure orange juice, no added sugar.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Tropicana",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Nescafe Classic 200g",
    category: "Beverages",
    price: 460,
    mrp: 499,
    stock: 75,
    unit: "200 g",
    description: "Rich, smooth instant coffee.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Nescafe",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Lay's Classic Salted 90g",
    category: "Snacks & Namkeen",
    price: 30,
    mrp: 35,
    stock: 300,
    unit: "90 g",
    description: "Crispy potato chips with classic salt flavor.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Lays",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Haldiram's Bhujia 1kg",
    category: "Snacks & Namkeen",
    price: 295,
    mrp: 320,
    stock: 85,
    unit: "1 kg",
    description: "Traditional Indian namkeen, crispy and spicy.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Haldirams",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Dove Soap (3 pack)",
    category: "Personal Care",
    price: 149,
    mrp: 165,
    stock: 200,
    unit: "3 x 100 g",
    description: "Moisturizing beauty bar with 1/4 moisturizing cream.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Dove+Soap",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Head & Shoulders Shampoo 400ml",
    category: "Personal Care",
    price: 299,
    mrp: 330,
    stock: 110,
    unit: "400 ml",
    description: "Anti-dandruff shampoo for clean, healthy scalp.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=H%26S+Shampoo",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Colgate Total Toothpaste 200g",
    category: "Personal Care",
    price: 179,
    mrp: 199,
    stock: 180,
    unit: "200 g",
    description: "12-hour antibacterial protection.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Colgate",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Surf Excel Matic 2kg",
    category: "Home Care",
    price: 420,
    mrp: 459,
    stock: 95,
    unit: "2 kg",
    description: "Detergent powder for front load washing machines.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Surf+Excel",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Harpic Toilet Cleaner 1L",
    category: "Home Care",
    price: 149,
    mrp: 165,
    stock: 140,
    unit: "1 L",
    description: "Powerful toilet cleaning liquid, kills 99.9% germs.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Harpic",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Fresh Tomatoes 1kg",
    category: "Fresh Fruits & Vegetables",
    price: 40,
    mrp: 50,
    stock: 200,
    unit: "1 kg",
    description: "Farm-fresh red tomatoes, handpicked daily.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Tomatoes",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Bananas (12 pcs)",
    category: "Fresh Fruits & Vegetables",
    price: 60,
    mrp: 70,
    stock: 150,
    unit: "12 pieces",
    description: "Sweet ripe bananas, rich in potassium.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Bananas",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Britannia Bread 400g",
    category: "Bakery & Sweets",
    price: 44,
    mrp: 48,
    stock: 120,
    unit: "400 g",
    description: "Soft fresh bread, perfect for breakfast.",
    isFeatured: false,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Britannia+Bread",
        public_id: "placeholder",
      },
    ],
  },
  {
    name: "Kwality Walls Ice Cream 1L",
    category: "Frozen Foods",
    price: 180,
    mrp: 200,
    stock: 60,
    unit: "1 L",
    description: "Creamy vanilla ice cream for the whole family.",
    isFeatured: true,
    images: [
      {
        url: "https://via.placeholder.com/400x400/CC0000/FFFFFF?text=Ice+Cream",
        public_id: "placeholder",
      },
    ],
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    if (process.argv[2] === "--destroy") {
      await Promise.all([
        User.deleteMany(),
        Product.deleteMany(),
        Branch.deleteMany(),
      ]);
      console.log("🗑️  Data destroyed");
      process.exit(0);
    }

    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Branch.deleteMany(),
    ]);

    // Create admin user
    await User.create({
      name: "Victory Bazars Admin",
      email: "admin@victorybazars.com",
      password: "admin@123",
      role: "admin",
      phone: "+91 9256265626",
    });

    // Seed branches and products
    await Branch.insertMany(branches);
    await Product.insertMany(products);

    console.log("✅ Admin user: admin@victorybazars.com / admin@123");
    console.log(`✅ ${branches.length} branches seeded`);
    console.log(`✅ ${products.length} products seeded`);
    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedData();
