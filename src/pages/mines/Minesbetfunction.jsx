/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import apis from "../../utils/apis";
import { toast } from "react-toastify";
import useProfile from "../../reusable_component/gameApi";


function Minesbetfunction({
  setProfileRefresher,
  multi,
  minesMultiplier,
  MultiplierIndex,
  isRevealStarted,
  setIsRevealStarted,
  onBetPlaced,
  gameStarted,
  minesmultiplyer,
  setRestartGame,
  handleGameReset,
}) {
  const [betAmount, setBetAmount] = useState(1); // Default bet amount
  const [bettime, setBettime] = useState(false); // Default bet time
  const [showPopup, setShowPopup] = useState(false); // State to toggle popup
  const [finalCashOut, setFinalCashOut] = useState(null); // Stores final cashout value when MultiplierIndex is empty
  const userId = localStorage.getItem("userId");

  const { myDetails } = useProfile(userId);
  // Decrease bet amount (minimum 1)
  const decreaseBet = () =>
    setBetAmount((prevAmount) => Math.max(1, prevAmount - 1));

  // Increase bet amount
  const increaseBet = () => setBetAmount((prevAmount) => prevAmount + 1);

  // Toggle popup visibility
  const togglePopup = () => setShowPopup(!showPopup);

  // Set bet amount from popup selection
  const selectBetAmount = (amount) => {
    setBetAmount(amount);
    setShowPopup(false);
  };

  // Calculate current cashout value
  const currentCashOut = Number(
    betAmount + MultiplierIndex.size * multi
  ).toFixed(2);

  // Handle localStorage logic
  useEffect(() => {
    if (MultiplierIndex.size > 0) {
      const value = betAmount + MultiplierIndex.size * multi;
      localStorage.setItem("finalCashOut", value);
      setFinalCashOut(value);
    } else {
      const stored = localStorage.getItem("finalCashOut");
      if (stored) {
        setFinalCashOut(Number(stored));
      }
    }
  }, [MultiplierIndex.size, betAmount, multi]);

  ///
  const betHandler = async () => {
      if (betAmount > myDetails?.data?.wallet) {
        toast.error("Insufficient balance");
      }
      console.log("bet amoumnt on mines",betAmount)
      if (betAmount ==0) {
        toast.error("Enter a valid bet");
      }

    // const payload={
    //     userid: userId,
    //     win_amount: MultiplierIndex.size > 0 ? currentCashOut : Number(finalCashOut).toFixed(2),
    //     multipler: multi,
    //     status: 1
    // }
    const payload = {
      userid: userId,
      game_id: 12,
      amount: betAmount,
    };
    // console.log("payload",payload)
    try {
      const res = await axios.post(`${apis?.mines_bet}`, payload);
      console.log("hey", res);
      if (res?.data?.status === 200 || res?.data?.status === "200") {

        setBettime(true);

        setProfileRefresher({ first: true, second: false });
        onBetPlaced();
      }
    } catch (err) {
      // console.log("erere",err)
      if (err?.response?.data?.status === 500) {
        console.log("er", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const handleCashoutClick = () => {
    if (MultiplierIndex.size > 0) {
      cashoutHandler();
    } else {
      handleGameReset();
    }
  };

  const cashoutHandler = async () => {
    const payload = {
      userid: userId,
      win_amount:
        MultiplierIndex.size > 0
          ? currentCashOut
          : Number(finalCashOut).toFixed(2),
      multipler: multi,
      status: 1,
    };
    // console.log("payload",payload)
    try {
      const res = await axios.post(`${apis?.mines_cashout}`, payload);
      // console.log("mines_cashout res", res)
      if (res?.data?.status === 200 || res?.data?.status === "200") {
        setBettime(false);
        setProfileRefresher({ first: true, second: false });
        toast.success(res?.data?.message);
        await handleGameReset();
      }
    } catch (err) {
      // console.log("erere",err)
      if (err?.response?.data?.status === 500) {
        console.log("er", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  return (
    <div className="flex items-center justify-center p-2 mt-8">
      <div className="h-40 w-full rounded-lg bg-[#0D5574] p-4 relative">
        <div className="h-14 w-full rounded-3xl bg-[#007C80] border-[0.5px] border-black pt-2">
          <div className="flex justify-between items-center ">
            <div className="pl-4">
              <div className="text-white pl-12 font-serif text-[12px]">
                BET{" "}
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xs">
                  ₹
                </span>
                <input
                  inputMode="numeric"
                  placeholder="Enter amount"
                  type="text"
                  value={betAmount}
                  disabled={bettime}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // remove non-digits
                    const num = Number(val);
                    const wallet = Number(myDetails?.data?.wallet || 0);

                    if (val === "" || num <= wallet) {
                      setBetAmount(val);
                    }
                  }}
                  onBlur={() => {
                    if (betAmount !== "") {
                      const num = Number(betAmount);
                      if (!isNaN(num)) {
                        setBetAmount(num.toString()); // ensure it's a valid whole number
                      }
                    }
                  }}
                  className="h-6 w-32 pl-6 bg-[#08565A] no-spinner placeholder:text-[10px] border-black border-[0.5px] text-center rounded-3xl text-white outline-none"
                />
              </div>
            </div>
            <div className="flex pr-6">
              <button
                disabled={gameStarted}
                onClick={decreaseBet}
                className="h-7 w-7 bg-[#007C80] rounded-full flex items-center justify-center border-black border-[0.5px] ml-3 cursor-pointer"
              >
                <TiMinus className="text-[24px] text-white" />
              </button>
              <button
                disabled={gameStarted}
                onClick={togglePopup}
                className="h-7 w-7 bg-[#007C80] rounded-full flex items-center justify-center border-black border-[0.5px] ml-3 cursor-pointer"
              >
                <BsDatabase className="text-[24px] text-white" />
              </button>
              <button
                disabled={gameStarted}
                onClick={increaseBet}
                className="h-7 w-7 bg-[#007C80] rounded-full flex items-center justify-center border-black border-[0.5px] ml-3 cursor-pointer"
              >
                <IoMdAdd className="text-[24px] text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {!gameStarted && !isRevealStarted ? (
            <div
              onClick={betHandler}
              className="bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[18px] shadow-lg h-12 w-full m-2 rounded-2xl flex items-center justify-center cursor-pointer"
            >
              Bet
            </div>
          ) : gameStarted && !isRevealStarted ? (
            <div className="bg-orange-500 text-white text-[18px] shadow-lg h-12 w-full m-2 rounded-2xl flex items-center justify-center">
              Bet Placed
            </div>
          ) : (
            <button
              onClick={handleCashoutClick}
              className="bg-yellow text-white text-[18px] shadow-lg h-12 w-full m-2 rounded-2xl flex items-center justify-center"
            >
              {MultiplierIndex.size > 0 ? currentCashOut : 0}x cash out
            </button>
          )}
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="absolute -top-28 right-10 bg-[#007C80] shadow-lg rounded-lg p-2 w-72 grid grid-cols-3 gap-2">
            {[10, 20, 50, 100, 200, 500].map((amount) => (
              <div
                key={amount}
                onClick={() => selectBetAmount(amount)}
                className="p-2 text-center bg-[#08565A] border-black border-[0.5px] text-white rounded-lg hover:bg-gray-600 cursor-pointer"
              >
                {amount}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Minesbetfunction;
