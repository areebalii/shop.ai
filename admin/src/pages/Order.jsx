import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../components/exportVariables'

const ListOrders = ({ token, currency = 'Rs.' }) => {

  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentImg, setCurrentImg] = useState('')

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status Updated")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handlePaymentAction = async (orderId, isVerified) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status',
        { orderId, payment: isVerified },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
        isVerified ? toast.success("Payment Verified") : toast.warn("Payment Declined");
      }
    } catch (error) {
      toast.error("Action failed")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <h3 className='text-2xl font-black text-gray-800 tracking-tight'>Order Management</h3>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Total Orders: {orders.length}</p>
      </div>

      <div className='flex flex-col gap-6'>
        {orders.map((order, index) => (
          <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1.2fr] gap-6 items-center border border-gray-200 p-6 md:p-8 text-sm text-gray-700 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow'>

            <div className='bg-gray-100 p-4 rounded-xl w-fit'>
              <img className='w-10' src={assets.parcel_icon} alt="Parcel" />
            </div>

            <div>
              <div className='space-y-1'>
                {(Array.isArray(order.items[0]) ? order.items[0] : order.items).map((item, idx) => (
                  <p className='font-bold text-gray-800' key={idx}>
                    {item.name} <span className='text-blue-500 font-medium text-xs'>x{item.quantity}</span>
                    <span className='ml-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded uppercase'>{item.size}</span>
                  </p>
                ))}
              </div>
              <div className='mt-4'>
                <p className='font-black text-gray-900 text-base'>{order.address.firstName} {order.address.lastName}</p>
                <p className='text-gray-500 text-xs mt-1 leading-relaxed'>{order.address.street}, {order.address.city}, {order.address.state}</p>
                <p className='mt-2 font-bold text-blue-600 text-xs'>{order.address.phone}</p>
              </div>

              {order.paymentScreenshot && (
                <button
                  onClick={() => { setCurrentImg(order.paymentScreenshot); setShowModal(true); }}
                  className='mt-4 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all'
                >
                  <span className='text-sm'>👁</span> View Receipt
                </button>
              )}
            </div>

            <div className='space-y-3'>
              <div className='flex flex-col'>
                <span className='text-[10px] uppercase font-bold text-gray-400'>Payment Method</span>
                <span className='font-bold text-gray-800 uppercase tracking-tighter'>{order.paymentMethod}</span>
              </div>

              <div className='flex flex-col'>
                <span className='text-[10px] uppercase font-bold text-gray-400'>Verification</span>
                <div className='flex items-center gap-2 mt-1'>
                  <div className={`h-2 w-2 rounded-full ${order.payment ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={`font-black text-xs uppercase ${order.payment ? 'text-green-600' : 'text-red-500'}`}>
                    {order.payment ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* ACTION TOGGLE: Verify or Decline */}
              {!order.payment && order.paymentMethod !== 'cod' && (
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={() => handlePaymentAction(order._id, true)}
                    className='bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handlePaymentAction(order._id, false)}
                    className='bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-md text-[10px] font-black uppercase border border-red-100'
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>

            <div>
              <p className='text-xs text-gray-400 font-bold uppercase'>Amount Payable</p>
              <p className='text-xl font-black text-gray-900'>{currency}{order.amount}</p>
              <p className='text-[10px] text-gray-400 mt-4 font-medium'>{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>

            <div className='flex flex-col gap-2'>
              <span className='text-[10px] uppercase font-bold text-gray-400'>Shipping Status</span>
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                className='w-full p-3 font-bold text-xs border-2 border-gray-100 rounded-xl bg-gray-50 outline-none focus:border-blue-500 transition-colors cursor-pointer'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* --- SCREENSHOT LIGHTBOX MODAL --- */}
      {showModal && (
        <div className='fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4'>
          <div className='relative max-w-lg w-full'>
            <button
              onClick={() => setShowModal(false)}
              className='absolute -top-14 right-0 text-white/50 text-4xl hover:text-white transition-colors'
            >
              ×
            </button>
            <div className='bg-white p-2 rounded-2xl shadow-2xl overflow-hidden'>
              <img src={currentImg} className='max-h-[75vh] w-full object-contain rounded-xl' alt="Payment Proof" />
              <div className='p-4 flex justify-between items-center bg-gray-50'>
                <p className='text-[10px] font-bold text-gray-400 uppercase'>Payment Evidence Screenshot</p>
                <a href={currentImg} target="_blank" rel="noreferrer" className='text-blue-600 font-bold text-[10px] uppercase hover:underline'>Full Resolution</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListOrders