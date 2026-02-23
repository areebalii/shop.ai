import React from 'react';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const Hero = () => {

    const slides = [
        {
            subtitle: "OUR BESTSELLERS",
            title: "Latest Arrivals",
            img: assets.hero_img,
        },
        {
            subtitle: "SEASONAL SALE",
            title: "Up to 50% Off",
            img: assets.hero_img, 
        },
        {
            subtitle: "NEW COLLECTION",
            title: "Summer Essentials",
            img: assets.hero_img,
        }
    ];

    return (
        <div className='border border-gray-400 relative group'>
            <Swiper
                // Pagination dots
                pagination={{ clickable: true }}
                // Navigation arrows
                navigation={true}
                // Autoplay settings
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                // This makes it go 1-2-3-1-2-3. 
                // Note: Swiper doesn't natively support "yoyo" (1-2-3-2-1) autoplay, 
                // so infinite loop is the best standard for UX.
                loop={true} 
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className='flex flex-col sm:flex-row'>
                            {/* Hero left side */}
                            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 bg-white'>
                                <div className='text-[#414141]'>
                                    <div className='flex items-center gap-2'>
                                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                                        <p className='font-medium text-sm md:text-base'>{slide.subtitle}</p>
                                    </div>
                                    <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
                                        {slide.title}
                                    </h1>
                                    <div className='flex items-center gap-2 cursor-pointer hover:text-black transition-all'>
                                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                                        <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                                    </div>
                                </div>
                            </div>
                            {/* Hero Right Side */}
                            <img className='w-full sm:w-1/2 object-cover' src={slide.img} alt={slide.title} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom CSS to style the arrows (Add this to your CSS file or a style tag) */}
            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-button-next, .swiper-button-prev {
                    color: #414141 !important;
                    transform: scale(0.6);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                .group:hover .swiper-button-next, 
                .group:hover .swiper-button-prev {
                    opacity: 1;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 40px !important;
                    font-weight: bold;
                }
                .swiper-pagination-bullet-active {
                    background: #414141 !important;
                }
            `}} />
        </div>
    );
};

export default Hero;