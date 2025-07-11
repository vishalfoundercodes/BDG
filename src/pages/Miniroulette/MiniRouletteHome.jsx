import React, { useEffect, useState } from "react";
import MiniRouletteHeader from "./MiniRouletteHeader";
import MiniRouletteFutter from "./MiniRouletteFutter";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import volleyball from "../../assets/Roullet/volleyball.png";
import ten from "../../assets/Roullet/ten.png";
import twenty from "../../assets/Roullet/twenty.png";
import fifty from "../../assets/Roullet/fifty.png";
import hundred from "../../assets/Roullet/hundred.png";
import twohundred from "../../assets/Roullet/twohundred.png";
import fivehunderd from "../../assets/Roullet/fivehunderd.png";
import thousand from "../../assets/Roullet/thousand.png";
import roullet from "../../assets/Roullet/roullet.png";
import MiniRouletteSocket from "./MiniRouletteSocket";
import ResultModal from "./ResultModal";
import axios from "axios";
import apis from "../../utils/apis";
import { toast } from "react-toastify";

const numbers = [
  { id: 2, value: "2", color: "black" },
  { id: 4, value: "4", color: "black" },
  { id: 6, value: "6", color: "black" },
  { id: 8, value: "8", color: "red" },
  { id: 10, value: "10", color: "red" },
  { id: 12, value: "12", color: "red" },
  { id: 1, value: "1", color: "red" },
  { id: 3, value: "3", color: "red" },
  { id: 5, value: "5", color: "red" },
  { id: 7, value: "7", color: "black" },
  { id: 9, value: "9", color: "black" },
  { id: 11, value: "11", color: "black" },
  { id: 13, value: "1 - 6", color: "kk" },
  { id: 14, value: "Even", color: "kk" },
  { id: 15, value: "", color: "black" },
  { id: 16, value: "", color: "red" },
  { id: 17, value: "odd", color: "kk" },
  { id: 18, value: "7 - 12", color: "kk" },
];

// const numbersWheel = [
//   { id: 1, value: "1", color: "red" },
//   { id: 9, value: "9", color: "black" },
//   { id: 5, value: "5", color: "black" },
//   { id: 4, value: "4", color: "red" },
//   { id: 10, value: "10", color: "red" },
//   { id: 6, value: "6", color: "red" },
//   { id: 12, value: "12", color: "red" },
//   { id: 2, value: "2", color: "red" },
//   { id: 8, value: "8", color: "red" },
//   { id: 7, value: "7", color: "black" },
//   { id: 3, value: "3", color: "red" },
//   { id: 11, value: "11", color: "black" },
// ];

