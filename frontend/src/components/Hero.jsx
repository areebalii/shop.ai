import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { assets } from "../assets/assets";
import "./Hero.css";

const Hero = () => {
    return (
        /* Ensure the outer container is truly screen-width and has no padding */
        <div className="w-full relative overflow-hidden">
            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                // Removed constraints, set to full screen width
                className="hero-swiper h-[60vh] md:h-[90vh] w-full"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <div
                        /* REMOVED px-10 md:px-24 to eliminate horizontal gaps */
                        className="hero-slide w-full h-full flex items-center justify-start"
                        style={{
                            backgroundImage: `url(${assets.slider})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        {/* Text Container: Add padding back HERE instead of the slide div */}
                        <div className="max-w-xl space-y-5 pl-[6vw] md:pl-[10vw]">
                            <h1 className="text-red-500 text-5xl md:text-7xl font-bold font-serif leading-tight">
                                Sale 20% Off
                            </h1>
                            <h2 className="text-[#0f2d35] text-5xl md:text-6xl font-bold font-serif">
                                On Everything
                            </h2>
                            <p className="text-gray-600 text-lg max-w-md">
                                Discover the latest fashion trends and enjoy amazing discounts.
                            </p>
                            <button className="bg-red-500 text-white px-10 py-4 border border-red-500 rounded hover:bg-white hover:text-red-500 transition-all duration-300 font-bold uppercase tracking-wider">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 (Same logic as Slide 1) */}
                <SwiperSlide>
                    <div
                        className="hero-slide w-full h-full flex items-center justify-start"
                        style={{
                            backgroundImage: `url(${assets.slider})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="max-w-xl space-y-5 pl-[6vw] md:pl-[10vw]">
                            <h1 className="text-red-500 text-5xl md:text-7xl font-bold font-serif leading-tight">
                                New Season
                            </h1>
                            <h2 className="text-[#0f2d35] text-5xl md:text-6xl font-bold font-serif">
                                Arrivals
                            </h2>
                            <p className="text-gray-600 text-lg max-w-md">
                                Upgrade your wardrobe with trending styles and fresh looks.
                            </p>
                            <button className="bg-red-500 text-white px-10 py-4 border border-red-500 rounded hover:bg-white hover:text-red-500 transition-all duration-300 font-bold uppercase tracking-wider">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <style dangerouslySetInnerHTML={{
                __html: `
                .swiper-button-next, .swiper-button-prev {
                    color: #ef4444 !important;
                    transform: scale(0.6);
                }
                .swiper-pagination-bullet-active {
                    background: #ef4444 !important;
                }
            `}} />
        </div>
    );
};

export default Hero;