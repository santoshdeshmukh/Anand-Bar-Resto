/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Utensils, 
  Leaf, 
  Flame, 
  Instagram, 
  Facebook, 
  Phone,
  Clock,
  MapPin,
  Star,
  History,
  QrCode,
  CheckCircle2,
  X,
  Plus,
  Minus,
  MessageCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from './lib/utils';
import { MENU_ITEMS, CATEGORIES, MenuItem, CartItem, Order, Review } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [tableNo, setTableNo] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Restaurant' | 'Home Delivery'>('Restaurant');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPastOrdersOpen, setIsPastOrdersOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false);
  const [qrTableId, setQrTableId] = useState('1');

  // Load from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('anand_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedReviews = localStorage.getItem('anand_reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));

    // Handle QR Table No pre-fill
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setTableNo(table);
      setDeliveryType('Restaurant');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('anand_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('anand_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Derived state
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
      const matchesVeg = !isVegOnly || item.isVeg;
      return matchesSearch && matchesCategory && matchesVeg;
    });
  }, [searchQuery, selectedCategory, isVegOnly]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Actions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const handlePlaceOrder = () => {
    if (deliveryType === 'Restaurant' && !tableNo) {
      alert('Please enter your table number');
      return;
    }
    if (deliveryType === 'Home Delivery' && !address) {
      alert('Please enter your delivery address');
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      type: deliveryType,
      tableNo: deliveryType === 'Restaurant' ? tableNo : undefined,
      address: deliveryType === 'Home Delivery' ? address : undefined,
      date: new Date().toLocaleString()
    };

    // Save order locally
    setOrders(prev => [newOrder, ...prev]);

    // Construct WhatsApp message
    const WHATSAPP_NUMBER = '9284094805';
    let message = `*NEW ORDER - ANAND BAR & RESTRO*\n`;
    message += `Order ID: ${orderId}\n`;
    message += `Type: ${deliveryType}\n`;
    if (deliveryType === 'Restaurant') message += `Table No: ${tableNo}\n`;
    else message += `Address: ${address}\n`;
    message += `\n*ITEMS*\n`;
    cart.forEach(item => {
      message += `• ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    message += `\n*Total Amount: ₹${cartTotal}*\n`;
    message += `\nPlease confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // Show confirmation
    setOrderConfirmed(true);
    setCart([]);
    setIsCartOpen(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706']
    });
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#1a1a1e] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold tracking-tight text-amber-500 sm:text-2xl uppercase">
                ANAND BAR & RESTRO
              </h1>
              <div className="hidden md:block relative">
                <input 
                  type="text" 
                  placeholder="Search dishes..."
                  className="bg-[#2a2a30] border-none rounded-full px-5 py-2 w-64 text-sm focus:ring-2 focus:ring-amber-500 transition-all text-white placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold hover:bg-amber-600 cursor-pointer transition-colors">FB</div>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold hover:bg-amber-600 cursor-pointer transition-colors">IG</div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsPastOrdersOpen(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <History className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="group relative p-2 bg-[#2a2a30] rounded-lg hover:bg-gray-700 transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden flex items-center justify-center bg-[#0f0f12]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f12]/20 via-[#0f0f12]/60 to-[#0f0f12]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight text-white">
              PREMIUM DINING <br/><span className="text-amber-500 uppercase">Experience</span>
            </h2>
            
            <div className="max-w-md mx-auto mb-10 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Find your dish..."
                className="w-full bg-[#1a1a1e] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#menu" className="px-8 py-3 bg-amber-600 text-black font-bold rounded-lg hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20">
                Browse Menu
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Header & Filters */}
      <section id="menu" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-4 border-l-4 border-amber-600 pl-4">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Today's Specials</h3>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-lg transition-all text-xs font-bold uppercase",
                isVegOnly ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-[#2a2a30] border-gray-800 text-gray-500"
              )}
            >
              <Leaf className="w-3 h-3" />
              Veg Only
            </button>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="mb-12 overflow-x-auto scroller-hide">
          <div className="flex items-center gap-2 pb-4">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "whitespace-nowrap px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all",
                  selectedCategory === category 
                    ? "bg-amber-600 text-black shadow-lg" 
                    : "bg-[#1a1a1e] text-gray-500 hover:bg-gray-800 border border-gray-800"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative bg-[#1a1a1e] border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all"
              >
                <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden bg-gray-900">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    {item.isVeg ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" title="Veg" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" title="Non-Veg" />
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-200">{item.name}</h4>
                    <span className="text-amber-500 font-bold">₹{item.price}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2.5 bg-[#2a2a30] rounded-lg text-sm font-semibold hover:bg-amber-600 hover:text-black transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-neutral-500 text-lg">No items found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Review Section */}
      <section className="bg-[#1a1a1e] py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Customer Reviews</h3>
          <p className="text-2xl font-bold text-white mb-10 italic">"The best dining experience in town"</p>
          <button 
            onClick={() => setIsReviewsOpen(true)}
            className="inline-flex items-center gap-2 border border-dashed border-gray-700 px-8 py-3 text-sm text-gray-400 font-bold rounded-lg hover:text-amber-500 hover:border-amber-500 transition-all"
          >
            Leave a Review
            <Star className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1e] border-t border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h1 className="text-2xl font-bold tracking-tight text-amber-500 mb-6 uppercase">
                ANAND BAR & RESTRO
              </h1>
              <p className="text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">
                Premium hospitality and authentic culinary treats since 1998. Your comfort is our priority.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-[#0f0f12] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0f0f12] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#0f0f12] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-600 transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
              <button 
                onClick={() => setIsQRGeneratorOpen(true)}
                className="mt-8 flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-amber-500 transition-colors uppercase tracking-widest"
              >
                <QrCode className="w-4 h-4" />
                Table QR Manager
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-xs text-gray-500">
                <span className="block uppercase font-bold text-gray-400 mb-1">Available Time</span>
                11:00 AM - 11:30 PM
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-xs text-gray-500">
                <span className="block uppercase font-bold text-gray-400 mb-1">Location</span>
                Main Highway Road, Anand Chowk, Pune
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-lg">
                  <span className="text-[10px] text-black font-black uppercase text-center leading-none">Table<br/>QR</span>
                </div>
                <div className="text-xs text-gray-600">
                  Scan table QR <br/> for instant ordering
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-600 uppercase tracking-wider font-bold">
            <p>&copy; 2024 Anand Bar & Restro.</p>
            <p>
              Powered by{' '}
              <a 
                href="http://www.santoshdigitalcreator.in" 
                target="_blank" 
                rel="noreferrer"
                className="text-amber-500 hover:underline"
              >
                Santosh Deshmukh (www.santoshdigitalcreator.in)
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full sm:w-[450px] h-full sm:h-auto sm:max-h-[85vh] bg-neutral-950 border-l sm:border sm:rounded-3xl border-neutral-800 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-serif">Your Order</h3>
                  <p className="text-neutral-500 text-sm">Delicious meal is just a tap away</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-900 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-neutral-700" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Your cart is empty</h4>
                    <p className="text-neutral-500 text-sm max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Order Type Toggle */}
                    <div className="bg-neutral-900 rounded-2xl p-4">
                      <div className="flex gap-2 mb-4">
                        <button 
                          onClick={() => setDeliveryType('Restaurant')}
                          className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                            deliveryType === 'Restaurant' ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-neutral-400 hover:bg-white/5"
                          )}
                        >
                          <Utensils className="w-4 h-4" />
                          At Restaurant
                        </button>
                        <button 
                          onClick={() => setDeliveryType('Home Delivery')}
                          className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                            deliveryType === 'Home Delivery' ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-neutral-400 hover:bg-white/5"
                          )}
                        >
                          <MapPin className="w-4 h-4" />
                          Home Delivery
                        </button>
                      </div>

                      {deliveryType === 'Restaurant' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-500 ml-1 uppercase tracking-wider">Table Number</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Table 5, Corner 2"
                            value={tableNo}
                            onChange={(e) => setTableNo(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-500 ml-1 uppercase tracking-wider">Delivery Address</label>
                          <textarea 
                            placeholder="Apartment, Street, Landmark..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={2}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Order Summary</h4>
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                          <img src={item.image} className="w-16 h-16 object-cover rounded-xl shrink-0" alt={item.name} />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold truncate">{item.name}</h5>
                            <p className="text-amber-500 text-sm font-semibold">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                            <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-neutral-900 text-neutral-400 rounded">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="p-1 hover:bg-neutral-900 text-neutral-400 rounded">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="font-bold">₹{cartTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-amber-500">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20"
                  >
                    <MessageCircle className="w-5 h-5 fill-black" />
                    Order via WhatsApp
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 italic">
                    By placing an order, you will be redirected to WhatsApp to confirm.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Screen */}
      <AnimatePresence>
        {orderConfirmed && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative p-10 bg-neutral-900 rounded-[3rem] border border-neutral-800 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">Order Placed!</h3>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Thank you for choosing Anand Bar & Restro. Check your WhatsApp for order confirmation and live updates.
              </p>
              <button 
                onClick={() => setOrderConfirmed(false)}
                className="w-full py-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition-all font-bold"
              >
                Back to Menu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Past Orders Modal */}
      <AnimatePresence>
        {isPastOrdersOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPastOrdersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl h-[80vh] bg-neutral-950 border border-neutral-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif">Order History</h3>
                  <p className="text-neutral-500">Review your past favorites</p>
                </div>
                <button onClick={() => setIsPastOrdersOpen(false)} className="p-2 hover:bg-neutral-900 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {orders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <History className="w-16 h-16 mb-4" />
                    <p>No orders yet. Start your culinary journey today!</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 hover:border-amber-500/30 transition-all group">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">Order #{order.id}</span>
                            <span className="text-neutral-500 text-xs">{order.date}</span>
                          </div>
                          <p className="text-sm font-medium text-neutral-300">
                            {order.type} {order.tableNo ? `• Table ${order.tableNo}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{order.total}</p>
                          <button 
                            onClick={() => {
                              order.items.forEach(item => addToCart(item));
                              setIsPastOrdersOpen(false);
                              setIsCartOpen(true);
                            }}
                            className="text-amber-500 text-sm font-bold hover:underline underline-offset-4"
                          >
                            Reorder All
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {order.items.map(item => (
                          <div key={item.id} className="relative shrink-0">
                            <img src={item.image} className="w-14 h-14 rounded-xl object-cover" alt={item.name} />
                            <span className="absolute -bottom-1 -right-1 bg-white text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-black">
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {isReviewsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl h-[85vh] bg-neutral-950 border border-neutral-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif">Guest Reviews</h3>
                  <p className="text-neutral-500">Your experiences make us better</p>
                </div>
                <button onClick={() => setIsReviewsOpen(false)} className="p-2 hover:bg-neutral-900 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Review Form */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6">
                  <h4 className="font-bold mb-4">Leave a Review</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddReview({
                      userName: formData.get('userName') as string,
                      rating: Number(formData.get('rating')),
                      comment: formData.get('comment') as string,
                      productId: 'general'
                    });
                    (e.target as HTMLFormElement).reset();
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="userName" required placeholder="Your Name" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm" />
                      <select name="rating" className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm">
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <textarea name="comment" required placeholder="Tell us about your experience..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm resize-none" rows={3}></textarea>
                    <button type="submit" className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all">
                      Post Review
                    </button>
                  </form>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 italic">No reviews yet. Be the first to share your experience!</div>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="border-b border-neutral-900 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{review.userName}</span>
                            <div className="flex gap-0.5">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-neutral-600 font-mono tracking-tighter uppercase">{review.date}</span>
                        </div>
                        <p className="text-neutral-400 text-sm italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Generator Modal */}
      <AnimatePresence>
        {isQRGeneratorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQRGeneratorOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-[2.5rem] shadow-2xl p-8 text-center"
            >
              <button 
                onClick={() => setIsQRGeneratorOpen(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-neutral-900 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold font-serif mb-2">Table QR Generator</h3>
              <p className="text-neutral-500 text-sm mb-8 text-center">
                Generate a unique QR code for each table. Scanning this will automatically set the table number.
              </p>

              <div className="space-y-6">
                <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-3xl">
                  <QRCodeSVG 
                    value={`${window.location.origin}${window.location.pathname}?table=${qrTableId}`} 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="text-black font-black text-2xl font-serif">TABLE {qrTableId}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-black uppercase text-neutral-500 ml-1">Table No</label>
                    <input 
                      type="text" 
                      value={qrTableId}
                      onChange={(e) => setQrTableId(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button className="h-11 px-6 mt-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Generated URL</p>
                  <p className="text-[10px] text-neutral-400 break-all font-mono">
                    {window.location.origin}{window.location.pathname}?table={qrTableId}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
