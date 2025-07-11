import { ImCancelCircle } from "react-icons/im";
import win_bg from "../../assets/spintowheel/win_bg.png";
import { useState, useEffect } from "react";

/* eslint-disable react/prop-types */
export default function ResultModal({ onClose, announcementData }) {
    const [winLoss, setWinLoss] = useState(1); // 1 = win by default
    // const [userResult, setUserResult] = useState(null); // 1 = win by default

    useEffect(() => {
        // const userResult = localStorage.getItem("spin_user_r");
        // setUserResult(userResult)
        if (announcementData?.win_amount === 0) {
            // console.log("ebnterededd")
            setWinLoss(2); // loss
        }
        // console.log("Announcement data:", announcementData);
    }, [announcementData]);

    if (!announcementData) return null;
    // console.log("winLoss", winLoss)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {winLoss === 1 ? (
                <div
                    style={{
                        backgroundImage: `url(${win_bg})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="rounded-lg p-3 w-96 h-96 shadow-xl text-white font-serif"
                >
                    <div className="flex items-center justify-between text-xsm w-full px-5">
                        <h2 className="text-lg font-semibold mt-12 flex justify-center w-full">
                            {announcementData?.data[0]?.period_no}
                        </h2>
                        <ImCancelCircle onClick={onClose} className="hover:text-white cursor-pointer" size={25} />
                    </div>
                    <div className="relative flex items-center justify-between text-xsm w-full px-5">
                        <p className="absolute top-24 text-3xl font-semibold flex justify-center w-full">
                            {announcementData?.data[0]?.win_number}
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        background: "linear-gradient(to bottom, #8B8000, #B8860B, #DAA520, #DAA520, #DAA520, #B8860B, #8B8000)",
                    }}
                    className="rounded-lg p-3 w-72 h-72 shadow-xl text-white font-serif"
                >
                    <div className="flex items-center justify-between text-xsm w-full px-5">
                        <h2 className="text-lg font-semibold mt-12 flex justify-center w-full">
                            {announcementData?.data[0]?.period_no}
                        </h2>
                        <ImCancelCircle onClick={onClose} className="hover:text-white -mt-10 -mr-5 cursor-pointer" size={25} />
                    </div>
                    <div className="relative flex items-center justify-between text-xsm w-full">
                        <p className="absolute text-customred top-10 text-3xl font-semibold flex justify-center w-full">
                            You Loose {announcementData?.win_amount}
                        </p>
                        <p className="absolute top-24 text-3xl font-semibold flex justify-center w-full">
                            Result : {announcementData?.data[0]?.win_number}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
