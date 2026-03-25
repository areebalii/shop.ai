import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, token, backendUrl, userId } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

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
          fetchProductData();
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
        toast.success(response.data.message);
        setComment("");
        setRating(5);
        setIsEditing(false);
        fetchProductData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const averageRating = productData.averageRating || 0;
  const reviewCount = productData.reviews ? productData.reviews.length : 0;

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      <div className='flex gap-12 flex-col sm:flex-row'>
        {/*--- Product Images ---*/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/*--- Product Info ---*/}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[1, 2, 3, 4, 5].map((num) => (
              <img key={num} src={num <= averageRating ? assets.star_icon : assets.star_dull_icon} alt="" className='w-3.5' />
            ))}
            <p className='pl-2 text-gray-500'>({reviewCount})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} `} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/*--- Description & Review Toggle Section ---*/}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <b className='border px-5 py-3 text-sm'>Reviews ({reviewCount})</b>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
          <p>High quality material and premium finish.</p>
        </div>
      </div>

      {/*--- Review Section ---*/}
      <div className='mt-20'>
        <h2 className='text-xl font-bold mb-6'>Customer Reviews</h2>

        {/* Review Form */}
        {token ? (
          <form onSubmit={submitReview} className='bg-gray-50 p-6 rounded-lg mb-10'>
            <p className='font-medium mb-2'>{isEditing ? "Edit your Review" : "Leave a Review"}</p>
            <div className='flex gap-1 mb-4'>
              {[1, 2, 3, 4, 5].map((num) => (
                <img
                  key={num}
                  onClick={() => setRating(num)}
                  src={num <= rating ? assets.star_icon : assets.star_dull_icon}
                  className='w-5 cursor-pointer'
                  alt="star"
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='w-full border p-3 rounded text-sm outline-none focus:border-black'
              rows="3"
              placeholder="Share your thoughts..."
              required
            ></textarea>
            <div className='flex gap-2'>
              <button type="submit" className='bg-black text-white px-6 py-2 mt-3 text-xs uppercase tracking-widest'>
                {isEditing ? "Update Review" : "Submit Review"}
              </button>
              {isEditing && (
                <button onClick={() => { setIsEditing(false); setComment(""); setRating(5); }} className='bg-gray-300 text-black px-6 py-2 mt-3 text-xs uppercase tracking-widest'>
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className='p-4 bg-orange-50 text-orange-700 text-sm rounded mb-8'>
            Please <Link to='/login' className='underline font-bold'>Login</Link> to write a review.
          </div>
        )}

        {/* List of Reviews */}
        <div className='flex flex-col gap-6'>
          {productData.reviews && productData.reviews.length > 0 ? (
            [...productData.reviews].reverse().map((rev, index) => (
              <div key={index} className='border-b pb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='font-bold text-sm'>{rev.userName}</p>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map(n => (
                        <img key={n} src={n <= rev.rating ? assets.star_icon : assets.star_dull_icon} className='w-3' alt="" />
                      ))}
                    </div>
                    <p className='text-xs text-gray-400'>{new Date(rev.date).toLocaleDateString()}</p>
                  </div>

                  {/* FIXED: Check using userId from Context */}
                  {token && rev.userId === userId && (
                    <div className='flex gap-3 text-xs'>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setComment(rev.comment);
                          setRating(rev.rating);
                          window.scrollTo({ top: 700, behavior: 'smooth' });
                        }}
                        className='text-blue-500 hover:underline'
                      >
                        Edit
                      </button>
                      <button onClick={deleteReview} className='text-red-500 hover:underline'>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className='text-gray-600 text-sm mt-2 italic'>"{rev.comment}"</p>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-sm italic'>No reviews yet.</p>
          )}
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product;