/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import SpinSocket from "./SpinSocket";
import useProfile from "../../reusable_component/gameApi";


function SpinToWheelFooter({ betAmount, setBetAmount, onPlaceBet }) {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const userId = localStorage.getItem("userId");
  const { myDetails } = useProfile(userId);
  
  const decreaseBet = () => setBetAmount((prev) => {
    const value = Number(prev) || 0; 
    return Math.max(0, value - 1);
  });
  const increaseBet = () => setBetAmount((prev) => {
    const value = Number(prev) || 0; 
    return Math.max(0, value + 1);
  })
  const togglePopup = () => setShowPopup((prev) => !prev);
  const selectBetAmount = (amount) => {
    setBetAmount(amount);
    setShowPopup(false);
  };

  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      // console.log("qqqqqqqqqqqq",q)
      setTimeLeft(q?.timerBetTime);
    };
    SpinSocket.on("gameon_spin", handleSocket);
    return () => SpinSocket.off("gameon_spin", handleSocket);
  }, []);


  // myDetails?.data?.wallet;
  return (
    <div className="relative -mt-2 xs1:mt-0">
      <div className="flex items-center justify-center p-2 mt-0 xsm:mt-2">
        <div className="sm:h-36 w-full rounded-lg bg-yellow px-4 pt-1 xs1:py-2 xsm:p-4">
          <div className="h-12 xs1:h-14 w-full rounded-3xl bg-[#569123] border-[0.5px] border-black">
            <div className="flex justify-between items-center">
              <div className="pl-4">
                <div className="text-white pl-12 font-serif text-[12px]">
                  BET
                </div>
                {/* <input
                inputMode="decimal"
                placeholder="Enter amount"
                type="number"
                value={betAmount}
                onChange={(e) => {
                  const val = e.target.value;

                  if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
                    setBetAmount(val);
                  }
                }}
                onBlur={() => {
                  if (betAmount !== "") {
                    const num = Number(betAmount);
                    if (!isNaN(num)) {
                      setBetAmount(
                        num % 1 === 0 ? num.toString() : num.toFixed(2)
                      );
                    }
                  }
                }}
                className="h-6 w-32 bg-[#08565A] no-spinner placeholder:text-[10px] border-black border-[0.5px] text-center rounded-3xl text-white outline-none px-2"
              /> */}
           
                <div className="relative flex items-center h-6 w-32 bg-[#08565A] rounded-3xl border-black border-[0.5px]">
                  <span className="text-white text-xs pl-10 pr-1">₹</span>{" "}
                  {/* Adjusted gap here */}
                  <input
                    inputMode="numeric"
                    placeholder="Enter amount"
                    type="text"
                    value={betAmount}
                    onChange={(e) => {
                      const val = e.target.value;

                      if (/^\d*$/.test(val)) {
                        const num = Number(val);
                        const wallet = Number(myDetails?.data?.wallet || 0);
                        if (val === "" || num <= wallet) {
                          setBetAmount(val);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (betAmount !== "") {
                        const num = parseInt(betAmount, 10);
                        setBetAmount(isNaN(num) ? "" : num.toString());
                      }
                    }}
                    className="pl-0 pr-2 bg-transparent flex-1 text-white text-xs text-left outline-none placeholder:text-[10px] no-spinner"
                  />
                </div>
              </div>
              <div className="flex pr-6 space-x-3">
                <div className="h-7 w-7 bg-[#8B8000] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={decreaseBet}>
                    <TiMinus className="text-[24px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-[#8B8000] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={togglePopup}>
                    <BsDatabase className="text-[20px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-[#8B8000] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={increaseBet}>
                    <IoMdAdd className="text-[24px] text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={timeLeft > 0 && timeLeft < 13}
              onClick={onPlaceBet}
              className={`relative ${
                timeLeft > 0 && timeLeft < 13
                  ? "bg-gray"
                  : "bg-gradient-to-tr from-[#448B02] to-[#5FAF09]"
              } text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 xs1:h-12 w-full font-serif font-bold text-[14px] m-1 xs1:m-3 rounded-2xl flex items-center justify-center`}
            >
              BET
            </button>
          </div>

          {/* ✅ Popup is INSIDE return */}
          {showPopup && (
            <div className="absolute -top-32 right-12 bg-[#569123] z-50 shadow-lg rounded-lg p-2 w-72 grid grid-cols-3 gap-2 border-black border-[0.5px]">
              {[10, 20, 50, 100, 200, 500].map((amount) => (
                <div
                  key={amount}
                  onClick={() => selectBetAmount(amount)}
                  className="p-2 text-center bg-[#2b7009] border-black border-[0.5px] text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                  {amount}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpinToWheelFooter;
