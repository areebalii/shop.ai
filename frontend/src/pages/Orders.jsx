import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.map((order) => {
          const itemsToMap = Array.isArray(order.items[0]) ? order.items[0] : order.items;

          itemsToMap.map((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod,
              payment: order.payment, // This is the boolean from your database
              date: order.date
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token])

  return (
    <div className='border-t pt-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='mt-8'>
        {
          orderData.length > 0 ? (
            orderData.map((item, index) => (
              <div key={index} className='py-6 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                {/* --- Left Section: Image and Product Details --- */}
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20 rounded shadow-sm object-cover' src={item.image?.[0]} alt={item.name} />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p className='font-bold'>{currency}{item.price}</p>
                      <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                      <p className='px-2 text-xs border bg-slate-50 rounded'>Size: {item.size}</p>
                    </div>
                    <p className='mt-2 text-xs text-gray-500'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>

                    {/* PAYMENT STATUS LOGIC */}
                    <div className='flex items-center gap-2 mt-2'>
                      <p className='text-xs text-gray-500'>Payment:</p>
                      <span className='font-bold uppercase text-[10px] tracking-wider'>{item.paymentMethod}</span>

                      {item.paymentMethod !== 'COD' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.payment ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                          {item.payment ? '✓ Verified' : '⚠ Pending / Declined'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- Right Section: Status and Action --- */}
                <div className='md:w-1/2 flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></p>
                    <p className='text-sm md:text-base font-semibold capitalize'>{item.status}</p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className='border border-gray-300 px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-all duration-300 active:scale-95'
                  >
                    Track Order
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className='text-center py-20 text-gray-400'>
              <p className='text-lg'>You haven't placed any orders yet.</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Orders;