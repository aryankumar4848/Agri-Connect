const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    soil: { type: String, required: true },
    season: { type: Array, required: true },
    investment: { type: Number, required: true },
    waterReq: { type: Number, required: true },
    profit: { type: Number, required: true },
    brief: { type: String, required: true },
    info: { type: String, required: true },
    img: { type: String, required: true }
}, { collection: 'crops', timestamps: true });

const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    sellerId: { type: String, required: true },
    manufacturer: { type: String, required: true },
    weight: { type: Number, required: true },
    stock: { type: Boolean, required: true },
    img1: { type: String },
    img2: { type: String },
    description: { type: String },
    expiry: { type: String }
}, { collection: 'products' });

const Crop = mongoose.model('Crop', cropSchema);
const Product = mongoose.model('Product', productSchema);

const cropsData = [
    {
        name: "Rice",
        soil: "Alluvial",
        season: ["Kharif"],
        investment: 50000,
        waterReq: 3,
        profit: 20000,
        brief: "Rice is the primary food crop of India.",
        info: "Rice requires high temperature and high humidity with annual rainfall above 100 cm.",
        img: "/Crop_Images/rice.jpg"
    },
    {
        name: "Wheat",
        soil: "Black",
        season: ["Rabi"],
        investment: 40000,
        waterReq: 2,
        profit: 15000,
        brief: "Wheat is the second most important cereal crop.",
        info: "Wheat requires a cool growing season and bright sunshine at the time of ripening.",
        img: "/Crop_Images/wheat.jpg"
    },
    {
        name: "Cotton",
        soil: "Black",
        season: ["Kharif"],
        investment: 60000,
        waterReq: 2,
        profit: 25000,
        brief: "Cotton is one of the most important cash crops.",
        info: "Cotton grows well in drier parts of the black cotton soil of the Deccan plateau.",
        img: "/Crop_Images/cotton.jpg"
    },
    {
        name: "Maize",
        soil: "Red",
        season: ["Kharif", "Rabi"],
        investment: 30000,
        waterReq: 2,
        profit: 10000,
        brief: "Maize is a crop which is used both as food and fodder.",
        info: "It is a Kharif crop which requires temperature between 21°C to 27°C.",
        img: "/Crop_Images/maize.jpg"
    },
    {
        name: "Black Gram (Urad Dal)",
        soil: "Sandy",
        season: ["Rabi"],
        investment: 15000,
        waterReq: 1,
        profit: 12000,
        brief: "Highly nutritious pulse crop.",
        info: "Grows well in sandy loamy soils with minimal water.",
        img: "/Crop_Images/blackgram.jpg"
    }
];

const productsData = [
    {
        category: "seeds",
        name: "Hybrid Rice Seeds",
        mrp: 600,
        price: 500,
        sellerId: "seller123",
        manufacturer: "AgriTech",
        weight: 1,
        stock: true,
        img1: "/Market_Images/seeds1.webp",
        description: "High yield hybrid rice seeds.",
        expiry: "Dec 2025"
    },
    {
        category: "fertilizers",
        name: "Urea Fertilizer",
        mrp: 1000,
        price: 850,
        sellerId: "seller123",
        manufacturer: "GrowFast",
        weight: 5,
        stock: true,
        img1: "/Market_Images/fertiliser1.jpg",
        description: "Standard nitrogen fertilizer.",
        expiry: "Oct 2026"
    },
    {
        category: "pesticides",
        name: "Neem Oil Bio-Pesticide",
        mrp: 400,
        price: 320,
        sellerId: "seller456",
        manufacturer: "EcoGuard",
        weight: 0.5,
        stock: true,
        img1: "/Market_Images/fertiliser2.jpg",
        description: "Natural pest control solution.",
        expiry: "Jan 2026"
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await Crop.deleteMany({});
        await Product.deleteMany({});

        await Crop.insertMany(cropsData);
        await Product.insertMany(productsData);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
