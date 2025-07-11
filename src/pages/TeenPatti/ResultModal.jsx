import { ImCancelCircle } from "react-icons/im";
import win_bg from "../../assets/spintowheel/win_bg.png";
import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
export default function ResultModal({ onClose, announcementData,cardImages }) {
  const [winLoss, setWinLoss] = useState(1);
  useEffect(() => {
    if (announcementData?.data?.win === 0) {
      setWinLoss(2); // loss
    }
    // console.log("Announcement data:", announcementData);
  }, [announcementData]);
  const parsedCards = JSON.parse(announcementData?.winner_cards);
  if (!announcementData) return null;
  return (
    <div className="fixed inset-0 w-full flex items-center justify-center z-50 pt-20">
        <div className=" w-[310px] gap-5 py-5 rounded-lg bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center">
          <div className="flex space-x-2">
            {parsedCards.map((card, index) => (
              <img
                key={index}
                className="w-16 h-26"
                src={cardImages[parseInt(card)]}
                alt={`Card ${card}`}
              />
            ))}
          </div>
          <p className="text-2xl font-extrabold text-gold">
            <span className="capitalize "> {announcementData?.winner}</span> Win
          </p>
          <p className="text-2xl font-extrabold text-gold">
            <span className="capitalize ">Win : {announcementData?.win}</span> 
          </p>
        </div>
    </div>
  );
}