// 1
function MiniRouletteHome() {
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [ballRotation, setBallRotation] = useState(0);
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(19).fill(0));
  const [betHistoryState, setBetHistoryState] = useState([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastBet, setLastBet] = useState(Array(19).fill(0));
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] =
    useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    MiniRouletteSocket.on("demo_miniroulete", handleSocket);
    return () => MiniRouletteSocket.off("demo_miniroulete", handleSocket);
  }, []);
  const spinWheel = (number) => {
    if (isSpinning) return;
    const randomIndex = number;
    let aa;
    if (randomIndex === 1) {
      aa = 3;
    } else if (randomIndex === 2) {
      aa = 8;
    } else if (randomIndex === 3) {
      aa = 5;
    } else if (randomIndex === 4) {
      aa = 0;
    } else if (randomIndex === 5) {
      aa = 1;
    } else if (randomIndex === 6) {
      aa = 10;
    } else if (randomIndex === 7) {
      aa = 6;
    } else if (randomIndex === 8) {
      aa = 7;
    } else if (randomIndex === 9) {
      aa = 2;
    } else if (randomIndex === 10) {
      aa = 11;
    } else if (randomIndex === 11) {
      aa = 4;
    } else if (randomIndex === 12) {
      aa = 9;
    }
    const targetAngle = 15 * aa;
    const extraSpins = 5;
    const finalRotation = extraSpins * 360 + (targetAngle - 2);
    setIsSpinning(true);
    setWheelRotation((prev) => prev + finalRotation);
    const finalBallRotation = -finalRotation;
    setBallRotation(finalBallRotation-720);
    setTimeout(() => {
      setIsSpinning(false);
    }, 6000);
  };

  const handleNumberClick = (id) => {
    setNumberAmounts((prev) => {
      const newBets = [...prev];
      newBets[id] += betAmount;
      setBetHistoryState((prevHistory) => [
        ...prevHistory,
        { id, amount: betAmount },
      ]);
      return newBets;
    });
  };

  useEffect(() => {
    gameResult();
    gameBetHistory();
    
  }, []);
  useEffect(() => {
    const betStatus = localStorage.getItem("miniroullete_bet");
    if (timeLeft === 10) {
      gameResultForSpinner();
    }
    if (timeLeft === 5) {
      gameResult();
    }
    if (timeLeft === 4) {
      if (betStatus === "true") {
        const sr = Number(gameResultData[0]?.games_no);
        gameResultAnnouncement(sr);
        localStorage.setItem("miniroullete_bet", "false");
      }
      gameBetHistory();
    }

    if (timeLeft === 1) {
      resetWheel();
    }
  }, [timeLeft]);

  const resetWheel = () => {
    setWheelRotation(0);
    setBallRotation(0);
    setIsSpinning(false);
    // setNumberAmounts(Array(19).fill(0));
    // setBetHistoryState([]);
  };

  // apiss
  const placeBetHandler = async () => {
    const bets = [];
    numberAmounts.forEach((amount, index) => {
      if (amount > 0) bets.push({ number: index, amount });
    });
    const payload = {
      userid: userId,
      game_id: "26",
      bet: bets,
    };
    try {
      const response = await axios.post(`${apis?.miniroullete_bet}`, payload);
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        localStorage.setItem("miniroullete_bet", "true");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Bet placement error!");
    }
  };

  // game result api
  const gameResultForSpinner = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      game_id: "26",
      limit: "1",
    };
    try {
      const response = await axios.post(
        `${apis?.miniroullete_results}`,
        payload
      );
      // console.log("gameresult gameResult", response);
      if (response?.data?.status === 200) {
        const aa = response?.data?.data;
        const raw = aa[0]?.result_number;
        const parsed = raw.match(/\d+/g);
        const resultNo = parsed;
        const parsedResultNo = resultNo?.length > 0 && resultNo[0];
        spinWheel(Number(parsedResultNo));
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server error", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameResult = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      game_id: "26",
      limit: "30",
    };
    try {
      const response = await axios.post(
        `${apis?.miniroullete_results}`,
        payload
      );
      // console.log("gameresult gameResult", response);
      if (response?.data?.status === 200) {
        setGameResultData(response?.data?.data);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server error", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameResultAnnouncement = async (sr) => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      userid: userId,
      game_id: "26",
      games_no: sr,
    };

    try {
      const response = await axios.post(
        `${apis?.miniroulletewin_amount}`,
        payload
      );
      // console.log("gameResultAnnouncement gameResultAnnouncement", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response?.data);
        setIsResultModal(true);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameBetHistory = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      userid: userId,
      game_id: "26",
    };

    try {
      const response = await axios.post(
        `${apis?.miniroulletebet_history}`,
        payload
      );
      // console.log("respbne history", response);
      if (response?.data?.status === 200) {
        setGameResultHistory(response?.data?.data);
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
    <div
      className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
      style={{
        background:
          "linear-gradient(to bottom, #006400, #006400, #006400, #006400)",
      }}
    >
      <div className="w-full">
        <MiniRouletteHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />

        {/* Serial + Timer */}
        <div className="flex justify-between m-4 ">
          <div
            className="h-11 w-28 bg-lime-700 bg-opacity-90 rounded-lg text-center text-[12px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:-{" "}
            <p className="font-bold">
              {gameResultData?.length > 0 &&
                Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-lime-700 opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6 relative">
          <div className="h-60 w-24 bg-lime-700 rounded-md overflow-hidden overflow-y-scroll hide-scrollbar">
            <div className="grid grid-cols-1 h-full">
              {gameResultData?.map((num, i) => {
                const raw = num?.result_number;
                const parsed = raw.match(/\d+/g);
                const resultNo = parsed;
                const parsedResultNo = resultNo?.length > 0 && resultNo[0];
                const isRed = [1, 3, 5, 8, 10, 12].includes(
                  Number(parsedResultNo)
                );
                return (
                  <div
                    key={i}
                    className={`flex h-10 font-bold px-2 items-center ${
                      isRed
                        ? "justify-start text-[#FF0000]"
                        : "justify-end text-black"
                    }`}
                  >
                    {parsedResultNo}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="relative h-60 w-60 rounded-full overflow-hidden bg-lime-700">
              {/* Rotating wheel */}
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? "transform 6s ease-in-out" : "none",
                }}
              >
                <img
                  src={roullet}
                  alt="wheel"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "48%",
                  transform: `rotate(${ballRotation}deg) translateX(55px) translateY(-120%)`,
                  transition: isSpinning ? "transform 6s ease" : "none",
                }}
              >
                <img
                  src={volleyball}
                  alt="ball"
                  className="h-3 w-3 -mt-3 rounded-full"
                />
              </div>
            </div>
            {/* Result
            {winningIndex !== null && !isSpinning && (
              <div className="mt-4 text-white text-xl font-bold">
                Result: {winningIndex}
              </div>
            )} */}
          </div>
        </div>
        {/* Number Grid */}
        <div className="m-4">
          <div className="grid grid-cols-6 border border-white rounded-lg overflow-hidden">
            {numbers.map((num, idx) => {
              const isLabel = ["1 - 6", "7 - 12", "even", "odd"].includes(
                num.value.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  onClick={() => handleNumberClick(num.id)}
                  className="relative h-12 col-span-1 flex items-center justify-center font-bold text-white text-sm border border-white cursor-pointer"
                >
                  <div
                    className={`flex items-center justify-center z-10 ${
                      !isLabel ? "rounded-full h-8 w-8" : ""
                    } ${
                      num.color === "kk"
                        ? "bg-transparent"
                        : num.color === "red"
                        ? "bg-[#FF0000]"
                        : "bg-black"
                    }`}
                  >
                    {num.value}
                  </div>
                  {numberAmounts[num.id] > 0 && (
                    <div className="absolute top-2 right-4 font-mono font-bold text-white text-[10px]  h-8 w-8 rounded-full z-20 shadow-md">
                      <div className="z-30 ">
                        <img
                          src={
                            numberAmounts[num.id] <= 10
                              ? ten
                              : numberAmounts[num.id] <= 20
                              ? twenty
                              : numberAmounts[num.id] <= 50
                              ? fifty
                              : numberAmounts[num.id] <= 100
                              ? hundred
                              : numberAmounts[num.id] <= 200
                              ? twohundred
                              : numberAmounts[num.id] <= 500
                              ? fivehunderd
                              : thousand
                          }
                          alt=""
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                          {numberAmounts[num.id]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-around mx-4 ">
          <button
            onClick={() => {
              if (betHistoryState.length > 0) {
                const newBets = [...numberAmounts];
                const last = betHistoryState[betHistoryState.length - 1];
                newBets[last.id] = Math.max(0, newBets[last.id] - last.amount);
                setNumberAmounts(newBets);
                setBetHistoryState(betHistoryState.slice(0, -1));
              }
            }}
            className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 p-3 font-serif font-bold text-[10px] m-2 rounded-xl flex items-center justify-center"
          >
            <div className="text-[20px]">
              <IoChevronBackOutline />
            </div>{" "}
            Back
          </button>

          <button
            onClick={() => {
              setLastBet(Array(19).fill(0));
              setNumberAmounts(Array(19).fill(0));
              setBetHistoryState([]);
            }}
            className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 p-3 font-serif font-bold text-[10px] m-2 rounded-xl flex items-center justify-center"
          >
            <div className="text-[20px]">
              <MdClear />
            </div>{" "}
            Clear
          </button>
          <div className="w-28"></div>
          <button
            onClick={() => {
              if (lastBet.length > 0) {
                setNumberAmounts([...lastBet]);
              }
            }}
            className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-8 p-3 font-serif font-bold text-[10px] m-2 rounded-xl flex items-center justify-center"
          >
            <div className="text-[20px]">
              <IoMdRefresh />
            </div>{" "}
            Rebet
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full mt-3 xs1:mt-0">
        <MiniRouletteFutter
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={placeBetHandler}
          timeLeft={timeLeft}
        />
      </div>
      {isResultModal && (
        <ResultModal
          onClose={() => setIsResultModal(false)}
          announcementData={gameResultDataAnnouncemnt}
        />
      )}
    </div>
  );
}
export default MiniRouletteHome;