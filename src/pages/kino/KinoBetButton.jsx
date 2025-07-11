/* eslint-disable react/prop-types */
import { useState } from "react";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useProfile from "../../reusable_component/gameApi";

function KinoBetButton({
  handleClear,
  timeLeft,
  selectedRisk,
  selectedNumbers,
  setProfileRefresher,
}) {
  const [betAmount, setBetAmount] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const userId = localStorage.getItem("userId");
  const { myDetails } = useProfile(userId);
  const navigate = useNavigate();

  const decreaseBet = () => setBetAmount((prev) => Math.max(1, prev - 1));
  const increaseBet = () => setBetAmount((prev) => prev + 1);
  const togglePopup = () => setShowPopup((prev) => !prev);
  const selectBetAmount = (amount) => {
    setBetAmount(amount);
    setShowPopup(false);
  };

  const gameBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      userid: userId,
      game_id: 17,
      risk_level:
        selectedRisk === "low"
          ? 1
          : selectedRisk === "medium"
          ? 2
          : selectedRisk === "medium"
          ? 3
          : null,
      selected_numbers: selectedNumbers,
      bet_amount: betAmount,
    };
    // console.log("payload", payload)
    try {
      
      const response = await axios.post(`${apis?.keno_bet}`, payload);
      // console.log("keno game betbet", response)
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        localStorage.setItem("keno_bet", "true");
        setProfileRefresher(true);
        // handleClear();
        // ❗ Delay clearing after 8 sec
        // setTimeout(() => {
        //   // setResultChecked(false); // ❌ hide result coloring
        //   handleClear(); // ✅ now clear selected numbers
        // }, 32000);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
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
                  <span className="text-white text-xs pl-2 pr-1">₹</span>
                  <input
                    inputMode="numeric"
                    placeholder="Enter amount"
                    type="text"
                    value={betAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const wallet = Number(myDetails?.data?.wallet || 0);

                      if (/^\d*$/.test(val)) {
                        const num = Number(val);
                        if (val === "" || num <= wallet) {
                          setBetAmount(val);
                        }
                      }
                    }}
                    onBlur={() => {
                      const wallet = Number(myDetails?.data?.wallet || 0);
                      if (betAmount !== "") {
                        const num = parseInt(betAmount, 10);
                        const clamped = isNaN(num)
                          ? ""
                          : Math.min(num, wallet).toString();
                        setBetAmount(clamped);
                      }
                    }}
                    className="pl-0 pr-2 bg-transparent flex-1 text-white text-xs text-left outline-none placeholder:text-[10px] no-spinner"
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
              disabled={timeLeft > 0 && timeLeft < 11}
              onClick={() => gameBetHandler()}
              className={`relative ${
                timeLeft > 0 && timeLeft < 11
                  ? "bg-gray"
                  : "bg-gradient-to-tr from-[#448B02] to-[#5FAF09]"
              }  text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-11 w-full font-serif font-bold text-[14px] m-2 rounded-2xl flex items-center justify-center`}
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
                  className="p-2 text-center bg-[#2b7009] border-black border-[0.5px] text-white rounded-lg hover:bg-gray cursor-pointer"
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

export default KinoBetButton;
