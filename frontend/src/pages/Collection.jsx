import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setsortType] = useState('relevant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='pt-10 border-t border-gray-100 bg-white min-h-screen px-4 sm:px-[5vw]'>

      {/* --- HEADER & SORT --- */}
      <div className='flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-10'>
        <Title text1={'NEW'} text2={'ARRIVALS'} />
        <div className='flex items-center gap-4 w-full md:w-auto'>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className='flex-1 md:flex-none px-6 py-2.5 border border-slate-900 text-slate-900 text-sm font-medium hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest'
          >
            {showFilter ? 'Close Filters' : 'Filter & Refine'}
          </button>
          <select
            onChange={(e) => setsortType(e.target.value)}
            className='flex-1 md:w-48 outline-none border-b-2 border-transparent focus:border-slate-900 py-2 text-sm font-medium cursor-pointer transition-all'
          >
            <option value="relevant">Sort: Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* --- EXPANDABLE FILTER BOX --- */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilter ? 'max-h-[500px] mb-12' : 'max-h-0'}`}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-slate-50 border-y border-slate-100'>
          <div>
            <p className='text-xs font-bold uppercase tracking-tighter text-slate-400 mb-4'>Category</p>
            <div className='space-y-3'>
              {['Men', 'Women', 'Kids'].map(item => (
                <label key={item} className='flex items-center gap-3 group cursor-pointer'>
                  <input type="checkbox" value={item} onChange={toggleCategory} checked={category.includes(item)} className='w-4 h-4 accent-slate-900 cursor-pointer' />
                  <span className='text-sm text-slate-600 group-hover:text-black transition-colors'>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-tighter text-slate-400 mb-4'>Style Type</p>
            <div className='space-y-3'>
              {['Topwear', 'Bottomwear', 'Winterwear'].map(item => (
                <label key={item} className='flex items-center gap-3 group cursor-pointer'>
                  <input type="checkbox" value={item} onChange={toggleSubCategory} checked={subCategory.includes(item)} className='w-4 h-4 accent-slate-900 cursor-pointer' />
                  <span className='text-sm text-slate-600 group-hover:text-black transition-colors'>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex flex-col justify-end'>
            <button onClick={() => { setCategory([]); setSubCategory([]); }} className='text-xs font-bold underline text-slate-400 hover:text-red-500 transition-colors uppercase text-left w-fit'>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12'>
        {filterProducts.length > 0 ? (
          filterProducts.map((item, index) => (
            <div key={index} className='hover:scale-[1.02] transition-transform duration-300'>
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                sizes={item.sizes}
                discount={item.discount}
                discountedPrice={item.discountedPrice}
              />
            </div>
          ))
        ) : (
          <div className='col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl'>
            <p className='text-slate-400 font-light text-lg'>No pieces found in this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;