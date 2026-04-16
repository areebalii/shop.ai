import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16; // Number of cards per page

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const filterAndSort = () => {
    let temp = [...products];

    if (showSearch && search) {
      temp = temp.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category.length > 0) {
      temp = temp.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      temp = temp.filter(item => subCategory.includes(item.subCategory));
    }

    switch (sortType) {
      case 'low-high':
        temp.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'high-low':
        temp.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      default:
        break;
    }
    setFilterProducts(temp);
    setCurrentPage(1); // Reset to page 1 whenever filters change
  };

  useEffect(() => {
    filterAndSort();
  }, [category, subCategory, search, showSearch, products, sortType]);

  // --- PAGINATION CALCULATIONS ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentItems = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='pt-10 border-t border-gray-100 bg-white min-h-screen px-4 sm:px-[5vw]'>
      <div className='flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-10'>
        <Title text1={'NEW'} text2={'ARRIVALS'} />
        <div className='flex items-center gap-4 w-full md:w-auto'>
          <button onClick={() => setShowFilter(!showFilter)} className='flex-1 md:flex-none px-6 py-2.5 border border-slate-900 text-slate-900 text-sm font-medium hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest'>
            {showFilter ? 'Close Filters' : 'Filter & Refine'}
          </button>
          <select onChange={(e) => setSortType(e.target.value)} className='flex-1 md:w-48 outline-none border-b-2 border-transparent focus:border-slate-900 py-2 text-sm font-medium cursor-pointer transition-all'>
            <option value="relevant">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter UI */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilter ? 'max-h-[500px] mb-12' : 'max-h-0'}`}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-slate-50 border-y border-slate-100'>
          <div>
            <p className='text-xs font-bold uppercase tracking-tighter text-slate-400 mb-4'>Category</p>
            <div className='space-y-3'>
              {['Men', 'Women', 'Kids'].map(item => (
                <label key={item} className='flex items-center gap-3 group cursor-pointer'>
                  <input type="checkbox" value={item} onChange={toggleCategory} checked={category.includes(item)} className='w-4 h-4 accent-slate-900' />
                  <span className='text-sm text-slate-600'>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-tighter text-slate-400 mb-4'>Style Type</p>
            <div className='space-y-3'>
              {['Topwear', 'Bottomwear', 'Winterwear'].map(item => (
                <label key={item} className='flex items-center gap-3 group cursor-pointer'>
                  <input type="checkbox" value={item} onChange={toggleSubCategory} checked={subCategory.includes(item)} className='w-4 h-4 accent-slate-900' />
                  <span className='text-sm text-slate-600'>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex flex-col justify-end'>
            <button onClick={() => { setCategory([]); setSubCategory([]); }} className='text-xs font-bold underline text-slate-400 hover:text-red-500 uppercase w-fit'>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid Display - Now mapping currentItems instead of filterProducts */}
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12'>
        {currentItems.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            sizes={item.sizes}
            discount={item.discount}
            discountedPrice={item.discountedPrice}
          />
        ))}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-3 mt-20 mb-10'>
          <button
            onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); scrollToTop(); }}
            disabled={currentPage === 1}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed'
          >
            Previous
          </button>

          <div className='flex gap-2'>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => { setCurrentPage(index + 1); scrollToTop(); }}
                className={`w-10 h-10 flex items-center justify-center border rounded-md text-sm font-bold transition-all ${currentPage === index + 1 ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); scrollToTop(); }}
            disabled={currentPage === totalPages}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Collection;