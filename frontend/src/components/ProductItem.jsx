import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const ProductItem = ({ id, image, name, price, sizes }) => {
    const { currency, addToCart } = useContext(ShopContext);
    const [showQuickView, setShowQuickView] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!selectedSize) {
            toast.error("Please select a size first");
            return;
        }
        addToCart(id, selectedSize);
        setShowQuickView(false);
        setSelectedSize('');
    }

    return (
        <div className='relative group bg-white rounded-xl transition-all duration-300 hover:shadow-lg p-2'>
            
            {/* Floating Action Icons - Hidden on small mobile for cleaner UI, or kept as per your preference */}
            <div className='absolute top-4 right-[-40px] group-hover:right-4 z-20 flex flex-col gap-2 transition-all duration-500 opacity-0 group-hover:opacity-100 hidden sm:flex'>
                <button 
                    onClick={(e) => { e.preventDefault(); setShowQuickView(true) }} 
                    className='w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-md hover:bg-black hover:text-white transition-colors duration-300'
                >
                    <img src={assets.cart_icon} className='w-5' alt="Add" />
                </button>
                <button 
                    onClick={(e) => { e.preventDefault(); setShowQuickView(true) }}
                    className='w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-md hover:bg-black hover:text-white transition-colors duration-300 font-bold text-[10px] uppercase'
                >
                    View
                </button>
            </div>

            {/* Tap to open QuickView on Mobile specifically */}
            <div className='absolute bottom-2 left-2 right-2 sm:hidden z-10'>
                <button 
                    onClick={(e) => { e.preventDefault(); setShowQuickView(true) }}
                    className='w-full bg-white/90 backdrop-blur-sm text-[10px] py-1 rounded shadow-sm font-bold uppercase'
                >
                    Quick Add
                </button>
            </div>

            <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
                <div className='relative overflow-hidden rounded-lg bg-gray-50'>
                    <img className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110' src={image[0]} alt={name} />
                    <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
                <div className='pt-4 pb-2 px-1 text-center'>
                    <p className='text-sm font-medium text-gray-800 line-clamp-1'>{name}</p>
                    <p className='text-base font-bold text-gray-900 mt-1'>{currency}{price}</p>
                </div>
            </Link>

            {/* --- RESPONSIVE QUICK VIEW MODAL --- */}
            {showQuickView && (
                <div className='fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowQuickView(false)}>
                    <div 
                        className='bg-white w-full sm:max-w-3xl h-[85vh] sm:h-auto rounded-t-3xl sm:rounded-2xl overflow-y-auto relative flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300' 
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        {/* Close Button - Larger touch target for mobile */}
                        <button onClick={() => setShowQuickView(false)} className='absolute top-4 right-4 text-4xl sm:text-3xl font-light z-20 bg-white/50 rounded-full w-10 h-10 flex items-center justify-center'>
                            &times;
                        </button>
                        
                        {/* Image Section - Fixed height on mobile */}
                        <div className='w-full md:w-1/2 h-64 sm:h-auto overflow-hidden'>
                            <img src={image[0]} className='w-full h-full object-cover object-top' alt={name} />
                        </div>

                        {/* Content Section */}
                        <div className='p-6 sm:p-8 flex flex-col justify-center w-full md:w-1/2'>
                            <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>{name}</h2>
                            <p className='text-lg sm:text-xl font-semibold text-gray-600 mt-1 sm:mt-2'>{currency}{price}</p>
                            
                            <div className='mt-4 sm:mt-6'>
                                <p className='text-xs sm:text-sm font-medium mb-3 uppercase tracking-wider'>Select Size</p>
                                <div className='flex gap-2 flex-wrap'>
                                    {sizes && sizes.map((item, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setSelectedSize(item)}
                                            className={`w-10 h-10 sm:w-12 sm:h-12 border rounded-full flex items-center justify-center transition-all text-sm font-medium ${item === selectedSize ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                className='bg-black text-white w-full py-4 rounded-xl mt-6 sm:mt-8 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition active:scale-95'
                            >
                                Add to Cart
                            </button>
                            
                            <Link 
                                to={`/product/${id}`} 
                                onClick={() => setShowQuickView(false)} 
                                className='text-center text-xs sm:text-sm font-medium mt-6 text-gray-400 hover:text-black underline decoration-gray-300 underline-offset-4'
                            >
                                View Full Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductItem