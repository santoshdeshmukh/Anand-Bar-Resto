export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating?: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  type: 'Restaurant' | 'Home Delivery';
  tableNo?: string;
  address?: string;
  date: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Veg Thali',
    description: 'A complete meal with dal, rice, rotis, two veg curries, and dessert.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop',
    category: 'Thali',
    isVeg: true,
  },
  {
    id: '2',
    name: 'Paneer Butter Masala',
    description: 'Soft paneer cubes cooked in a rich and creamy tomato-based gravy.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop',
    category: 'Veg Specials',
    isVeg: true,
  },
  {
    id: '3',
    name: 'Chicken Dum Biryani',
    description: 'Fragrant basmati rice layered with succulent chicken pieces and spices.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1563379091339-03b1cbb6db4d?q=80&w=1000&auto=format&fit=crop',
    category: 'Biryani',
    isVeg: false,
  },
  {
    id: '4',
    name: 'Mutton Curry',
    description: 'Tender mutton pieces slow-cooked in a traditional spicy gravy.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop',
    category: 'Mutton Specials',
    isVeg: false,
  },
  {
    id: '5',
    name: 'Fish Fry',
    description: 'Crispy marinated fish slices fried to perfection.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop',
    category: 'Sea Food',
    isVeg: false,
  },
  {
    id: '6',
    name: 'Garlic Butter Naan',
    description: 'Soft and fluffy Indian bread topped with garlic and butter.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1000&auto=format&fit=crop',
    category: 'Breads',
    isVeg: true,
  },
  {
    id: '7',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with aromatic spices and ghee.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=1000&auto=format&fit=crop',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '8',
    name: 'Chicken Lollipop',
    description: 'Deep-fried chicken wings served with spicy schezwan sauce.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1527477396000-dcad6c3f06d2?q=80&w=1000&auto=format&fit=crop',
    category: 'Starters',
    isVeg: false,
  },
];

export const CATEGORIES = [
  'All Items',
  'Thali',
  'Veg Specials',
  'Biryani',
  'Mutton Specials',
  'Sea Food',
  'Breads',
  'Main Course',
  'Starters'
];
