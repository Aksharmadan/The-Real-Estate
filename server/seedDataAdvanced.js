const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate-platform');

const users = [
  {
    name: 'Akshar Madan',
    email: 'aksharmadan@gmail.com',
    password: 'akshar123',
    role: 'agent',
    phone: '9876543210',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: '123456',
    role: 'agent',
    phone: '9876543211',
  },
  {
    name: 'Priya Singh',
    email: 'priya@example.com',
    password: '123456',
    role: 'agent',
    phone: '9876543212',
  },
  {
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    password: '123456',
    role: 'agent',
    phone: '9876543213',
  },
  {
    name: 'Sneha Desai',
    email: 'sneha@example.com',
    password: '123456',
    role: 'agent',
    phone: '9876543214',
  },
];

const properties = [
  {
    title: 'Luxury 3BHK Sea Facing Apartment - Mumbai',
    description: 'Experience luxury living with breathtaking sea views from every room. This spacious 3BHK apartment features Italian marble flooring, modular kitchen, and premium fixtures. Located in the heart of South Mumbai with easy access to business districts and entertainment hubs.',
    price: 12500000,
    address: {
      street: '123 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    amenities: ['parking', 'gym', 'pool', 'security', '24x7 water', 'power backup', 'clubhouse', 'kids play area'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Master Bedroom (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Modern 4BHK Villa with Private Garden - Gurgaon',
    description: 'Stunning independent villa spread across 3000 sq ft with a beautiful garden. Features include smart home automation, solar panels, rainwater harvesting, and a private swimming pool. Perfect for families seeking luxury and sustainability.',
    price: 25000000,
    address: {
      street: '456 Golf Course Road',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122001',
    },
    propertyType: 'villa',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    amenities: ['parking', 'garden', 'security', 'clubhouse', 'power backup', 'private pool', 'solar panels'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Kitchen (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Premium 2BHK Apartment Near IT Park - Bangalore',
    description: 'Well-maintained 2BHK apartment in Whitefield, walking distance from major IT parks. Modern amenities, 24x7 security, and excellent connectivity to metro and shopping centers.',
    price: 35000,
    address: {
      street: '789 Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560066',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ['parking', 'gym', 'security', 'power backup', 'lift'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Commercial Office Space - Connaught Place Delhi',
    description: 'Premium office space in the heart of Delhi. Ideal for IT companies, startups, and corporate offices. High-speed elevators, central AC, and ample parking space.',
    price: 8500000,
    address: {
      street: '101 Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
    },
    propertyType: 'commercial',
    listingType: 'sale',
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    amenities: ['parking', 'elevator', '24x7 security', 'power backup', 'cafeteria', 'conference rooms'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Office Space (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Affordable 1BHK Near Metro Station - Noida',
    description: 'Budget-friendly 1BHK apartment with excellent metro connectivity. Perfect for young professionals and students. Fully furnished with modern amenities.',
    price: 18000,
    address: {
      street: '234 Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201301',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ['parking', 'security', 'power backup', 'lift'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Bedroom (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Spacious 3BHK Penthouse with Terrace - Pune',
    description: 'Luxurious penthouse with private terrace and city views. Features include jacuzzi, home theater, and smart home automation. Premium lifestyle in prime location.',
    price: 18500000,
    address: {
      street: '567 Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    amenities: ['parking', 'gym', 'pool', 'security', 'private terrace', 'jacuzzi', 'home theater'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Area (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Terrace (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: '2BHK Apartment in Gated Community - Hyderabad',
    description: 'Beautiful apartment in well-maintained gated community. Close to HITECH city, schools, and hospitals. Great for families.',
    price: 7500000,
    address: {
      street: '890 Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500032',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ['parking', 'gym', 'pool', 'kids play area', 'security', 'clubhouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Luxury 5BHK Duplex Villa - Jaipur',
    description: 'Grand duplex villa with traditional Rajasthani architecture blended with modern amenities. Spacious rooms, multiple balconies, and beautiful landscaped garden.',
    price: 32000000,
    address: {
      street: '123 C-Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      zipCode: '302001',
    },
    propertyType: 'villa',
    listingType: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    amenities: ['parking', 'garden', 'security', 'servant quarters', 'power backup', 'private gym'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Hall (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Master Suite (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Studio Apartment for Students - Chennai',
    description: 'Compact studio apartment perfect for students and young professionals. Fully furnished with WiFi, AC, and washing machine. Near colleges and IT corridor.',
    price: 12000,
    address: {
      street: '456 OMR Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600096',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    amenities: ['parking', 'security', 'WiFi', 'fully furnished'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Studio (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Farmhouse with Lake View - Lonavala',
    description: 'Beautiful farmhouse surrounded by nature with private lake access. Perfect weekend getaway or permanent residence. Includes fruit orchards and organic farming space.',
    price: 45000000,
    address: {
      street: '789 Lake View Road',
      city: 'Lonavala',
      state: 'Maharashtra',
      zipCode: '410401',
    },
    propertyType: 'villa',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 5000,
    amenities: ['parking', 'garden', 'lake access', 'orchard', 'security', 'caretaker quarters'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Area (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Lake View (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Premium 3BHK Apartment with Balcony - Mumbai',
    description: 'Modern 3BHK apartment with stunning city views. Spacious living room, modular kitchen, and premium finishes. Close to schools, hospitals, and shopping malls.',
    price: 9800000,
    address: {
      street: '456 Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    amenities: ['parking', 'gym', 'pool', 'security', '24x7 water', 'power backup', 'clubhouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Master Bedroom (360°)' },
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Kitchen (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: 'Luxury 2BHK Apartment for Rent - Gurgaon',
    description: 'Fully furnished luxury 2BHK apartment with premium amenities. Located in DLF Cyber City with easy access to metro and malls.',
    price: 45000,
    address: {
      street: '789 DLF Phase 5',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122009',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
    amenities: ['parking', 'gym', 'pool', 'security', 'power backup', 'fully furnished', 'WiFi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Bedroom (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Independent 4BHK House - Bangalore',
    description: 'Spacious independent house with modern design. Large garden, covered parking, and all modern amenities. Perfect for large families.',
    price: 18000000,
    address: {
      street: '234 Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560038',
    },
    propertyType: 'house',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    amenities: ['parking', 'garden', 'security', 'power backup', 'water harvesting'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Hall (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Dining Area (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: '1BHK Studio Apartment - Pune',
    description: 'Compact and stylish studio apartment perfect for working professionals. Fully furnished with modern amenities and excellent connectivity.',
    price: 15000,
    address: {
      street: '567 Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411057',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    amenities: ['parking', 'security', 'power backup', 'fully furnished', 'WiFi', 'housekeeping'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Studio (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Commercial Retail Space - Delhi',
    description: 'Prime retail space in busy market area. High footfall, excellent visibility, perfect for showroom or retail business.',
    price: 12000000,
    address: {
      street: '789 Karol Bagh',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110005',
    },
    propertyType: 'commercial',
    listingType: 'sale',
    bedrooms: 0,
    bathrooms: 1,
    area: 1200,
    amenities: ['parking', 'security', 'power backup', 'AC', 'good visibility'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Retail Space (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Luxury 5BHK Duplex Apartment - Mumbai',
    description: 'Ultra-luxurious duplex apartment with private terrace and jacuzzi. Premium finishes, smart home automation, and concierge services.',
    price: 35000000,
    address: {
      street: '123 Juhu Beach',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400049',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 3800,
    amenities: ['parking', 'gym', 'pool', 'security', 'private terrace', 'jacuzzi', 'concierge', 'smart home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Area (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Master Suite (360°)' },
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Terrace (360°)' },
    ],
    featured: true,
    status: 'available',
  },
  {
    title: '3BHK Apartment - Hyderabad',
    description: 'Spacious 3BHK apartment in HITECH city area. Close to IT parks, schools, and hospitals. Modern amenities and excellent connectivity.',
    price: 8500000,
    address: {
      street: '890 Financial District',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500032',
    },
    propertyType: 'apartment',
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area: 1650,
    amenities: ['parking', 'gym', 'pool', 'security', 'clubhouse', 'kids play area'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Bedroom (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: '2BHK Apartment for Rent - Noida',
    description: 'Well-maintained 2BHK apartment in Sector 62. Semi-furnished with all basic amenities. Near metro station and shopping centers.',
    price: 22000,
    address: {
      street: '345 Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201309',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    amenities: ['parking', 'security', 'power backup', 'semi-furnished', 'metro connectivity'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
    ],
    featured: false,
    status: 'available',
  },
  {
    title: 'Luxury Villa with Private Pool - Goa',
    description: 'Stunning beach-facing villa with private pool and garden. Perfect for vacation home or permanent residence. Modern architecture with traditional Goan charm.',
    price: 28000000,
    address: {
      street: '123 Anjuna Beach Road',
      city: 'Goa',
      state: 'Goa',
      zipCode: '403509',
    },
    propertyType: 'villa',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    amenities: ['parking', 'private pool', 'garden', 'beach access', 'security', 'caretaker'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
    ],
    panoramicImages: [
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'Living Room (360°)' },
      { url: 'https://pannellum.org/images/jfk.jpg', roomName: 'Pool Area (360°)' },
      { url: 'https://pannellum.org/images/bma-0.jpg', roomName: 'View (360°)' },
    ],
    featured: true,
    status: 'available',
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Property.deleteMany();

    const createdUsers = await User.create(users);
    
    const sampleProperties = properties.map((property, index) => {
      return { 
        ...property, 
        owner: createdUsers[index % createdUsers.length]._id 
      };
    });

    await Property.create(sampleProperties);

    console.log('✅ Data Imported Successfully!');
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`✅ Created ${sampleProperties.length} properties`);
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();
