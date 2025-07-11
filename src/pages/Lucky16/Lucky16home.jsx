import { useEffect, useState } from "react";
import lucky_bg from "../../assets/Lucky16Assets/lucky_bg.png";
import h_bg from "../../assets/Lucky16Assets/h_bg.png";
import chidi_a from "../../assets/Lucky16Assets/chidi_a.png";
import chidi_j from "../../assets/Lucky16Assets/chidi_j.png";
import chidi_k from "../../assets/Lucky16Assets/chidi_k.png";
import chidi_q from "../../assets/Lucky16Assets/chidi_q.png";
import l_club from "../../assets/Lucky16Assets/l_club.png";
import l_heart from "../../assets/Lucky16Assets/l_heart.png";
import l_shep from "../../assets/Lucky16Assets/l_shep.png";
import l_diamond from "../../assets/Lucky16Assets/l_diamond.png";
import green_q from "../../assets/Lucky16Assets/green_q.png";
import green_k from "../../assets/Lucky16Assets/green_k.png";
import green_j from "../../assets/Lucky16Assets/green_j.png";
import green_a from "../../assets/Lucky16Assets/green_a.png";
import heart_k from "../../assets/Lucky16Assets/heart_k.png";
import heart_q from "../../assets/Lucky16Assets/heart_q.png";
import heart_j from "../../assets/Lucky16Assets/heart_j.png";
import heart_a from "../../assets/Lucky16Assets/hart_a.png";
import hukum_a from "../../assets/Lucky16Assets/hukum_a.png";
import hukum_j from "../../assets/Lucky16Assets/hukum_j.png";
import hukum_k from "../../assets/Lucky16Assets/hukum_k.png";
import hukum_q from "../../assets/Lucky16Assets/hukum_q.png";
import eta_a from "../../assets/Lucky16Assets/eta_a.png";
import eta_j from "../../assets/Lucky16Assets/eta_j.png";
import eta_k from "../../assets/Lucky16Assets/eta_k.png";
import eta_q from "../../assets/Lucky16Assets/eta_q.png";
import a from "../../assets/Lucky16Assets/a.png";
import c from "../../assets/Lucky16Assets/c.png";
import d from "../../assets/Lucky16Assets/d.png";
import h from "../../assets/Lucky16Assets/h.png";
import j from "../../assets/Lucky16Assets/j.png";
import k from "../../assets/Lucky16Assets/k.png";
import q from "../../assets/Lucky16Assets/q.png";
import s from "../../assets/Lucky16Assets/s.png";
import ee from "../../assets/Lucky16Assets/ee.png";
import l_16_first_wheel from "../../assets/Lucky16Assets/l_16_first_wheel.png";
import l_16_second_wheel from "../../assets/Lucky16Assets/l_16_second_wheel.png";
import l_16_third_wheel from "../../assets/Lucky16Assets/l_16_third_wheel.png";
import Lucky16Header from "./Lucky16Header";
import Lucky16Futter from "./Lucky16Futter";
import { motion } from "framer-motion";
import Lucky16Socket from "./Lucky16Socket";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import axios from "axios";
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
import JokerModal from "./JokerModal";
import useProfile from "../../reusable_component/gameApi";
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
const cardSegments = [k, a, j, q];
const colorSegments = [h, c, d, s];
function Lucky16home() {
  const [betAmount, setBetAmount] = useState(0.0);
  const [numberAmounts, setNumberAmounts] = useState(Array(16).fill(0));
  const [lastBet, setLastBet] = useState(Array(16).fill(0));
  const [spinning, setSpinning] = useState(false);
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultDataWheel, setGameResultDataWheel] = useState(null);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
 
   const { myDetails } = useProfile(userId);
   
  useEffect(() => {
    const handleSocket = (hotair) => {
      //   console.log("hotair", hotair);
      const q = JSON.parse(hotair);
      setTimeLeft(q);
    };
    Lucky16Socket.on("demo_16card", handleSocket);
    return () => Lucky16Socket.off("demo_16card", handleSocket);
  }, []);

  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     // const updated = [...prev];
  //     // updated[index] += betAmount;
  //     // setLastBet(updated);
  //     // return updated;
      
  //     const updated = [...prev];

  //   // Convert betAmount to a number before adding
  //   const bet = Number(betAmount) || 0;

  //   updated[index] += bet;

  //   setLastBet(updated);
  //   return updated;
  //   });
  // };
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

  const handleRebet = () => {
    setNumberAmounts([...lastBet]);
  };

  const handleDoubleUp = () => {
    setNumberAmounts((prev) => prev.map((amount) => amount * 2));
  };

  const handleClear = () => {
    setNumberAmounts(Array(16).fill(0));
  };

  const GameGrid = [
     heart_a,
    hukum_a,
    eta_a,
    chidi_a,
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
  const GameRowGrid = [green_a,green_k, green_q, green_j];
  // Column index to grid index mapping
  const columnIndexMap = {
    0: [0, 4, 8,12],
    1: [1, 5, 9,13],
    2: [2, 6, 10,14],
    3: [3, 7, 11,15],
  };

  const rowIndexMap = {
    0: [0, 1, 2, 3],
    1: [4, 5, 6, 7],
    2: [8, 9, 10, 11],
    3: [12, 13, 14, 15],
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
    // console.log("payload", payload);
    try {
      const response = await axios.post(`${apis?.lucky16_bet}`, payload);
      // console.log("response", response);
      if (response?.data?.success === true) {
        setProfileRefresher(true);
        localStorage.setItem("lucky16_bet", "true");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      // console.error("Error placing bet:", error);
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
        `${apis?.lucky16_result}${userId}&limit=20`
      );
      console.log("gameresult gameResultForSpinner", response);
      if (response?.data?.success === true) {
        const aa = response?.data?.result_16[0];
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
        `${apis?.lucky16_result}${userId}&limit=20`
      );
      // console.log("gameresult gameResult", response);
      if (response?.data?.success === true) {
        setGameResultData(response?.data?.result_16);
         const isJackpot = response?.data?.result_16[0]?.jackpot;
        if (isJackpot > 1&&timeLeft?.timerStatus === 2 && timeLeft?.timerBetTime === 5) {
          setIsResultModal(true)
        }
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server error", err);
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
    // console.log("${apis?.lucky16_bet_history}${userId}&limit=10",`${apis?.lucky16_bet_history}${userId}&limit=10`)
    try {
      const response = await axios.get(
        `${apis?.lucky16_bet_history}${userId}&limit=10`
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
    setNumberAmounts(Array(16).fill(0));
  };
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);
  useEffect(() => {
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
  //   console.log("gameResultData", gameResultData);
  return (
    <div
      className="h-full min-h-screen overflow-y-scroll hide-scrollbar bg-cover bg-center"
      style={{
        backgroundImage: `url(${lucky_bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Lucky16Header
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
        className="relative h-[3.7rem] text-[10px] font-roboto text-center text-white mx-2 mb-1"
        style={{ textShadow: "1px 1px 3px black" }}
      >
        <img
          src={h_bg}
          alt="Header Background"
          className="absolute inset-0 w-full h-full opacity-90"
        />

        <div className="relative mx-3 h-full">
          <div className="relative flex overflow-x-auto hide-scrollbar h-full items-start pt-2 text-center ">
            {gameResultData?.length > 0 ? (
              gameResultData.map((imgSrc, index) => {
             
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
                              className="w-6 h-6"
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
                              className="w-6 h-6"
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
              src={l_16_first_wheel}
              alt="Outer Wheel"
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ rotate: 0 }}
              animate={{ rotate: 1080 }}
              transition={{
                duration: 5,
                ease: [0.2, 0.6, 0.4, 1],
              }}
            />
          )}
          {!spinning && (
            <img
              src={l_16_first_wheel}
              alt="Outer Wheel"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
          {spinning && (
            <motion.img
              src={l_16_second_wheel}
              alt="Outer Wheel"
              className="absolute left-10 top-10 inset-0 w-[calc(100%-80px)] h-[calc(100%-80px)]"
              initial={{ rotate: 0 }}
              animate={{ rotate: -1080 }}
              transition={{
                duration: 5,
                ease: [0.2, 0.6, 0.4, 1],
              }}
            />
          )}
          {!spinning && (
            <img
              src={l_16_second_wheel}
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
          <div className="absolute top-1/2 left-1/2 flex items-center justify-center space-x-1 transform -translate-x-1/2 -translate-y-1/2 z-20">
           
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
      <Lucky16Futter
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

export default Lucky16home;
