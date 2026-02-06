import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Play, X, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import ReactGA from 'react-ga4';

// Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Susan Jacob",
        title: "Artist & Business Owner",
        url: "https://res.cloudinary.com/dkajyjvlm/video/upload/v1770369047/SUSAN_JACOB_Artist_Business_Owner_qjek1z.mp4"
    },
    {
        id: 2,
        name: "Akhil Tony",
        title: "Verified Buyer",
        url: "https://res.cloudinary.com/dkajyjvlm/video/upload/v1770369046/AkhilTony_verified_buyer_1_zaouko.mp4"
    },
    {
        id: 3,
        name: "Jo Mohan",
        title: "Musician & Sound Engineer",
        url: "https://res.cloudinary.com/dkajyjvlm/video/upload/v1770369045/JO_MOHAN_Musician_Sound_Engineer_kkcu09.mp4"
    },
    {
        id: 4,
        name: "Alan Sebastian",
        title: "Electric Engineer",
        url: "https://res.cloudinary.com/dkajyjvlm/video/upload/v1770369035/ALAN_SEBASTIAN_Electric_Engineer_Music_Composer_sjb9yh.mp4"
    }
];

import ReactDOM from 'react-dom';

// ... (imports remain same)

const VideoTestimonials = () => {
    // Index of the video currently open in fullscreen (null if closed)
    const [fullscreenIndex, setFullscreenIndex] = useState(null);
    const fullscreenSwiperRef = useRef(null);

    const openFullscreen = (index) => {
        setFullscreenIndex(index);
        ReactGA.event({
            category: 'video_testimonial',
            action: 'open_fullscreen',
            label: TESTIMONIALS[index].name
        });
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeFullscreen = () => {
        setFullscreenIndex(null);
        document.body.style.overflow = ''; // Unlock background scroll
    };

    const handleNext = () => {
        if (fullscreenSwiperRef.current && fullscreenSwiperRef.current.swiper) {
            fullscreenSwiperRef.current.swiper.slideNext();
        }
    };

    const handlePrev = () => {
        if (fullscreenSwiperRef.current && fullscreenSwiperRef.current.swiper) {
            fullscreenSwiperRef.current.swiper.slidePrev();
        }
    };

    return (
        <>
            {/* 1. The Thumbnail Marquee (Trigger) */}
            <div className="vt-marquee-container" style={{ marginBottom: '3rem' }}>
                <Swiper
                    modules={[Autoplay, FreeMode]}
                    spaceBetween={16}
                    slidesPerView={2.5} // Larger cards as requested
                    centeredSlides={true} // Keep centered for look
                    loop={true} // Infinite Loop
                    speed={6000} // Speed for linear scroll
                    autoplay={{
                        delay: 1, // continuous
                        disableOnInteraction: false, // Continue after interaction
                        pauseOnMouseEnter: true
                    }}
                    freeMode={true}
                    breakpoints={{
                        640: { slidesPerView: 3.5, spaceBetween: 20 },
                        1024: { slidesPerView: 4.5, spaceBetween: 24 }
                    }}
                    className="video-testimonial-swiper"
                >
                    {/* Map twice to ensure enough slides for smooth loop if count is low */}
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((video, idx) => {
                        const originalIdx = idx % TESTIMONIALS.length; // Map back to original data
                        return (
                            <SwiperSlide key={`${video.id}-${idx}`} onClick={() => openFullscreen(originalIdx)}>
                                <div className="vt-card-thumb" style={{
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    aspectRatio: '9/16',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transform: 'scale(0.95)',
                                    transition: 'transform 0.3s'
                                }}>
                                    <img
                                        src={video.url.replace('.mp4', '.jpg')}
                                        alt={video.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                    />
                                    {/* Play Icon Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0,0,0,0.4)',
                                        borderRadius: '50%',
                                        padding: '12px',
                                        backdropFilter: 'blur(2px)'
                                    }}>
                                        <Play size={20} fill="white" color="white" />
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '10px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                    }}>
                                        <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{video.name}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {/* 2. Fullscreen Modal (Portalled to Body) */}
            {fullscreenIndex !== null && ReactDOM.createPortal(
                <div className="vt-fullscreen-modal" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 2147483647, // Max Z-Index
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Close Button */}
                    <button onClick={closeFullscreen} style={{
                        position: 'absolute',
                        top: '20px', right: '20px',
                        zIndex: 10002, // Higher than nav/modal content
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        padding: '12px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <X size={24} color="white" />
                    </button>

                    {/* Previous Button (Left) */}
                    <button onClick={handlePrev} style={{
                        position: 'absolute',
                        top: '50%', left: '20px',
                        transform: 'translateY(-50%)',
                        zIndex: 10002,
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '12px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <ChevronRight size={32} color="white" style={{ transform: 'rotate(180deg)' }} />
                    </button>

                    {/* Next Button (Right) - Also inside Swiper slide but can be global too */}
                    <button onClick={handleNext} style={{
                        position: 'absolute',
                        top: '50%', right: '20px',
                        transform: 'translateY(-50%)',
                        zIndex: 10002,
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '12px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <ChevronRight size={32} color="white" />
                    </button>

                    {/* Fullscreen Swiper */}
                    <Swiper
                        ref={fullscreenSwiperRef}
                        initialSlide={fullscreenIndex}
                        direction="horizontal"
                        loop={true} // Enable Infinite Loop
                        modules={[FreeMode]}
                        className="vt-fullscreen-swiper"
                        spaceBetween={0}
                        slidesPerView={1}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {TESTIMONIALS.map((video) => (
                            <SwiperSlide key={video.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                background: '#000'
                            }}>
                                {/* Pass isActive prop to control playback */}
                                {({ isActive }) => (
                                    <FullscreenVideoCard
                                        video={video}
                                        isActive={isActive}
                                        onNext={handleNext}
                                    />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>,
                document.body // PORTAL TARGET
            )}
            {/* Custom CSS overrides for continuous linear scroll */}
            <style>{`
                .video-testimonial-swiper .swiper-wrapper {
                    transition-timing-function: linear;
                }
            `}</style>
        </>
    );
};

// Sub-component for the Fullscreen Player
const FullscreenVideoCard = ({ video, isActive, onNext }) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false); // Default Sound ON as requested

    useEffect(() => {
        if (isActive) {
            videoRef.current?.play().catch(e => console.log("Autoplay blocked", e));
        } else {
            videoRef.current?.pause();
            videoRef.current.currentTime = 0; // Reset
        }
    }, [isActive]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
                ref={videoRef}
                src={video.url}
                className="vt-fs-video"
                playsInline
                loop
                muted={isMuted}
                onClick={(e) => {
                    // Tap to pause/play? Or tap to mute?
                    // Let's do tap to toggle play for UX
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // IMMERSIVE: Fills screen, no black bars
                    background: '#000'
                }}
            />

            {/* Info Overlay Removed as per user request (video has text) */}


            {/* Mute Toggle */}
            <button onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
            }} style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer'
            }}>
                {isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
            </button>
        </div>
    );
};

export default VideoTestimonials;
