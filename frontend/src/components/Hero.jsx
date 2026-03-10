import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { assets } from "../assets/assets";
import "./Hero.css";


const Hero = () => {
    return (
        <div className="w-full">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop
                className="h-[90vh] hero-swiper"
            >
                {/* Slide 1 */}
                <SwiperSlide>
                    <div
                        className="hero-slide"
                        style={{
                            backgroundImage: `url(${assets.slider})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        {/* LEFT CONTENT */}
                        <div className="max-w-xl space-y-5">
                            <h1 className="text-red-500 text-5xl md:text-6xl font-bold font-serif">
                                Sale 20% Off
                            </h1>

                            <h2 className="text-[#0f2d35] text-6xl font-bold font-serif">
                                On Everything
                            </h2>

                            <p className="text-gray-600 max-w-md">
                                Discover the latest fashion trends and enjoy amazing discounts.
                            </p>

                            <button className="bg-red-500 text-white px-8 py-3 border border-red-500 rounded hover:bg-white hover:text-red-500 transition">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <div
                        className="hero-slide"
                        style={{
                            backgroundImage: `url(${assets.slider})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="max-w-xl space-y-5">
                            <h1 className="text-red-500 text-5xl md:text-6xl font-bold font-serif">
                                Sale 20% Off
                            </h1>

                            <h2 className="text-[#0f2d35] text-6xl font-bold font-serif">
                                On Everything
                            </h2>

                            <p className="text-gray-600 max-w-md">
                                Upgrade your wardrobe with trending styles.
                            </p>

                            <button className="bg-red-500 text-white px-8 py-3 border border-red-500 rounded hover:bg-white hover:text-red-500 transition">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Hero;
