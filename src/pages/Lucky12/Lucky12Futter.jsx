import React, { useState } from "react";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import useProfile from "../../reusable_component/gameApi";
function Lucky12Futter({
  betAmount,
  setBetAmount,
  onPlaceBet,
  timeLeft,
  onDouble,
  onRebet,
  onClear,
}) {
  const [showPopup, setShowPopup] = useState(false);

    const userId = localStorage.getItem("userId");
  
  const { myDetails } = useProfile(userId);

  const decreaseBet = () =>
    setBetAmount((prev) => {
      const value = Number(prev) || 0;
      return Math.max(0, value - 1);
    });
  const increaseBet = () =>
    setBetAmount((prev) => {
      const value = Number(prev) || 0;
      return Math.max(0, value + 1);
    });
  const togglePopup = () => setShowPopup((prev) => !prev);
  const selectBetAmount = (amount) => {
    setBetAmount(amount);
    setShowPopup(false);
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-center p-2 mt-0 xsm:mt-2">
        <div className="sm:h-32 w-full rounded-2xl bg-[#411A5C] px-4 py-1 xsm:p-4 border border-[#c6a120]">
          <div className="h-14 w-full rounded-3xl bg-[#0E2F6A] border border-[#c6a120] pt-2">
            <div className="flex justify-between items-center">
              <div className="pl-4">
                <div className="text-white pl-12 font-serif text-[12px]">
                  BET
                </div>
                <input
                  inputMode="decimal"
                  placeholder="Enter amount"
                  type="text"
                  value={betAmount}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
                      const num = Number(val);
                        const wallet = Number(myDetails?.data?.wallet || 0);
                        if (val === "" || num <= wallet) {
                          setBetAmount(val);
                        }
                    }
                  }}
                  // onChange={(e) => {
                  //   const val = e.target.value;

                  //   if (/^\d*\.?\d{0,2}$/.test(val) ) {
                  //     const num = Number(val);
                  //       const wallet = Number(myDetails?.data?.wallet || 0);
                  //       if (val === "" || num <= wallet) {
                  //         setBetAmount(val);
                  //       }
                  //   }
                  // }}
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
                  className="h-6 w-32 bg-black border-[#c6a120] border-[1.2px] text-center rounded-3xl text-white outline-none px-2"
                />
              </div>
              <div className="flex pr-6 space-x-3">
                <div className="h-7 w-7 bg-black rounded-full flex items-center justify-center border-[#c6a120] border-[1px]">
                  <button onClick={decreaseBet}>
                    <TiMinus className="text-[24px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-black rounded-full flex items-center justify-center border-[#c6a120] border-[1px]">
                  <button onClick={togglePopup}>
                    <BsDatabase className="text-[20px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-black rounded-full flex items-center justify-center border-[#c6a120] border-[1px]">
                  <button onClick={increaseBet}>
                    <IoMdAdd className="text-[24px] text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
             <button
              disabled={timeLeft?.timerBetTime < 11 &&timeLeft?.timerStatus===2 }
              onClick={onPlaceBet}
              className={`relative ${
               timeLeft?.timerBetTime < 11 &&timeLeft?.timerStatus===2 
                  ? "bg-gray"
                  : "bg-gradient-to-tr from-[#448B02] to-[#5FAF09]"
              } text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 xs1:h-10 w-full font-serif font-bold text-[14px] m-1 xs1:m-3 rounded-2xl flex items-center justify-center`}
            >
              BET
            </button>
            <button
              onClick={onDouble}
              className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] border-[#c6a120] border-[1px] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9  font-serif font-bold text-[10px] m-1  p-2 rounded-2xl flex items-center justify-center"
            >
              DOUBLE
            </button>
            <button
              onClick={onRebet}
              className="relative text-nowrap bg-gradient-to-tr from-[#448B02] to-[#5FAF09] border-[#c6a120] border-[1px] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9  font-serif font-bold text-[10px] m-1 p-2 rounded-2xl flex items-center justify-center"
            >
              RE BET
            </button>
            <button
              onClick={onClear}
              className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] border-[#c6a120] border-[1px] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9  font-serif font-bold text-[10px] m-1 p-2 rounded-2xl flex items-center justify-center"
            >
              CLEAR
            </button>
          </div>

          {showPopup && (
            <div className="absolute -top-32 right-12 bg-black z-50 shadow-lg rounded-lg p-2 w-72 grid grid-cols-3 gap-2 border-black border-[0.5px]">
              {[10, 20, 50, 100, 200, 500].map((amount) => (
                <div
                  key={amount}
                  onClick={() => selectBetAmount(amount)}
                  className="p-2 text-center bg-[#444444] border-black border-[0.5px] text-white rounded-lg hover:bg-gray-600 cursor-pointer"
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

export default Lucky12Futter;
