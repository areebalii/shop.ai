import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductItem = ({ id, image, name, price, sizes, discount, discountedPrice }) => {

    const { currency, addToCart, wishlist, toggleWishlist } = useContext(ShopContext);

    const [showQuickView, setShowQuickView] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (sizes && sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size first");
            return;
        }
        addToCart(id, selectedSize);
        setShowQuickView(false);
        setSelectedSize('');
        toast.success("Added to cart!");
    }

    const isWishlisted = wishlist.includes(id);

    return (
        /* The container now uses flex-col and h-full to ensure cards in a row match height */
        <div className='relative group bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl p-4 border border-gray-100 flex flex-col h-full'>

            {/* Discount Badge */}
            {discount > 0 && (
                <div className='absolute top-6 left-6 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-md shadow-lg'>
                    {discount}% OFF
                </div>
            )}

            {/* Action Buttons - These appear on hover */}
            <div className='absolute top-6 right-[-50px] group-hover:right-6 z-20 flex flex-col gap-3 transition-all duration-500 opacity-0 group-hover:opacity-100 hidden sm:flex'>
                <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(id); }}
                    className={`w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-lg transition-transform hover:scale-110 ${isWishlisted ? 'text-red-500' : 'text-gray-700'}`}
                >
                    <span className="text-xl">{isWishlisted ? '❤️' : '♡'}</span>
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); setShowQuickView(true) }}
                    className='w-11 h-11 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase'
                >
                    View
                </button>
            </div>

            <Link className='text-gray-700 cursor-pointer flex flex-col h-full' to={`/product/${id}`}>
                {/* INCREASED HEIGHT: aspect-[4/5] makes the image taller. 
                   INCREASED WIDTH: Because you changed your grid to 4 columns, this container 
                   automatically expands to fill that wider space.
                */}
                <div className='relative overflow-hidden rounded-xl bg-gray-50 aspect-[4/5] w-full'>
                    <img
                        className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                        src={image[0]}
                        alt={name}
                    />
                </div>

                <div className='pt-5 pb-2 text-center flex-grow flex flex-col justify-center'>
                    <p className='text-lg font-bold text-gray-900 line-clamp-1'>{name}</p>

                    <div className='flex justify-center gap-3 items-center mt-2'>
                        <p className='text-xl font-black text-gray-900'>
                            {currency}{discount > 0 ? discountedPrice : price}
                        </p>
                        {discount > 0 && (
                            <p className='text-sm text-gray-400 line-through font-medium'>
                                {currency}{price}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            {/* Quick View Modal */}
            {showQuickView && (
                <div className='fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowQuickView(false)}>
                    <div
                        className='bg-white w-full sm:max-w-3xl h-[85vh] sm:h-auto rounded-t-3xl sm:rounded-2xl overflow-y-auto relative flex flex-col md:flex-row shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setShowQuickView(false)} className='absolute top-4 right-4 text-4xl font-light z-20 bg-white/50 rounded-full w-10 h-10 flex items-center justify-center'>
                            &times;
                        </button>

                        <div className='w-full md:w-1/2 h-64 sm:h-auto overflow-hidden'>
                            <img src={image[0]} className='w-full h-full object-cover object-top' alt={name} />
                        </div>

                        <div className='p-6 sm:p-8 flex flex-col justify-center w-full md:w-1/2'>
                            <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>{name}</h2>

                            <div className='flex items-center gap-3 mt-2'>
                                <p className='text-lg sm:text-xl font-semibold text-gray-900'>
                                    {currency}{discount > 0 ? discountedPrice : price}
                                </p>
                                {discount > 0 && (
                                    <p className='text-gray-400 line-through text-sm'>{currency}{price}</p>
                                )}
                            </div>

                            <div className='mt-6'>
                                <p className='text-xs font-medium mb-3 uppercase tracking-wider text-gray-500'>Select Size</p>
                                <div className='flex gap-2 flex-wrap'>
                                    {sizes && sizes.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(item)}
                                            className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all text-sm font-medium ${item === selectedSize ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-200 hover:border-black'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className='bg-black text-white w-full py-4 rounded-xl mt-6 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition active:scale-95'
                            >
                                Add to Cart
                            </button>

                            <Link to={`/product/${id}`} onClick={() => setShowQuickView(false)} className='text-center text-xs font-medium mt-6 text-gray-400 hover:text-black underline underline-offset-4'>
                                View Full Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductItem;