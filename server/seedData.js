const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    name: 'Akshar Madan',
    email: 'aksharmadan@gmail.com',
    password: 'akshar123',
    role: 'agent',
    phone: '9876543210',
  },
  {
    name: 'John Agent',
    email: 'agent@example.com',
    password: '123456',
    role: 'agent',
    phone: '9876543211',
  },
  {
    name: 'Buyer One',
    email: 'buyer@example.com',
    password: '123456',
    role: 'buyer',
    phone: '9876543212',
  },
];

const properties = [
  {
    title: 'Luxury 3BHK Apartment in Mumbai',
    description: 'Spacious 3BHK apartment with stunning sea views, modern amenities, and prime location.',
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
    amenities: ['parking', 'gym', 'pool', 'security', '24x7 water', 'power backup'],
    featured: true,
    status: 'available',
  },
  {
    title: 'Beautiful Villa in Gurgaon',
    description: 'Independent villa with garden, perfect for families. Modern architecture with all amenities.',
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
    amenities: ['parking', 'garden', 'security', 'clubhouse', 'power backup'],
    featured: true,
    status: 'available',
  },
  {
    title: 'Modern 2BHK Apartment for Rent',
    description: 'Well-maintained 2BHK apartment in prime location, close to IT parks and shopping centers.',
    price: 35000,
    address: {
      street: '789 Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560066',
    },
    propertyType: 'apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ['parking', 'gym', 'security', 'power backup'],
    featured: false,
    status: 'available',
  },
  {
    title: 'Commercial Office Space in Delhi',
    description: 'Premium office space in corporate hub, ideal for IT companies and startups.',
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
    amenities: ['parking', 'elevator', '24x7 security', 'power backup', 'cafeteria'],
    featured: true,
    status: 'available',
  },
  {
    title: 'Cozy 1BHK Apartment Near Metro',
    description: 'Affordable 1BHK apartment with excellent connectivity to metro and public transport.',
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
    amenities: ['parking', 'security', 'power backup'],
    featured: false,
    status: 'available',
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Property.deleteMany();

    const createdUsers = await User.create(users);
    const agentUser = createdUsers[0];

    const sampleProperties = properties.map(property => {
      return { ...property, owner: agentUser._id };
    });

    await Property.create(sampleProperties);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Property.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
