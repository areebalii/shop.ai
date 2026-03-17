import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';

const Wishlist = () => {
  const { products, wishlist } = useContext(ShopContext);
  const wishlistItems = products.filter(item => wishlist.includes(item._id));

  return (
    <div className='my-10'>
      <div className='text-2xl mb-4'>
        <p className='text-gray-500'>YOUR <span className='text-gray-700 font-medium'>WISHLIST</span></p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {wishlistItems.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} sizes={item.sizes} />
        ))}
      </div>
      {wishlistItems.length === 0 && <p className='text-center text-gray-500 mt-10'>Your wishlist is empty.</p>}
    </div>
  );
};

export default Wishlist;