import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products, currency } = useContext(ShopContext);
  const [resultItems, setResultItems] = useState([]);

  useEffect(() => {
    if (showSearch && search.trim().length > 0) {
      const filtered = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
      setResultItems(filtered.slice(0, 4));
    } else {
      setResultItems([]);
    }
  }, [search, showSearch, products]);

  if (!showSearch) return null;

  return (
    <div className='fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-4'>
      {/* Backdrop Blur */}
      <div
        onClick={() => setShowSearch(false)}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn'
      ></div>

      {/* Main Search Modal */}
      <div className='bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-[1001] animate-slideUp'>

        {/* Search Input Area */}
        <div className='flex items-center px-6 py-5 border-b border-gray-100'>
          <img src={assets.search_icon} className='w-5 opacity-40' alt="" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 bg-transparent border-none outline-none px-4 text-lg font-medium text-gray-800 placeholder:text-gray-300'
            type="text"
            placeholder='Search collection...'
          />
          <kbd className='hidden sm:inline-block px-2 py-1 text-[10px] font-bold text-gray-400 border border-gray-200 rounded-md shadow-sm'>ESC</kbd>
        </div>

        <div className='flex flex-col md:flex-row min-h-[300px]'>

          {/* Left Side: Category Quick Links */}
          <div className='w-full md:w-48 bg-gray-50 p-6 border-r border-gray-100'>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>Categories</p>
            <div className='flex flex-row md:flex-col gap-2'>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearch(cat)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${search.toLowerCase() === cat.toLowerCase() ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Results */}
          <div className='flex-1 p-6'>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>
              {resultItems.length > 0 ? 'Top Suggestions' : 'Trending Now'}
            </p>

            <div className='space-y-3'>
              {resultItems.length > 0 ? (
                resultItems.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => { setShowSearch(false); setSearch(''); }}
                    className='flex items-center gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-all group'
                  >
                    <div className='w-12 h-14 rounded-xl overflow-hidden bg-gray-100'>
                      <img src={item.image[0]} className='w-full h-full object-cover group-hover:scale-110 transition-transform' alt="" />
                    </div>
                    <div>
                      <p className='text-sm font-bold text-gray-800'>{item.name}</p>
                      <p className='text-xs text-gray-400'>{currency}{item.price}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='py-10 text-center'>
                  <p className='text-sm text-gray-300'>Try searching for "Winterwear" or "Latest"</p>
                </div>
              )}
            </div>

            {resultItems.length > 0 && (
              <Link
                to='/collection'
                onClick={() => setShowSearch(false)}
                className='mt-6 block text-center py-3 rounded-xl bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-colors'
              >
                View full results
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;