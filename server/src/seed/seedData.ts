import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MenuItem } from '../models/MenuItem';
import { Category } from '../models/Category';
import { Review } from '../models/Review';
import { GalleryItem } from '../models/GalleryItem';
import { IMenuItem, ICategory, IReview, IGalleryItem } from '../types';


dotenv.config();

export const initialCategories: ICategory[] = [
  { name: 'All', slug: 'all', description: 'Complete culinary experience', displayOrder: 0 },
  { name: 'Starters', slug: 'starters', description: 'Artisanal bites to awaken the palate', displayOrder: 1 },
  { name: 'Main Course', slug: 'main-course', description: 'Masterfully prepared signature entrees', displayOrder: 2 },
  { name: 'Pizza', slug: 'pizza', description: 'Wood-fired neapolitan dough with truffle & bufala', displayOrder: 3 },
  { name: 'Pasta', slug: 'pasta', description: 'Handcrafted bronze-die pasta & rich reductions', displayOrder: 4 },
  { name: 'Desserts', slug: 'desserts', description: 'Sweet decadent creations & rare chocolates', displayOrder: 5 },
  { name: 'Drinks', slug: 'drinks', description: 'Fresh cold-pressed fruit juices & organic blends', displayOrder: 6 },
];

export const initialMenuItems: IMenuItem[] = [
  // Starters
  {
    title: 'Seared Wagyu Carpaccio',
    description: 'Thinly sliced A5 Japanese Wagyu, shaved black winter truffle, aged Parmigiano Reggiano crisp, drizzled with 25-year balsamic glaze.',
    price: 38,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    ingredients: ['A5 Wagyu Beef', 'Black Truffle', 'Parmigiano Reggiano', 'Micro Herbs', 'Balsamic Reduction'],
    calories: 420,
    preparationTime: '15 mins'
  },
  {
    title: 'Burrata Con Tartufata',
    description: 'Creamy Pugliese burrata, heirloom cherry tomato confit, fresh basil emulsion, toasted pine nuts, served with grilled sourdough.',
    price: 26,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    ingredients: ['Pugliese Burrata', 'Heirloom Tomatoes', 'Truffle Oil', 'Basil Emulsion', 'Artisanal Sourdough'],
    calories: 510,
    preparationTime: '12 mins'
  },
  {
    title: 'Hokkaido Scallop Ceviche',
    description: 'Wild Hokkaido sea scallops marinated in yuzu-lime juice, avocado mousse, shaved radish, habanero oil & squid ink coral tuple.',
    price: 32,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isSpicy: true,
    isGlutenFree: true,
    ingredients: ['Hokkaido Scallops', 'Yuzu', 'Avocado', 'Radish', 'Squid Ink Tuple'],
    calories: 310,
    preparationTime: '15 mins'
  },

  // Main Course
  {
    title: 'Dry-Aged Tomahawk Steak',
    description: '45-day dry-aged Prime Angus Tomahawk roasted over binchotan charcoal, bone marrow jus, smoked sea salt & roasted garlic bulb.',
    price: 145,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    ingredients: ['Dry-Aged Angus Ribeye', 'Roasted Garlic', 'Rosemary Butter', 'Bone Marrow Reduction'],
    calories: 1150,
    preparationTime: '30 mins'
  },
  {
    title: 'Pan-Roasted Chilean Sea Bass',
    description: 'Wild caught Chilean sea bass, saffron velouté, caramelized fennel puree, baby carrots & crispy leek ribbons.',
    price: 58,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true,
    ingredients: ['Chilean Sea Bass', 'Saffron', 'Caramelized Fennel', 'Baby Carrots', 'Extra Virgin Olive Oil'],
    calories: 680,
    preparationTime: '22 mins'
  },
  {
    title: 'Duck Breast À L’Orange',
    description: 'Crispy skin Moulard duck breast, blood orange reduction, charred broccolini, parsnip silk & toasted pistachios.',
    price: 49,
    category: 'main-course',
    image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: false,
    ingredients: ['Moulard Duck', 'Blood Orange Jus', 'Parsnip Purée', 'Pistachio Crumble'],
    calories: 740,
    preparationTime: '25 mins'
  },

  // Pizza
  {
    title: 'Tartufo e Funghi Pizza',
    description: '48-hour fermented sourdough crust, black truffle cream, Fior di Latte mozzarella, roasted chanterelle mushrooms & wild thyme.',
    price: 34,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isChefSpecial: true,
    ingredients: ['Sourdough', 'Black Truffle Paste', 'Fior di Latte', 'Chanterelle Mushrooms', 'Thyme'],
    calories: 890,
    preparationTime: '18 mins'
  },
  {
    title: 'Wagyu Bresaola & Ruccola',
    description: 'San Marzano DOP tomato sauce, Bufala mozzarella, 24-month cured Wagyu bresaola, wild arugula & shaved Parmigiano.',
    price: 36,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    ingredients: ['San Marzano Tomatoes', 'Bufala Mozzarella', 'Wagyu Bresaola', 'Wild Arugula'],
    calories: 920,
    preparationTime: '15 mins'
  },

  // Pasta
  {
    title: 'Handcrafted Truffle Tagliolini',
    description: 'Bronze-cut handmade fresh egg pasta tossed in cultured Normandy butter, emulsion of Parmigiano Reggiano, showered with fresh shaved seasonal black truffles.',
    price: 44,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isChefSpecial: true,
    ingredients: ['Fresh Tagliolini', 'Normandy Butter', 'Black Truffle', 'Parmigiano 36 Months'],
    calories: 720,
    preparationTime: '16 mins'
  },
  {
    title: 'Lobster & Saffron Agnolotti',
    description: 'Pillow pasta stuffed with poached Maine lobster & ricotta, served in a rich saffron-infused bisque with baby basil.',
    price: 48,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    ingredients: ['Maine Lobster', 'Handmade Agnolotti', 'Saffron Bisque', 'Ricotta', 'Fresh Tarragon'],
    calories: 650,
    preparationTime: '20 mins'
  },

  // Desserts
  {
    title: 'Noir Chocolate Sphere',
    description: '70% Valrhona Dark Chocolate shell poured over with hot espresso caramel, salted vanilla bean gelato & edible 24k gold leaf.',
    price: 24,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isChefSpecial: true,
    ingredients: ['Valrhona Dark Chocolate', 'Vanilla Bean Gelato', 'Espresso Caramel', 'Gold Leaf'],
    calories: 580,
    preparationTime: '10 mins'
  },
  {
    title: 'Deconstructed Pistachio Tiramisu',
    description: 'Sicilian pistachio cream, espresso-infused ladyfingers, whipped mascarpone mousse & bronzed pistachio crumble.',
    price: 22,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    ingredients: ['Mascarpone', 'Bronzed Pistachio', 'Single Origin Espresso', 'Ladyfingers'],
    calories: 490,
    preparationTime: '8 mins'
  },

  // Drinks
  {
    title: 'Cold-Pressed Orange & Passion Fruit Juice',
    description: 'Freshly squeezed Valencia oranges, tropical passion fruit nectar, and fresh mint over crystal clear ice.',
    price: 14,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    ingredients: ['Organic Valencia Oranges', 'Passion Fruit Nectar', 'Fresh Mint', 'Crushed Ice'],
    calories: 120,
    preparationTime: '5 mins'
  },
  {
    title: 'Fresh Wild Berry & Watermelon Juice',
    description: 'Pure hand-pressed watermelon juice blended with fresh wild raspberries, blueberries, and a fresh lime twist.',
    price: 15,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Cold-Pressed Watermelon', 'Wild Raspberries', 'Blueberries', 'Fresh Lime'],
    calories: 130,
    preparationTime: '3 mins'
  }
];

