import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import axios from 'axios';

/*************  ✨ Windsurf Command 🌟  *************/
/**
 * SearchBar Component
 * 
 * This component renders a search input and a side panel 
 * that displays search results. It also includes an AI 
 * powered suggestion section.
 * 
 * @returns {JSX.Element} The rendered SearchBar component
 */
const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products, currency } = useContext(ShopContext);
  const [resultItems, setResultItems] = useState([]);
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

  /**
   * Auto-focus the input when the drawer slides in
   */
  // Auto-focus the input when the drawer slides in
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 400);
    }
  }, [showSearch]);


  useEffect(() => {
    const getGlobalResults = async () => {
      const query = search.trim().toLowerCase();
      if (query.length > 1) {
        setLoading(true);

        // 1. DYNAMIC EXTRACTION (Price, Category, Color)
        const priceMatch = query.match(/\d+/);
        const priceLimit = priceMatch ? parseInt(priceMatch[0]) : null;
        const isUnder = query.includes("under") || query.includes("below") || query.includes("<");
        const isOver = query.includes("above") || query.includes("over") || query.includes(">");

        // 2. MULTI-LAYERED FILTERING
        let filtered = products.filter(item => {
          const name = item.name.toLowerCase();
          const cat = item.category.toLowerCase();
          const subCat = item.subCategory.toLowerCase();

          // Keyword Match (Name, Category, or Sub-Category)
          const matchesKeyword = name.includes(query) || cat.includes(query) || subCat.includes(query);

          // Price Logic
          let matchesPrice = true;
          if (priceLimit) {
            if (isUnder) matchesPrice = item.price <= priceLimit;
            if (isOver) matchesPrice = item.price >= priceLimit;
          }

          // Return true only if it passes all active constraints
          return matchesKeyword && matchesPrice;
        });

        try {
          // 3. AI SEMANTIC LAYER (Groq)
          // We ask the AI to find products that "feel" like the search even if the names don't match
          const res = await axios.post('http://localhost:3000/api/chat/ask', {
            message: `User Query: "${search}". 
          Available Inventory: ${products.map(p => p.name).join(", ")}.
          Identify which 3 products best fit this intent and provide a luxury style tip.`
          });

          const aiResponse = res.data.reply;
          setAiTip(aiResponse);

          // 4. CROSS-REFERENCE AI MENTIONS WITH REAL DATA
          const aiSuggested = products.filter(p => {
            const isMentioned = aiResponse.toLowerCase().includes(p.name.toLowerCase());
            // Ensure AI suggestions also respect the user's price limit
            if (priceLimit && isUnder) return isMentioned && p.price <= priceLimit;
            if (priceLimit && isOver) return isMentioned && p.price >= priceLimit;
            return isMentioned;
          });

          // 5. MERGE & DEDUPLICATE
          const finalResults = [...new Map([...filtered, ...aiSuggested].map(item => [item._id, item])).values()];
          setResultItems(finalResults.slice(0, 6));

        } catch (e) {
          setResultItems(filtered.slice(0, 6));
        }
        setLoading(false);
      } else {
        setResultItems([]);
        setAiTip("");
      }
    };

    const timer = setTimeout(getGlobalResults, 400);
    return () => clearTimeout(timer);
  }, [search, products]);

  return (
    <>
      {/* Backdrop Blur Layer */}
      <div
        onClick={() => setShowSearch(false)}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] transition-opacity duration-500 ${showSearch ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      ></div>

      {/* --- SIDE SEARCH PANEL --- */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[1000] shadow-2xl transform transition-transform duration-500 ease-in-out ${showSearch ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className='flex flex-col h-full p-8'>

          {/* Header */}
          <div className='flex justify-between items-center mb-10'>
            <p className='text-xs font-black uppercase tracking-[0.4em] text-slate-400'>Search WearWell</p>
            <button onClick={() => setShowSearch(false)} className='p-2 hover:bg-slate-50 rounded-full transition-colors'>
              <img src={assets.cross_icon} className='w-3' alt="" />
            </button>
          </div>

          {/* Search Input Container */}
          <div className='relative group mb-6'>
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collection..."
              className='w-full text-2xl font-light border-b border-slate-100 py-3 outline-none focus:border-black transition-all placeholder:text-slate-200'
            />
            {loading && <div className='absolute right-0 top-4 w-4 h-4 border-2 border-slate-200 border-t-black rounded-full animate-spin'></div>}
          </div>

          {/* AI Insight Section */}
          <div className={`transition-all duration-500 overflow-hidden ${aiTip ? 'max-h-32 mb-4' : 'max-h-0'}`}>
            <div className='bg-slate-50 p-3 rounded-lg border border-slate-100'>
              <p className='text-[10px] inline-block bg-slate-900 text-white px-2 py-0.5 rounded font-bold uppercase mb-2'>
                AI Suggestion
              </p>
              <p className='text-xs italic text-slate-600 leading-relaxed max-h-20 overflow-y-auto custom-scrollbar'>
                "{aiTip}"
              </p>
            </div>
          </div>

          {/* Results Area */}
          <div className='flex-1 overflow-y-auto mt-6 custom-scrollbar'>
            {resultItems.length > 0 ? (
              <div className='space-y-6'>
                {resultItems.map((item, index) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => setShowSearch(false)}
                    className='flex gap-4 group animate-in slide-in-from-right-4 fill-mode-both'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='w-20 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0'>
                      <img src={item.image[0]} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' alt="" />
                    </div>
                    <div className='flex flex-col justify-center'>
                      <p className='text-sm font-bold text-slate-800 group-hover:text-black transition-colors'>{item.name}</p>
                      <p className='text-sm font-medium text-slate-400'>{currency}{item.price}</p>
                      <p className='text-[10px] uppercase tracking-tighter text-slate-300 mt-1'>{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='mt-10'>
                <p className='text-[10px] font-bold uppercase text-slate-400 mb-4'>Popular Categories</p>
                <div className='flex flex-wrap gap-2'>
                  {['Men', 'Women', 'Winterwear', 'Topwear'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearch(tag)}
                      className='px-4 py-2 border border-slate-100 rounded-lg text-xs font-bold hover:bg-black hover:text-white transition-all'
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Link */}
          <Link
            to='/collection'
            onClick={() => setShowSearch(false)}
            className='mt-6 py-4 bg-slate-900 text-white text-center text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors'
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </>
  );
};
/*******  26470353-bdc5-4b1e-9d3b-037651820a38  *******/

export default SearchBar;