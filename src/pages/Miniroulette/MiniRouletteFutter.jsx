import { useState } from "react";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import useProfile from '../../reusable_component/gameApi';

function MiniRouletteFutter({ betAmount, setBetAmount, onPlaceBet, timeLeft }) {
  const [showPopup, setShowPopup] = useState(false);
      const userId = localStorage.getItem("userId")
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
        <div className="sm:h-36 w-full rounded-lg bg-[#005500] px-4 py-1 xsm:p-4">
          <div className="h-14 w-full rounded-3xl bg-[#569123] border-[0.5px] border-black pt-2">
            <div className="flex justify-between items-center">
              <div className="pl-4">
                <div className="text-white pl-12 font-serif text-[12px]">
                  BET
                </div>
                <div className="flex items-center h-6 w-32 bg-[#2b7009] rounded-3xl border-black border-[0.5px] px-2">
                  <span className="text-white text-xs pl-8 pr-1">₹</span>
                  <input
                    inputMode="numeric"
                    placeholder="Enter amount"
                    type="text"
                    value={betAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ""); // only digits
                      const wallet = Number(myDetails?.data?.wallet || 0);
                      const num = Number(val);

                      if (val === "" || num <= wallet) {
                        setBetAmount(val);
                      }
                    }}
                    onBlur={() => {
                      const wallet = Number(myDetails?.data?.wallet || 0);
                      if (betAmount !== "") {
                        const num = parseInt(betAmount, 10);
                        if (!isNaN(num)) {
                          const clamped = Math.min(num, wallet);
                          setBetAmount(clamped.toString());
                        }
                      }
                    }}
                    className="flex-1 bg-transparent no-spinner placeholder:text-[10px] text-white text-xs text-left outline-none"
                  />
                </div>
              </div>
              <div className="flex pr-6 space-x-3">
                <div className="h-7 w-7 bg-[#2b7009] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={decreaseBet}>
                    <TiMinus className="text-[24px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-[#2b7009] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={togglePopup}>
                    <BsDatabase className="text-[20px] text-white" />
                  </button>
                </div>
                <div className="h-7 w-7 bg-[#2b7009] rounded-full flex items-center justify-center border-black border-[0.5px]">
                  <button onClick={increaseBet}>
                    <IoMdAdd className="text-[24px] text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={timeLeft > 0 && timeLeft < 12}
              onClick={onPlaceBet}
              className={`relative ${
                timeLeft > 0 && timeLeft < 12
                  ? "bg-gray"
                  : "bg-gradient-to-tr from-[#448B02] to-[#5FAF09]"
              } text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 xs1:h-10 w-full font-serif font-bold text-[14px] m-1 xs1:m-3 rounded-2xl flex items-center justify-center`}
            >
              BET
            </button>
          </div>

          {showPopup && (
            <div className="absolute -top-24 right-12 bg-[#569123] z-50 shadow-lg rounded-lg p-2 w-72 grid grid-cols-3 gap-2 border-black border-[0.5px]">
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

export default MiniRouletteFutter;
