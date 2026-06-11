// components/ProductGalleryEnhanced.tsx
import React, { useState } from 'react';
import {
  Search,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  FilterX,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
} from 'lucide-react';

// Sample hygiene product data
const products = [
  {
    id: 1,
    name: 'Dettol Antiseptic Liquid 500ml',
    category: 'Sanitizers',
    price: 12.99,
    originalPrice: 15.49,
    rating: 4.8,
    reviews: 234,
    image:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'Best Seller',
    featured: true,
  },
  {
    id: 2,
    name: 'Premium Hand Sanitizer with Aloe Vera',
    category: 'Sanitizers',
    price: 8.50,
    rating: 4.7,
    reviews: 189,
    image:
      'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: null,
    featured: false,
  },
  {
    id: 3,
    name: 'Kleenex Ultra Soft Tissues 3‑Ply',
    category: 'Tissue Papers',
    price: 5.99,
    rating: 4.6,
    reviews: 456,
    image:
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'Popular',
    featured: false,
  },
  {
    id: 4,
    name: 'Harpic Disinfectant Toilet Cleaner',
    category: 'Cleaners',
    price: 4.25,
    rating: 4.5,
    reviews: 321,
    image:
      'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=400&auto=format&fit=crop',
    stock: 'Low Stock',
    badge: null,
    featured: false,
  },
  {
    id: 5,
    name: 'Scott Paper Towels Mega Roll',
    category: 'Tissue Papers',
    price: 10.99,
    originalPrice: 13.99,
    rating: 4.4,
    reviews: 198,
    image:
      'https://images.unsplash.com/photo-1584473457406-624048b5bf37?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'Eco',
    featured: true,
  },
  {
    id: 6,
    name: 'Dettol Surface Cleaner Spray 750ml',
    category: 'Cleaners',
    price: 6.75,
    rating: 4.9,
    reviews: 112,
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'New',
    featured: false,
  },
  {
    id: 7,
    name: 'Aloe Vera Moisturizing Sanitizer',
    category: 'Sanitizers',
    price: 7.99,
    rating: 4.3,
    reviews: 67,
    image:
      'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: null,
    featured: false,
  },
  {
    id: 8,
    name: 'Facial Tissues with Lotion',
    category: 'Tissue Papers',
    price: 3.49,
    rating: 4.6,
    reviews: 290,
    image:
      'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'Value',
    featured: false,
  },
  {
    id: 9,
    name: 'Lysol Disinfectant Wipes',
    category: 'Sanitizers',
    price: 9.99,
    originalPrice: 11.99,
    rating: 4.7,
    reviews: 178,
    image:
      'https://images.unsplash.com/photo-1624727828489-a77b4e4a58f9?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: 'Sale',
    featured: false,
  },
  {
    id: 10,
    name: 'Toilet Paper Rolls 12 Pack',
    category: 'Tissue Papers',
    price: 14.50,
    rating: 4.2,
    reviews: 512,
    image:
      'https://images.unsplash.com/photo-1584473457406-624048b5bf37?w=400&auto=format&fit=crop',
    stock: 'In Stock',
    badge: null,
    featured: false,
  },
];

const categories = ['All', 'Sanitizers', 'Tissue Papers', 'Cleaners'];
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

export default function ProductGalleryEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<{ id: number; quantity: number }[]>([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const toggleWishlist = (id: number) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filter + Sort
  const filteredProducts = products
    .filter(product => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id; // mock
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // featured first
      }
    });

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto font-poppins">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-500 to-[#5E42D4] rounded-[24px] p-6 sm:p-8 mb-10 overflow-hidden shadow-lg shadow-indigo-200/50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=1200&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-indigo-200" />
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                limited time offer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Hygiene & Protection</h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-md">
              Keep your home and hands clean with trusted brands. Up to 30% off on select items.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white text-indigo-600 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
              Shop Now
            </button>
            <div className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
              <TrendingUp size={18} />
              <span>1,200+ sold this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Cart Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">All Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <button className="relative inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
          <ShoppingCart size={18} />
          Cart
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FilterX size={16} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Sort</span>
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-1">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear */}
        {(selectedCategory !== 'All' || searchQuery || sortBy !== 'featured') && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors ml-auto"
          >
            <FilterX size={16} />
            Clear all
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden"
            >
              {/* Image with Overlay */}
              <div className="relative h-52 bg-slate-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 duration-200">
                  <button
                    className="p-2.5 bg-white rounded-full text-slate-700 shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Quick view"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="p-2.5 bg-white rounded-full text-slate-700 shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
                {/* Badges */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-indigo-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {product.stock !== 'In Stock' && (
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-red-500 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {product.stock}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  {product.category}
                </span>
                <h3 className="text-sm font-semibold text-slate-800 leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex items-center text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium text-slate-600 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviews})</span>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-slate-800">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        wishlist.includes(product.id)
                          ? 'bg-red-50 text-red-500'
                          : 'bg-slate-50 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
          <Search size={48} className="mb-4" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredProducts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
            Load more products
          </button>
        </div>
      )}
    </div>
  );
}
