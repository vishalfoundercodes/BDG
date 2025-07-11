/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { assets } from './assets';

function AnimatedCardDisplay({ betResultDataAnnouncement }) {
    const [andarCards, setAndarCards] = useState([]);
    const [baharCards, setBaharCards] = useState([]);
    const [cards, setCards] = useState([]);

    const [animatedIndex, setAnimatedIndex] = useState(null);
    // let cards
    // if (betResultDataAnnouncement) {
    //     cards = JSON.parse(betResultDataAnnouncement?.json);
    // }
    useEffect(() => {
        if (betResultDataAnnouncement?.json?.length > 0) {
            const parsedCards = Array.isArray(betResultDataAnnouncement?.json)
                ? betResultDataAnnouncement.json
                : JSON.parse(betResultDataAnnouncement?.json || '[]');

            setCards(parsedCards); // Cache cards in state

            // console.log("betResultDataAnnouncement", parsedCards);
            setAndarCards([]);
            setBaharCards([]);
            setAnimatedIndex(null);

            let localIndex = 0;
            const interval = setInterval(() => {
                if (localIndex < parsedCards.length - 1) {
                    const card = parsedCards[localIndex];
                    setAnimatedIndex(localIndex);
                    if (localIndex % 2 === 0) {
                        setAndarCards(prev => [...prev, card]);
                    } else {
                        setBaharCards(prev => [...prev, card]);
                    }
                    localIndex++;
                } else if (localIndex === parsedCards.length - 1) {
                    const lastCard = parsedCards[localIndex];
                    setAnimatedIndex(localIndex);
                    if (betResultDataAnnouncement?.number === 1) {
                        setAndarCards(prev => [...prev, lastCard]);
                    } else {
                        setBaharCards(prev => [...prev, lastCard]);
                    }
                    localIndex++;
                } else {
                    clearInterval(interval);
                    setAnimatedIndex(null);
                }
            }, 200);

            return () => clearInterval(interval);
        }
    }, [betResultDataAnnouncement?.json, betResultDataAnnouncement?.number]);


    if (!betResultDataAnnouncement?.json) {
        return null; // Render nothing if JSON data is not available
    }

    const lastCard = cards[cards?.length - 1];

    // console.log("betResultDataAnnouncement", betResultDataAnnouncement);
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", andarCards);
    // console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb", baharCards);
    // console.log("lastCardlastCardlastCard", lastCard);

    return (
        <div className="w-full flex flex-col absolute top-[10vh] px-2">
            <div className="w-full flex items-center gap-2">
                <img className="w-20 h-8" src={assets?.andar} alt="andar" />
                {andarCards.map((item, index) => (
                    <img
                        key={index}
                        className={`w-6.5 h-8 ${index !== 0 ? "-ml-3" : ""} ${item == lastCard ? "border-2 border-gold w-7 h-9" : "w-6.5 h-8"
                            } ${animatedIndex == index + (betResultDataAnnouncement?.number === 1 ? 0 : 1) ? "animate-slide-in" : ""}`}
                        src={assets.cards[Number(item) - 1]}
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
                        className={` ${index !== 0 ? "-ml-3" : ""} ${item == lastCard ? "border-2 border-gold w-7 h-9" : "w-6.5 h-8"
                            } ${animatedIndex == index + (betResultDataAnnouncement?.number === 2 ? 0 : 1) ? "animate-slide-in" : ""}`}
                        src={assets.cards[Number(item) - 1]}
                        alt=""
                    />
                ))}
            </div>
        </div>
    );
}

export default AnimatedCardDisplay;
