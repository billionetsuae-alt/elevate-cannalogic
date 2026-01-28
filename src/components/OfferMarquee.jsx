import React from 'react';
import './OfferMarquee.css';

const OfferMarquee = () => {
    const offerText = "🔥 FLASH SALE • 1 Pack: Save ₹1,000 • 2 Packs: Save ₹2,750 • 3 Packs: Save ₹5,250 • ⏰ Limited Time Only • 🚚 FREE Delivery • ✅ 100% Legal & Ayurvedic • ";

    return (
        <div className="offer-marquee-container">
            <div className="offer-marquee-track">
                <span className="offer-marquee-text">{offerText}</span>
                <span className="offer-marquee-text">{offerText}</span>
                <span className="offer-marquee-text">{offerText}</span>
            </div>
        </div>
    );
};

export default OfferMarquee;