export const initialReviews: IReview[] = [
  {
    name: 'Arthur Vance',
    rating: 5,
    comment: "An absolute masterpiece of gastronomy. The Wagyu Carpaccio and Truffle Tagliolini were out of this world. The dark, intimate atmosphere made our anniversary evening truly unforgettable.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'Michelin Guide Inspector',
    date: '2 weeks ago'
  },
  {
    name: 'Marcus Thorne',
    rating: 5,
    comment: "L'Étoile Noir sets the gold standard for luxury dining. From the seamless service to the fresh cold-pressed fruit juices, every single detail exudes refinement.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Food & Dining Critic',
    date: '1 month ago'
  },
  {
    name: 'Julian Laurent',
    rating: 5,
    comment: "The Noir Chocolate Sphere dessert is pure magic on a plate! Watching the warm caramel dissolve the shell was pure culinary theater. Highly recommended!",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'Gastronomy Blogger',
    date: '3 weeks ago'
  }
];

export const initialGalleryItems: IGalleryItem[] = [
  {
    title: 'The Main Dining Salon',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
    caption: 'Atmospheric obsidian dining room featuring hand-crafted brass fixtures and ambient candlelight.',
    spanClass: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    title: 'Seared Hokkaido Scallops',
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    caption: 'Fresh scallops garnished with squid ink tuile and micro herbs.',
    spanClass: 'col-span-1 row-span-1'
  },
  {
    title: 'Chef Antoine Guérin',
    category: 'chef',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    caption: 'Executive Chef Antoine preparing the signature truffle emulsion.',
    spanClass: 'col-span-1 row-span-1'
  },
  {
    title: 'Handcrafted Fruit Juice Bar',
    category: 'ambiance',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    caption: 'Fresh juice counter serving artisanal cold-pressed fruit juices and organic fruit infusions.',
    spanClass: 'col-span-1 row-span-1'
  },
  {
    title: 'Wood-Fired Pizza Oven',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    caption: 'Custom built Tuscan volcanic stone oven heated to 900°F.',
    spanClass: 'col-span-1 md:col-span-2 row-span-1'
  }
];

import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const seedDatabase = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db';
    await mongoose.connect(connStr);
    console.log('[Seeder] Connected to MongoDB.');

    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await GalleryItem.deleteMany({});

    await Category.insertMany(initialCategories);
    await MenuItem.insertMany(initialMenuItems);
    await Review.insertMany(initialReviews);
    await GalleryItem.insertMany(initialGalleryItems);

    // Seed Admin Account if not existing
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: "L'Étoile Noir Manager",
        email: adminEmail,
        phone: '+1 (555) 019-2831',
        passwordHash,
        role: 'admin'
      });
      console.log(`[Seeder] Created default admin user: ${adminEmail}`);
    } else {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`[Seeder] Admin account verified: ${adminEmail}`);
    }

    console.log('[Seeder] Successfully seeded initial restaurant menu, categories, reviews, gallery items, and admin account!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedData.ts')) {
  seedDatabase();
}
