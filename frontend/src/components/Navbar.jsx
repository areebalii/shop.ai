import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    // State to handle the size chart modal visibility
    const [showSizeChart, setShowSizeChart] = useState(false);

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, wishlist } = useContext(ShopContext);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium relative'>

            <Link to='/'><img src={assets.logo1} className='w-36' alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700 items-center'>
                <NavLink to='/' className='flex flex-col items-center gap-1' >
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1' >
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1' >
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1' >
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                {/* Size Chart Toggle Button in Desktop Menu */}
                <button
                    onClick={() => setShowSizeChart(true)}
                    className='text-sm text-gray-700 hover:text-black cursor-pointer transition-colors pt-[2px]'
                >
                    SIZE CHART
                </button>
            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

                <div className='group relative'>
                    <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    {/* dropdown */}
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p onClick={() => navigate("/orders")} className='cursor-pointer hover:text-black'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    }
                </div>
                {/* Wishlist */}
                <Link to='/wishlist' className='relative'>
                    <span className="text-xl">♥</span>
                    {wishlist.length > 0 && (
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px]'>
                            {wishlist.length}
                        </p>
                    )}
                </Link>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/*Sidebar menu for small screen*/}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-50 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600 h-full'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    {/* FIXED PATHS BELOW (Added absolute slashes '/') */}
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>

                    {/* Size Chart Button in Mobile Sidebar */}
                    <button
                        onClick={() => { setVisible(false); setShowSizeChart(true); }}
                        className='py-2 pl-6 border text-left font-medium text-gray-600 cursor-pointer hover:bg-slate-50'
                    >
                        SIZE CHART
                    </button>
                </div>
            </div>

            {/* --- SIZE CHART MODAL POPUP WITH SMART ZOOM --- */}
            {showSizeChart && (
                <div
                    className='fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4'
                    onClick={() => setShowSizeChart(false)}
                >
                    <div
                        className='bg-white rounded-lg max-w-4xl w-full p-4 relative shadow-2xl flex flex-col items-center max-h-[90vh]'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowSizeChart(false)}
                            className='absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer transition-colors z-50 bg-white/80 px-2 rounded-full shadow-sm'
                        >
                            &times;
                        </button>

                        {/* Scrollable & Zoomable Image Wrapper */}
                        <div className='w-full overflow-auto mt-6 flex justify-start md:justify-center items-start border border-gray-100 rounded bg-slate-50 matches-scrollbar'>
                            <img
                                src={assets.sizeChart}
                                className='w-auto max-w-[none] min-w-[600px] md:min-w-[800px] h-auto object-contain  origin-top-left md:origin-center p-2'
                                alt="Clothing Size Chart"
                            />
                        </div>

                        {/* Helpful instruction hint for mobile/desktop shoppers */}
                        <p className='text-xs text-gray-400 mt-2 text-center hidden sm:block'>
                            💡 Hover over the chart to zoom. Use scrollbars if needed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar