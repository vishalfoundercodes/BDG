import { ImCancelCircle } from "react-icons/im";
import win_bg from "../../assets/spintowheel/win_bg.png";
import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
export default function ResultModal({ onClose, announcementData, }) {
  const [winLoss, setWinLoss] = useState(1);
  useEffect(() => {
    if (announcementData?.data?.result === "lose") {
      setWinLoss(2); 
    }
    console.log("Announcement data:", announcementData);
  }, [announcementData]);

  if (!announcementData) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {winLoss === 1 ? (
        <div
          className="rounded-lg border-bg3 bg-[#0D1B2A] border-[1px] p-3 w-96 h-72 shadow-xl text-white font-serif"
        >
          <div className="flex items-center justify-between text-xsm w-full px-5">
            <h2 className="text-lg font-semibold mt-12 flex justify-center w-full">
              {announcementData?.data?.games_no}
            </h2>
            <ImCancelCircle
              onClick={onClose}
              className="hover:text-white cursor-pointer"
              size={25}
            />
          </div>
          <div className="relative flex items-center justify-between text-xsm w-full px-5">
            <p className="absolute top-5 -left-3 text-3xl font-semibold flex justify-center w-full">
             You  {announcementData?.data?.result} {announcementData?.data?.win}
            </p>
          </div>
          {/* <div className="relative flex items-center justify-between text-xsm w-full px-5">
            <p className="absolute top-24 text-3xl font-semibold flex justify-center w-full">
              {announcementData?.data?.number}
            </p>
          </div> */}
          <div className="relative flex items-center justify-between text-xsm w-full px-5">
            {/* <img className="absolute top-24 left-[42%] w-14 h-14" src={announcementData?.data?.number-1]} alt="sdf" /> */}
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg border-bg3 bg-[#0D1B2A] border-[1px] p-3 w-96 h-72 shadow-xl text-white font-serif"
        >
          <div className="flex items-center justify-between text-xsm w-full px-5">
            <h2 className="text-lg font-semibold mt-12 flex justify-center w-full">
              {announcementData?.data?.games_no}
            </h2>
            <ImCancelCircle
              onClick={onClose}
              className="hover:text-white cursor-pointer"
              size={25}
            />
          </div>
          <div className="relative flex items-center justify-between text-xsm w-full">
            <p className="absolute text-customred top-10 text-3xl font-semibold flex justify-center w-full">
              You Loose {announcementData?.data?.win}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
