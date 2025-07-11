import { useEffect, useState } from "react";
import lucky_bg from "../../assets/Lucky12Assets/lucky_bg.png";
import h_bg from "../../assets/Lucky12Assets/h_bg.png";
import chidi_j from "../../assets/Lucky12Assets/chidi_j.png";
import chidi_k from "../../assets/Lucky12Assets/chidi_k.png";
import chidi_q from "../../assets/Lucky12Assets/chidi_q.png";
import l_club from "../../assets/Lucky12Assets/l_club.png";
import l_heart from "../../assets/Lucky12Assets/l_heart.png";
import l_shep from "../../assets/Lucky12Assets/l_shep.png";
import l_diamond from "../../assets/Lucky12Assets/l_diamond.png";
import green_q from "../../assets/Lucky12Assets/green_q.png";
import green_k from "../../assets/Lucky12Assets/green_k.png";
import green_j from "../../assets/Lucky12Assets/green_j.png";
import heart_k from "../../assets/Lucky12Assets/heart_k.png";
import heart_q from "../../assets/Lucky12Assets/heart_q.png";
import heart_j from "../../assets/Lucky12Assets/heart_j.png";
import hukum_j from "../../assets/Lucky12Assets/hukum_j.png";
import hukum_k from "../../assets/Lucky12Assets/hukum_k.png";
import hukum_q from "../../assets/Lucky12Assets/hukum_q.png";
import eta_j from "../../assets/Lucky12Assets/eta_j.png";
import eta_k from "../../assets/Lucky12Assets/eta_k.png";
import eta_q from "../../assets/Lucky12Assets/eta_q.png";
import c from "../../assets/Lucky12Assets/c.png";
import d from "../../assets/Lucky12Assets/d.png";
import h from "../../assets/Lucky12Assets/h.png";
import j from "../../assets/Lucky12Assets/j.png";
import k from "../../assets/Lucky12Assets/k.png";
import q from "../../assets/Lucky12Assets/q.png";
import s from "../../assets/Lucky12Assets/s.png";
import ee from "../../assets/Lucky12Assets/ee.png";
import twox from "../../assets/jackpot/2x.png";
import threex from "../../assets/jackpot/3x.png";
import fourx from "../../assets/jackpot/4x.png";
import fivex from "../../assets/jackpot/5x.png";
import sixx from "../../assets/jackpot/6x.png";
import sevenx from "../../assets/jackpot/7x.png";
import eigthx from "../../assets/jackpot/8x.png";
import ninex from "../../assets/jackpot/9x.png";
import tenx from "../../assets/jackpot/10x.png";
import elevenx from "../../assets/jackpot/11x.png";
import twelvex from "../../assets/jackpot/12x.png";
import l_12_first_wheel from "../../assets/Lucky12Assets/l_12_first_wheel.png";
import l_12_second_wheel from "../../assets/Lucky12Assets/l_12_second_wheel.png";
import l_16_third_wheel from "../../assets/Lucky12Assets/l_16_third_wheel.png";
import Lucky12Header from "./Lucky12Header";
import Lucky12Futter from "./Lucky12Futter";
import { motion } from "framer-motion";
import Lucky12Socket from "./Lucky12Socket";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import axios from "axios";
import JokerModal from "./JokerModal";
import useProfile from "../../reusable_component/gameApi";
// import ResultModal from "./ResultModal";
const jackpotImages = [
  twox,
  threex,
  fourx,
  fivex,
  sixx,
  sevenx,
  eigthx,
  ninex,
  tenx,
  elevenx,
  twelvex,
];
const cardSegments = [q, k, j];
const colorSegments = [c, d, s, h];
function Lucky12home() {
  const userId = localStorage.getItem("userId");
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(12).fill(0));
  const [lastBet, setLastBet] = useState(Array(12).fill(0));
  const [spinning, setSpinning] = useState(false);
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultDataWheel, setGameResultDataWheel] = useState(null);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

    const { myDetails } = useProfile(userId);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q);
    };
    Lucky12Socket.on("demo_12card", handleSocket);
    return () => Lucky12Socket.off("demo_12card", handleSocket);
  }, []);


    const handleNumberClick = (index) => {
  const bet = Number(betAmount);
  const wallet = Number(myDetails?.data?.wallet || 0);

  if (isNaN(bet) || bet <= 0) return;

  setNumberAmounts((prev) => {
    const currentTotal = prev.reduce((sum, val) => sum + val, 0);
    const available = wallet - currentTotal;

    // Prevent bet from exceeding remaining wallet
    if (bet > available) return prev;

    const updated = [...prev];
    updated[index] += bet;

    setLastBet(updated);
    return updated;
  });
};

  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     const updated = [...prev];
  //     updated[index] += betAmount;
  //     setLastBet(updated);
  //     return updated;
  //   });
  // };

  const handleRebet = () => {
    setNumberAmounts([...lastBet]);
  };

  const handleDoubleUp = () => {
    setNumberAmounts((prev) => prev.map((amount) => amount * 2));
  };

  const handleClear = () => {
    setNumberAmounts(Array(12).fill(0));
  };

  const GameGrid = [
    heart_k,
    hukum_k,
    eta_k,
    chidi_k,
    heart_q,
    hukum_q,
    eta_q,
    chidi_q,
    heart_j,
    hukum_j,
    eta_j,
    chidi_j,
  ];
  const GameColumnGrid = [l_heart, l_shep, l_diamond, l_club];
  const GameRowGrid = [green_k, green_q, green_j];
  // Column index to grid index mapping
  const columnIndexMap = {
    0: [0, 4, 8],
    1: [1, 5, 9],
    2: [2, 6, 10],
    3: [3, 7, 11],
  };
  const rowIndexMap = {
    0: [0, 1, 2, 3],
    1: [4, 5, 6, 7],
    2: [8, 9, 10, 11],
  };

  const handleColumnClick = (colIndex) => {
    setNumberAmounts((prev) => {
      const updated = [...prev];
      const indicesToUpdate = columnIndexMap[colIndex] || [];
      indicesToUpdate.forEach((i) => {
        updated[i] += betAmount;
      });
      setLastBet(updated);
      return updated;
    });
  };

  const handlrowClick = (colIndex) => {
    setNumberAmounts((prev) => {
      const updated = [...prev];
      const indicesToUpdate = rowIndexMap[colIndex] || [];
      indicesToUpdate.forEach((i) => {
        updated[i] += betAmount;
      });
      setLastBet(updated);
      return updated;
    });
  };

  //apis
  const placeBetHandler = async () => {
    const bets = [];
    numberAmounts.forEach((amount, index) => {
      if (amount > 0) bets.push({ game_id: index + 1, amount });
    });
    const payload = {
      user_id: userId,
      bets: bets,
    };
    console.log("payload", payload);
    try {
      const response = await axios.post(`${apis?.lucky12_bet}`, payload);
      console.log("response", response);
      if (response?.data?.success === true) {
        setProfileRefresher(true);
        localStorage.setItem("lucky12_bet", "true");
        toast.success(response?.data?.message,{
  style: { backgroundColor: '#333', color: '#fff', fontSize: '16px' },
});
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Something went wrong");
    }
  };

  // game result api
  const gameResultForSpinner = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${apis?.lucky12_result}${userId}&limit=20`
      );
      console.log("gameresult gameResultForSpinner", response);
      if (response?.data?.success === true) {
        const aa = response?.data?.result_12[0];
        setGameResultDataWheel(aa);
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
    try {
      const response = await axios.get(
        `${apis?.lucky12_result}${userId}&limit=20`
      );
      console.log("gameresult gameResult", response);
      if (response?.data?.success === true) {
        const isJackpot = response?.data?.result_12[0]?.jackpot;
        if (
          isJackpot > 1 &&
          timeLeft?.timerStatus === 2 &&
          timeLeft?.timerBetTime === 5
        ) {
          setIsResultModal(true);
        }
        setGameResultData(response?.data?.result_12);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server error", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  // console.log("isResultModal",isResultModal)
  const gameBetHistory = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${apis?.lucky12_bet_history}${userId}&limit=10`
      );
      // console.log("srespbne history", response);
      if (response?.data?.success === true) {
        setGameResultHistory(response?.data?.data);
      }
    } catch (err) {
      // console.log("errror", err);
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const resetWheel = () => {
    setSpinning(false);
    setIsResultModal(false);
    setNumberAmounts(Array(12).fill(0));
  };
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);
  useEffect(() => {
    // const betStatus = localStorage.getItem("lucky12_bet");
    if (timeLeft?.timerBetTime === 9 && timeLeft?.timerStatus === 2) {
      setSpinning(true);
    }
    if (timeLeft?.timerBetTime === 5 && timeLeft?.timerStatus === 2) {
      gameResultForSpinner();
      gameResult();
    }
    if (timeLeft?.timerBetTime === 2 && timeLeft?.timerStatus === 2) {
      gameBetHistory();
    }
    if (timeLeft?.timerBetTime === 1 && timeLeft?.timerStatus === 2) {
      resetWheel();
    }
  }, [timeLeft]);

  const numberOfSpins = 5;
  const cardSegmentsNew = [
    "Q",
    "K",
    "J",
    "Q",
    "K",
    "J",
    "Q",
    "K",
    "J",
    "Q",
    "K",
    "J",
  ];
  const card_index = 1; // K
  const cardTargetIndex = cardSegmentsNew.findIndex((val) => {
    if (card_index === 0) return val === "Q";
    if (card_index === 1) return val === "K";
    if (card_index === 2) return val === "J";
  });
  const colorSegmentsNew = [
    "Heart",
    "Club",
    "Diamond",
    "Spade",
    "Heart",
    "Club",
    "Diamond",
    "Spade",
    "Heart",
    "Club",
    "Diamond",
    "Spade",
  ];
  const color_index = 1; // Club
  const colorTargetIndex = colorSegmentsNew.findIndex((val) => {
    if (color_index === 0) return val === "Heart";
    if (color_index === 1) return val === "Club";
    if (color_index === 2) return val === "Diamond";
    if (color_index === 3) return val === "Spade";
  });
  const cardDegreesToRotate =
    360 * numberOfSpins + (360 - cardTargetIndex * 30);
  const colorDegreesToRotate =
    360 * numberOfSpins + (360 - colorTargetIndex * 30);

  // console.log("gameResultData[0]",gameResultData);
  return (
    <div
      className="h-full min-h-screen overflow-y-scroll hide-scrollbar bg-cover bg-center"
      style={{
        backgroundImage: `url(${lucky_bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Lucky12Header
        profileRefresher={profileRefresher}
        gameResultHistory={gameResultHistory}
        setProfileRefresher={setProfileRefresher}
      />

      {/* Serial + Timer */}
      <div className="flex justify-between m-4">
        <div
          className="relative h-8 w-36 text-[10px] font-roboto border border-[#c6a120] bg-[#411A5C] text-white text-center rounded-lg overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <div className="flex flex-col items-center justify-center h-full px-2">
            S.no:-{" "}
            <p className="font-bold">
              {gameResultData?.length > 0 &&
                Number(gameResultData[0]?.period_no) + 1}
            </p>
          </div>
        </div>
        <div
          className="relative h-8 w-24 text-[20px] font-mono font-bold border border-[#c6a120] bg-[#411A5C] text-white text-center rounded-lg overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <div className="flex items-center justify-center h-full px-2">
            {timeLeft?.timerBetTime}
          </div>
        </div>
      </div>

      {/* history Row */}
      <div
        className="relative h-[3.7rem] text-[10px] font-roboto text-center text-white mx-4 mb-1"
        style={{ textShadow: "1px 1px 3px black" }}
      >
        <img
          src={h_bg}
          alt="Header Background"
          className="absolute inset-0 w-full h-full opacity-90"
        />

        <div className="relative mx-3 h-full">
          <div className="relative flex overflow-x-auto justify-center hide-scrollbar h-full items-start pt-2 text-center ">
            {gameResultData?.length > 0 ? (
              gameResultData.map((imgSrc, index) => {
                // console.log(
                //   "imgSrcimgSrc",
                //   imgSrc,
                //   cardSegments[imgSrc?.card_index]
                // );
                return (
                  <div
                    key={index}
                    className={`relative h-11 flex items-center justify-center ${
                      index === 0 ? "w-16" : "w-8"
                    }`}
                  >
                    {/* ee image as background for each item */}
                    <img
                      src={ee}
                      alt="ee background"
                      className="absolute inset-0 w-full h-full"
                    />
                    {/* <div className="absolute top-0 left-0">fdf</div> */}
                    {/* Foreground main images centered inside */}
                    {index === 0 ? (
                      <div className="relative flex items-center justify-evenly w-full z-10">
                        <img
                          src={cardSegments[imgSrc?.card_index]}
                          alt={`Dice ${index} - Top`}
                          className="w-6 h-6"
                        />
                        <img
                          src={colorSegments[imgSrc?.color_index]}
                          alt={`Dice ${index} - Bottom`}
                          className="w-6 h-6"
                        />
                        {/* {imgSrc?.jackpot > 0 && (
                          <p className="absolute top-[30px] left-5 text-black z-40">
                            <img
                              src={jackpotImages[imgSrc?.jackpot - 2]}
                              alt={`Dice ${index} - Bottom`}
                              className="w-6 h-6"
                            />
                          </p>
                        )} */}
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center justify-center space-y-0. ">
                        <img
                          src={cardSegments[imgSrc?.card_index]}
                          alt={`Dice ${index} - Top`}
                          className="w-5 h-4"
                        />
                        <img
                          src={colorSegments[imgSrc?.color_index]}
                          alt={`Dice ${index} - Bottom`}
                          className="w-5 h-5"
                        />
                        {/* {imgSrc?.jackpot > 1 && (
                          <p className="absolute top-9 left- text-black z-40">
                            <img
                              src={jackpotImages[imgSrc?.jackpot - 2]}
                              alt={`Dice ${index} - Bottom`}
                              className="w-6 h-6"
                            />
                          </p>
                        )} */}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center">no data</p>
            )}
          </div>
        </div>
        <div className="relative mx-3 h-full -mt-1">
          <div className="relative flex overflow-x-auto hide-scrollbar h-full items-start pt-2 text-center ">
            {gameResultData?.length > 0 ? (
              gameResultData.map((imgSrc, index) => {
                // console.log(
                //   "imgSrcimgSrc",
                //   imgSrc,
                //   cardSegments[imgSrc?.card_index]
                // );
                return (
                  <div
                    key={index}
                    className={`relative h-14 flex items-center justify-center ${
                      index === 0 ? "w-16" : "w-8"
                    }`}
                  >
                    
                    {index === 0 ? (
                      <div className="relative flex items-center justify-evenly w-full z-10">
                        {imgSrc?.jackpot > 1 && (
                          <p className="absolute -top-10 left-5 text-black z-40">
                            <img
                              src={jackpotImages[imgSrc?.jackpot - 2]}
                              alt={`Dice ${index} - Bottom`}
                              className="w-6 h-5"
                            />
                          </p>
                        )}
                        </div>
                    ) : (
                      <div className="relative flex flex-col items-center justify-center space-y-0 ">
                       
                        {imgSrc?.jackpot > 1 && (
                          <p className="absolute -top-14 left- text-black z-40">
                           dfd <img
                              src={jackpotImages[imgSrc?.jackpot - 2]}
                              alt={`Dice ${index} - Bottom`}
                              className="w-6 h-5"
                            />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center">no data</p>
            )}
          </div>
        </div>
      </div>

      {/* Round Placeholder */}
      <div className="flex items-center justify-center">
        {/* Wheel Container */}
        <div className="relative w-64 h-64 mx-auto my-4 rounded-full border-4 border-[#c6a120] shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-[#1b0b2e]">
          {/* Rotating Outer Ring - Clockwise */}
          {spinning && (
            <motion.img
              src={l_12_first_wheel}
              alt="Outer Wheel"
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ rotate: 0 }}
              animate={{ rotate: cardDegreesToRotate }}
              transition={{
                duration: 5,
                ease: [0.2, 0.6, 0.4, 1],
              }}
            />
          )}
          {!spinning && (
            <img
              src={l_12_first_wheel}
              alt="Outer Wheel"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
          {spinning && (
            <motion.img
              src={l_12_second_wheel}
              alt="Outer Wheel"
              className="absolute left-10 top-10 inset-0 w-[calc(100%-80px)] h-[calc(100%-80px)]"
              initial={{ rotate: 0 }}
              animate={{ rotate: -colorDegreesToRotate }}
              transition={{
                duration: 5,
                ease: [0.2, 0.6, 0.4, 1],
              }}
            />
          )}
          {!spinning && (
            <img
              src={l_12_second_wheel}
              alt="Outer Wheel"
              className="absolute left-10 top-10 inset-0 w-[calc(100%-80px)] h-[calc(100%-80px)]"
            />
          )}
          {/* Static Center Ring */}
          <img
            src={l_16_third_wheel}
            alt="Inner Wheel"
            className="absolute top-1/2 left-1/2 w-28 h-28 transform -translate-x-1/2 -translate-y-1/2 z-10"
          />

          {/* Center Symbols (q + s) */}
          <div className="absolute top-1/2 left-1/2 flex items-center justify-center space-x-1 transform -translate-x-1/2 -translate-y-1/2 z-20">
            {/* <img src={q} alt="q" className="w-8 h-8" />
            <img src={s} alt="s" className="w-8 h-8" /> */}
            {timeLeft?.timerBetTime < 5 && timeLeft?.timerStatus === 2 && (
              <>
                <img
                  src={
                    cardSegments[
                      gameResultDataWheel && gameResultDataWheel?.card_index
                    ]
                  }
                  alt="q"
                  className="w-8 h-8"
                />
                <img
                  src={
                    colorSegments[
                      gameResultDataWheel && gameResultDataWheel?.color_index
                    ]
                  }
                  alt="s"
                  className="w-8 h-8"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-3">
        <div className="flex flex-col items-start justify-start">
          {/* Column Grid */}
          <div className="grid grid-cols-4 gap-2 mb-2 w-64">
            {GameColumnGrid.map((image, index) => (
              <div
                key={index}
                onClick={() => handleColumnClick(index)}
                className="relative text-center h-10 w-12 cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Column ${index + 1}`}
                  className="mx-auto w-12 h-12 mb-2"
                />
              </div>
            ))}
          </div>

          {/* Game Grid with Row Grid */}
          <div className="flex items-start justify-center gap-3">
            {/* Game Grid */}
            <div className="grid grid-cols-4 gap-2 w-64">
              {GameGrid.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleNumberClick(index)}
                  className="relative text-center h-16 w-12 pt-2 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Grid ${index + 1}`}
                    className="w-12 h-10 mb-1"
                  />
                  <div className="h-4 w-full bg-white rounded-lg text-[10px] text-black">
                    {numberAmounts[index] > 0 &&
                      Number(numberAmounts[index]).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Row Grid */}
            <div className="grid grid-cols-1 gap-2">
              {GameRowGrid.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handlrowClick(index)}
                  className="relative text-center h-16 w-14 pt-2 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`Row ${index + 1}`}
                    className="w-14 h-12 mb-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Lucky12Futter
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        onPlaceBet={placeBetHandler}
        timeLeft={timeLeft}
        onDouble={handleDoubleUp}
        onRebet={handleRebet}
        onClear={handleClear}
      />
      {isResultModal && <JokerModal onClose={() => setIsResultModal(false)} />}
    </div>
  );
}

export default Lucky12home;
