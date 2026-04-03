import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {

  const { productId } = useParams();
  const { products, setProducts, currency, addToCart, token, backendUrl, userId } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  // State for "Show More" reviews
  const [visibleReviews, setVisibleReviews] = useState(3);

  const fetchProductData = async () => {
    if (products.length > 0) {
      const foundProduct = products.find((item) => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image[0]);
      }
    }
  }

  const deleteReview = async () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        const response = await axios.post(backendUrl + '/api/product/delete-review',
          { productId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success(response.data.message);

          const updatedProducts = products.map((item) => {
            if (item._id === productId) {
              return { ...item, reviews: item.reviews.filter(r => r.userId !== userId) };
            }
            return item;
          });
          setProducts(updatedProducts);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  const submitReview = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? '/api/product/update-review' : '/api/product/review';

    try {
      const response = await axios.post(backendUrl + endpoint,
        { productId, rating, comment },
        { headers: { token } }
      );

      if (response.data.success) {
        const updatedReview = { userId, userName: "You", rating, comment, date: Date.now() };

        const updatedProducts = products.map((item) => {
          if (item._id === productId) {
            const newReviews = isEditing
              ? item.reviews.map(r => r.userId === userId ? updatedReview : r)
              : [...item.reviews, updatedReview];

            return { ...item, reviews: newReviews };
          }
          return item;
        });

        setProducts(updatedProducts);
        setComment("");
        setRating(5);
        setIsEditing(false);
        toast.success(isEditing ? "Review updated!" : "Review posted!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleAddToCart = async () => {
    if (!size) {
      toast.error("Please select a size first");
      return;
    }

    try {
      await addToCart(productData._id, size);
      toast.success("Added to cart successfully!");
      setSize(''); // This clears the selection from the UI
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // scroll to top 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setVisibleReviews(3);
  }, [productId]);

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const averageRating = productData.averageRating || 0;
  const reviewCount = productData.reviews ? productData.reviews.length : 0;

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4'>

      {/* --- Product Details Section --- */}
      <div className='flex gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-md border hover:border-black transition' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%] relative'>
            <img className='w-full h-auto rounded-lg shadow-sm' src={image} alt="" />

            {/* DISCOUNT BADGE */}
            {productData.discount > 0 && (
              <div className='absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider'>
                {productData.discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-bold text-3xl mt-2 text-gray-800 uppercase tracking-tight'>{productData.name}</h1>

          <div className='flex items-center gap-1 mt-3'>
            {[1, 2, 3, 4, 5].map((num) => (
              <img key={num} src={num <= averageRating ? assets.star_icon : assets.star_dull_icon} alt="" className='w-4' />
            ))}
            <p className='pl-2 text-gray-400 font-medium text-sm'>({reviewCount} reviews)</p>
          </div>

          {/* PRICE SECTION */}
          <div className='flex items-center gap-4 mt-5'>
            <p className='text-4xl font-bold text-gray-900'>
              {currency}{productData.discount > 0 ? productData.discountedPrice : productData.price}
            </p>
            {productData.discount > 0 && (
              <p className='text-xl text-gray-400 line-through mt-2 font-light'>
                {currency}{productData.price}
              </p>
            )}
          </div>

          {productData.discount > 0 && (
            <p className='text-green-600 font-bold text-sm mt-1'>
              You save {currency}{productData.price - productData.discountedPrice}
            </p>
          )}

          <p className='mt-5 text-gray-600 leading-relaxed md:w-4/5 text-base'>{productData.description}</p>

          {/* Size Selector */}
          <div className='flex flex-col gap-4 my-8'>
            <p className='font-semibold text-gray-700'>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded-full transition-all font-medium text-sm ${item === size ? 'border-black bg-black text-white shadow-lg' : 'bg-gray-50 border-gray-100 hover:border-gray-400'} `}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} className='bg-black text-white px-12 py-4 text-sm font-bold active:bg-gray-700 transition-all uppercase tracking-widest rounded-xl shadow-lg active:scale-95'>
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-3'>
            <p className='flex items-center gap-2'>✨ 100% Original product.</p>
            <p className='flex items-center gap-2'>📦 Cash on delivery is available.</p>
            <p className='flex items-center gap-2'>🔄 Easy 7-day return policy.</p>
          </div>
        </div>
      </div>

      {/* --- Description & Reviews Tabs --- */}
      <div className='mt-20'>
        <div className='flex border-b'>
          <p className='border-x border-t px-8 py-4 text-sm font-bold cursor-pointer bg-white'>Description</p>
          <p className='px-8 py-4 text-sm text-gray-500 cursor-pointer hover:text-black transition'>Reviews ({reviewCount})</p>
        </div>
        <div className='border p-8 text-sm text-gray-600 leading-8 bg-gray-50/30'>
          <p>{productData.description}</p>
          <p className='mt-4 italic text-gray-400'>Each piece is crafted with high-quality materials to ensure durability and comfort for everyday wear.</p>
        </div>
      </div>

      {/* --- REVIEW SECTION --- */}
      <div className='mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12'>

        {/* Review Form */}
        <div className='lg:col-span-1'>
          <div className='sticky top-10'>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Share your thoughts</h2>
            <p className='text-gray-500 text-sm mb-6'>Let other shoppers know what you think about this product.</p>

            {token ? (
              <form onSubmit={submitReview} className='bg-white border p-6 rounded-xl shadow-sm'>
                <p className='font-bold mb-4 text-gray-700'>{isEditing ? "Update your experience" : "Rate the product"}</p>
                <div className='flex gap-2 mb-6'>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <img
                      key={num}
                      onClick={() => setRating(num)}
                      src={num <= rating ? assets.star_icon : assets.star_dull_icon}
                      className='w-7 cursor-pointer hover:scale-125 transition-transform'
                      alt="star"
                    />
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className='w-full border-2 border-gray-100 p-4 rounded-lg text-sm outline-none focus:border-black transition-colors bg-gray-50'
                  rows="4"
                  placeholder="What did you like or dislike?"
                  required
                ></textarea>
                <div className='flex flex-col gap-3 mt-4'>
                  <button type="submit" className='w-full bg-black text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-md'>
                    {isEditing ? "SAVE CHANGES" : "POST REVIEW"}
                  </button>
                  {isEditing && (
                    <button onClick={() => { setIsEditing(false); setComment(""); setRating(5); }} className='w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold uppercase'>
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className='p-6 bg-orange-50 border border-orange-100 rounded-xl text-center'>
                <p className='text-orange-800 text-sm mb-4 font-medium'>Sign in to review this product.</p>
                <Link to='/login' className='inline-block bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-orange-700 transition'>Login</Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className='lg:col-span-2'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-gray-800'>Verified Reviews</h2>
            <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full'>
              <img src={assets.star_icon} className='w-4' alt="" />
              <span className='font-bold text-base'>{averageRating.toFixed(1)}</span>
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            {productData.reviews && productData.reviews.length > 0 ? (
              <>
                {[...productData.reviews].reverse().slice(0, visibleReviews).map((rev, index) => (
                  <div key={index} className='bg-white border-b pb-8 group'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-full font-bold text-sm'>
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-bold text-gray-800'>{rev.userName}</p>
                            <div className='flex ml-2'>
                              {[1, 2, 3, 4, 5].map(n => (
                                <img key={n} src={n <= rev.rating ? assets.star_icon : assets.star_dull_icon} className='w-3' alt="" />
                              ))}
                            </div>
                          </div>
                          <p className='text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold'>
                            {new Date(rev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {token && rev.userId === userId && (
                        <div className='flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setComment(rev.comment);
                              setRating(rev.rating);
                              window.scrollTo({ top: 700, behavior: 'smooth' });
                            }}
                            className='text-gray-400 hover:text-black transition-colors'
                          >
                            <span className='text-[11px] font-bold uppercase border-b border-gray-300'>Edit</span>
                          </button>
                          <button onClick={deleteReview} className='text-red-300 hover:text-red-600 transition-colors'>
                            <span className='text-[11px] font-bold uppercase border-b border-red-100'>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <p className='text-gray-600 text-[15px] mt-4 leading-relaxed font-light italic'>"{rev.comment}"</p>
                  </div>
                ))}

                {productData.reviews.length > visibleReviews && (
                  <div className='text-center mt-6'>
                    <button
                      onClick={() => setVisibleReviews(prev => prev + 5)}
                      className='bg-white border-2 border-gray-200 px-10 py-3 rounded-full text-xs font-bold text-gray-800 hover:border-black transition-all active:scale-95'
                    >
                      LOAD MORE REVIEWS
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className='text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100'>
                <p className='text-gray-400 font-medium italic'>Be the first one to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0 h-screen'></div>
}

export default Product;