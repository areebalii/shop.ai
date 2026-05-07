import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [method, setMethod] = useState('cod');
  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '',
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Primary function to handle the API call
  const initateOrder = async (currentImage = image) => {
    try {
      const orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = new FormData();
      orderData.append('address', JSON.stringify(formData));
      orderData.append('items', JSON.stringify(orderItems));
      orderData.append('amount', getCartAmount() + delivery_fee);
      orderData.append('paymentMethod', method);

      // Explicitly append the image if it exists
      if (currentImage) {
        orderData.append('paymentScreenshot', currentImage);
      }

      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } })

      if (response.data.success) {
        setCartItems({});
        toast.success("Order Placed Successfully!");
        navigate('/orders')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // 1. If COD, just place order
    if (method === 'cod') {
      await initateOrder();
    }
    // 2. If Digital but no image, show popup
    else if (!image) {
      setShowPopup(true);
    }
    // 3. If Digital and image already exists, place order
    else {
      await initateOrder();
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t' >

      {/* Left Side: Delivery Info */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='First name' name='firstName' value={formData.firstName} onChange={onChangeHandler} required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='Last name' name='lastName' value={formData.lastName} onChange={onChangeHandler} required />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="email" placeholder='Email address' name='email' value={formData.email} onChange={onChangeHandler} required />
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='Street' name='street' value={formData.street} onChange={onChangeHandler} required />
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='City' name='city' value={formData.city} onChange={onChangeHandler} required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='State' name='state' value={formData.state} onChange={onChangeHandler} required />
        </div>
        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="number" placeholder='Zipcode' name='zipcode' value={formData.zipcode} onChange={onChangeHandler} required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="text" placeholder='Country' name='country' value={formData.country} onChange={onChangeHandler} required />
        </div>
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-black' type="number" placeholder='Phone' name='phone' value={formData.phone} onChange={onChangeHandler} required />
      </div>

      {/* Right Side: Payment */}
      <div className='mt-8 w-full sm:max-w-[500px]'>
        <div className='min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>

            {/* EasyPaisa Selector */}
            <div onClick={() => setMethod('easypaisa')} className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg transition-all ${method === 'easypaisa' ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'easypaisa' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></p>
              {assets.easypaisa_logo && <img className='h-5 mx-2' src={assets.easypaisa_logo} alt="EasyPaisa" />}
              <p className='text-gray-600 text-xs font-semibold uppercase'>EasyPaisa</p>
            </div>

            {/* JazzCash Selector */}
            <div onClick={() => setMethod('jazzcash')} className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg transition-all ${method === 'jazzcash' ? 'border-amber-500 bg-amber-50' : 'hover:bg-gray-50'}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'jazzcash' ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}></p>
              {assets.jazzcash_logo && <img className='h-5 mx-2' src={assets.jazzcash_logo} alt="JazzCash" />}
              <p className='text-gray-600 text-xs font-semibold uppercase'>JazzCash</p>
            </div>

            {/* COD Selector */}
            <div onClick={() => { setMethod('cod'); setImage(false) }} className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg transition-all ${method === 'cod' ? 'border-gray-800 bg-gray-50' : 'border-gray-300 hover:bg-gray-50'}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}></p>
              <p className='text-gray-500 text-xs font-semibold mx-2 uppercase'>Cash on Delivery</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm font-medium rounded-sm active:bg-gray-700 transition-all uppercase tracking-widest'>
              {method !== 'cod' && !image ? "Proceed to Pay" : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* --- PAYMENT POPUP MODAL --- */}
      {showPopup && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4'>
          <div className='bg-white w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300'>

            {/* Modal Header */}
            <div className={`p-6 text-white flex justify-between items-center ${method === 'easypaisa' ? 'bg-green-600' : 'bg-amber-500'}`}>
              <div className='flex items-center gap-3'>
                <h2 className='text-lg font-bold uppercase tracking-tighter'>Manual Payment</h2>
              </div>
              <button onClick={() => setShowPopup(false)} className='text-white/80 hover:text-white text-xl'>✕</button>
            </div>

            <div className='p-8'>
              <div className='space-y-4 bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100'>
                <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
                  <div>
                    <p className='text-[10px] text-gray-400 font-bold uppercase'>Account Number</p>
                    <p className='text-lg font-mono font-bold text-gray-800 tracking-wider'>03XX-XXXXXXX</p>
                  </div>
                  <button type='button' onClick={() => { navigator.clipboard.writeText("03XXXXXXXXX"); toast.info("Number Copied") }} className='text-blue-600 text-xs font-bold'>COPY</button>
                </div>
                <div>
                  <p className='text-[10px] text-gray-400 font-bold uppercase'>Account Title</p>
                  <p className='text-md font-bold text-gray-800'>AREEB ALI</p>
                </div>
              </div>

              <div className='text-center mb-6'>
                <p className='text-xs text-gray-500 uppercase font-bold mb-1'>Total Payable</p>
                <p className='text-3xl font-black text-gray-900'>Rs. {getCartAmount() + delivery_fee}</p>
              </div>

              <label className='flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group'>
                {image ? (
                  <div className='text-center'>
                    <p className='text-green-600 font-bold text-sm'>✓ Receipt Selected</p>
                    <p className='text-[10px] text-gray-400 mt-1 italic'>{image.name}</p>
                  </div>
                ) : (
                  <>
                    <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform'>
                      <img src={assets.upload_area} className='w-6 opacity-40' alt="Upload Area" />
                    </div>
                    <p className='text-xs font-bold text-gray-500 uppercase'>Upload Receipt Screenshot</p>
                    <p className='text-[10px] text-gray-400 mt-1'>JPG, PNG or PDF supported</p>
                  </>
                )}
                <input onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*" hidden />
              </label>

              <div className='flex gap-3 mt-8'>
                <button type='button' onClick={() => setShowPopup(false)} className='flex-1 py-4 text-xs font-black uppercase text-gray-400 hover:text-gray-600 transition-colors'>Cancel</button>
                <button
                  type='button'
                  onClick={() => {
                    if (image) {
                      setShowPopup(false);
                      initateOrder(image);
                    } else {
                      toast.error("Please upload screenshot first")
                    }
                  }}
                  className={`flex-[2] py-4 text-xs font-black uppercase text-white rounded-xl shadow-lg transition-all active:scale-95 ${method === 'easypaisa' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  Confirm & Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default PlaceOrder