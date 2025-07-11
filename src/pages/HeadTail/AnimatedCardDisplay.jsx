/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { assets } from './assets';

function AnimatedCardDisplay({ betResultDataAnnouncement }) {
    const [andarCards, setAndarCards] = useState([]);
    const [baharCards, setBaharCards] = useState([]);
    const [animatedIndex, setAnimatedIndex] = useState(null);

    useEffect(() => {
        if (betResultDataAnnouncement?.json?.length > 0) {
            const cards = JSON.parse(betResultDataAnnouncement.json);
            const mainCards = cards.slice(0, -1); // all except the last card
            const lastCard = cards[cards.length - 1];

            // Reset states when betResultDataAnnouncement changes
            setAndarCards([]);
            setBaharCards([]);
            setAnimatedIndex(null);

            let localIndex = 0;

            const interval = setInterval(() => {
                if (localIndex < mainCards.length) {
                    setAnimatedIndex(localIndex);

                    const card = mainCards[localIndex];
                    if (localIndex % 2 === 0) {
                        setAndarCards((prev) => [...prev, card]);
                    } else {
                        setBaharCards((prev) => [...prev, card]);
                    }

                    localIndex += 1;
                } else {
                    clearInterval(interval);
                    setAnimatedIndex(null);

                    // Push the last card based on `number`
                    if (betResultDataAnnouncement?.number === 1) {
                        setAndarCards((prev) => [...prev, lastCard]);
                    } else {
                        setBaharCards((prev) => [...prev, lastCard]);
                    }
                }
            }, 200);

            return () => clearInterval(interval);
        }
    }, [betResultDataAnnouncement?.json]);

    if (!betResultDataAnnouncement?.json) return null;

    const cards = JSON.parse(betResultDataAnnouncement.json);
    const lastCard = cards[cards.length - 1];

    return (
        <div className="w-full flex flex-col absolute top-[10vh] px-2">
            {/* Andar Section */}
            <div className="w-full flex items-center gap-2">
                <img className="w-20 h-8" src={assets?.andar} alt="andar" />
                {andarCards.map((item, index) => (
                    <img
                        key={index}
                        className={`w-6.5 h-8 ${index !== 0 ? "-ml-3" : ""} ${
                            item === lastCard ? "border-2 border-gold w-7 h-9" : "w-6.5 h-8"
                        } ${animatedIndex === index ? "animate-slide-in" : ""}`}
                        src={assets.cards[item - 1]}
                        alt=""
                    />
                ))}
            </div>

            {/* Bahar Section */}
            <div className="w-full flex items-center gap-2 mt-5">
                <img className="w-20 h-8" src={assets?.bahar} alt="bahar" />
                {baharCards.map((item, index) => (
                    <img
                        key={index}
                        className={` ${index !== 0 ? "-ml-3" : ""} ${
                            item === lastCard ? "border-2 border-gold w-7 h-9" : "w-6.5 h-8"
                        } ${animatedIndex === index ? "animate-slide-in" : ""}`}
                        src={assets.cards[item - 1]}
                        alt=""
                    />
                ))}
            </div>
        </div>
    );
}

export default AnimatedCardDisplay;
