import { useState, useEffect } from "react";
import homebg from "../../assets/FunTargetAssets/homebg.png";
import yellobtns from "../../assets/FunTargetAssets/yellobtns.png";
import one from "../../assets/FunTargetAssets/1.png";
import five from "../../assets/FunTargetAssets/5.png";
import ten from "../../assets/FunTargetAssets/10.png";
import fifty from "../../assets/FunTargetAssets/50.png";
import thousand from "../../assets/FunTargetAssets/1000.png";
import fivehundred from "../../assets/FunTargetAssets/fivehundred.png";
import badachkra from "../../assets/FunTargetAssets/badachkra.png";
import chotachakra1 from "../../assets/FunTargetAssets/chotachakra.png";
import chotachakra2 from "../../assets/FunTargetAssets/chotachakra.png"; // add alternate image here
import scr1 from "../../assets/FunTargetAssets/scr.png";
import scr2 from "../../assets/FunTargetAssets/scrpio.gif"; // add alternate image here
import badge from "../../assets/FunTargetAssets/badge.png";
import cancelbet from "../../assets/FunTargetAssets/cancelbet.png";
import betokright from "../../assets/FunTargetAssets/betokright.png";
import lefttake from "../../assets/FunTargetAssets/lefttake.png";
import cirlbtn from "../../assets/FunTargetAssets/cirlbtn.png";
import circlbtn from "../../assets/FunTargetAssets/circlbtn.png";
import bottombig from "../../assets/FunTargetAssets/bottombig.png";
import staticCoin from "../../assets/FunTargetAssets/staticCoin.png";
import main from "../../assets/FunTargetAssets/main.gif";
import FunTargetHeader from "./FunTargetHeader";
import FunTargetSocket from "./FunTargetSocket";
import apis from "../../utils/apis";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function FunTarget() {
  const [selectedCoinValue, setSelectedCoinValue] = useState(null);
  const [circleValues, setCircleValues] = useState(Array(10).fill(0));
  const [selectedAmounts, setSelectedAmounts] = useState(Array(10).fill(0));
  const [lastBet, setLastBet] = useState(Array(10).fill(0));
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] =
    useState(null);
  const [betStatus, setBetStatus] = useState(false);
  // const [isResultModal, setIsResultModal] = useState(false);
  // Spin wheel states
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q);
    };
    FunTargetSocket.on("demo_funtarget", handleSocket);
    return () => FunTargetSocket.off("demo_funtarget", handleSocket);
  }, []);

  const spinWheel = (nnumber) => {
    if (isSpinning) return;
    const randomIndex = nnumber;
    let aa;
    if (randomIndex === 0) {
      aa = 0;
    } else if (randomIndex === 1) {
      aa = 9;
    } else if (randomIndex === 2) {
      aa = 8;
    } else if (randomIndex === 3) {
      aa = 7;
    } else if (randomIndex === 4) {
      aa = 6;
    } else if (randomIndex === 5) {
      aa = 5;
    } else if (randomIndex === 6) {
      aa = 4;
    } else if (randomIndex === 7) {
      aa = 3;
    } else if (randomIndex === 8) {
      aa = 2;
    } else if (randomIndex === 9) {
      aa = 1;
    }
    setIsSpinning(true);

    // --- Calculate spin target based on result number (0-9) ---
    const result = aa; // you can replace with your own result
    const segments = 20;
    const degreesPerSegment = 360 / segments;
    const finalAngle = result * 2 * degreesPerSegment; // 2 segments per number

    const extraTurns = 8; // 5 to 7 full spins
    const totalRotation = extraTurns * 360 + finalAngle;

    setRotation(totalRotation);
    setTimeout(() => {
      setIsSpinning(false);
    }, 6000);
  };
  const coinlist1 = [
    { img: one, value: 1 },
    { img: five, value: 5 },
    { img: ten, value: 10 },
  ];

  const coinlist2 = [
    { img: fifty, value: 50 },
    { img: fivehundred, value: 500 },
    { img: thousand, value: 1000 },
  ];

  const handleCoinClick = (amount) => {
    setSelectedCoinValue(amount);
  };
  // console.log("circleValues", circleValues);
  const handleCircleClick = (index) => {
    // console.log("selected indes", index);
    if (selectedCoinValue !== null) {
      const updated = [...circleValues];
      updated[index] += selectedCoinValue;
      // console.log("updatedupdated", updated);
      setCircleValues(updated);
      setSelectedAmounts((prev) => {
        // console.log("porerepreprpe", prev);
        const newSelected = [...prev];
        newSelected[index] += selectedCoinValue;
        return newSelected;
      });
    }
  };
  // console.log("selectedAmountsselectedAmounts", selectedAmounts);
  // Function to repeat the last bet
  const repeatBet = () => {
    setCircleValues([...lastBet]);
    const amounts = [];
    lastBet.forEach((val) => {
      if (val > 0) {
        amounts.push(val);
      }
    });
    setSelectedAmounts(amounts);
  };

  // Function to cancel all bets
  const cancelBet = () => {
    setLastBet([...circleValues]);
    setCircleValues(Array(10).fill(0));
    setSelectedAmounts(Array(10).fill(0));
  };

  useEffect(() => {
    const totalBet = circleValues.reduce((a, b) => a + b, 0);
    if (totalBet > 0) {
      setLastBet([...circleValues]);
    }
  }, [circleValues]);

  const placeBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const bets = [];
    selectedAmounts.forEach((amount, index) => {
      // console.log("indexindiex", index);
      let ind;
      if (index === 0) {
        ind = 10;
      } else {
        ind = index;
      }
      if (amount > 0) bets.push({ game_id: Number(ind), amount });
    });

    const payload = {
      user_id: userId,
      bets: bets,
    };
    // console.log("object", payload);


  // const [sd, setSd] = useState(null); // stored bet payload
  //   const placeBet = async (payload) => {
  //   try {
  //     const response = await axios.post(apis?.funTarget_bet, payload);
  //     if (response?.data?.status === 200) {
  //       setBetStatus(true);
  //       setProfileRefresher(true);
  //       localStorage.setItem("funtarget_bet", "true");
  //       toast.success(response?.data?.message);
  //       setSd(payload); 
  //     } else {
  //       toast.error(response?.data?.message);
  //     }
  //   } catch (err) {
  //     console.error("error bet", err);
  //     if (err?.response?.data?.status === 500) {
  //       console.error("500 error", err);
  //     } else {
  //       toast.error(err?.response?.data?.message);
  //     }
  //   }
  // };






    try {
      const response = await axios.post(apis?.funTarget_bet, payload);
      // console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        setBetStatus(true);
        setProfileRefresher(true);
        localStorage.setItem("funtarget_bet", "true");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      console.log("error bet", err);
      if (err?.response?.data?.status === 500) {
        console.log("error bet", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  // period number and last some results
  const gameResultSpinWheel = async () => {
    try {
      const res = await axios.get(`${apis?.funTarget_result}`);
      // console.log("gameResultSpinWheel res", res);
      if (res?.data?.status === 200) {
        const number = res?.data?.data[0]?.number;
        spinWheel(number);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameResult = async () => {
    try {
      const res = await axios.get(`${apis?.funTarget_result}`);
      // console.log("game res", res);
      if (res?.data?.status === 200) {
        setGameResultData(res?.data?.data);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const gameResultAnnouncement = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    // const sr = gameResultData[0]?.games_no;

    // console.log("pYLOASD", payload);
    try {
      const response = await axios.get(`${apis?.funTarget_winAmount}${userId}`);
      // console.log("announcement responsere", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response?.data);
        // setIsResultModal(true);
      }
    } catch (err) {
      //   console.log("server announcement erro ", err);
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const gameBetHistory = async () => {
    try {
      const res = await axios.get(
        `${apis?.funTarget_bet_history}${userId}&limit=10`
      );
      // console.log("hisotry", res);
      if (res?.data?.status === 200) {
        setGameResultHistory(res?.data?.data);
      }
    } catch (err) {
      //   console.log("error hisotry", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    gameResult();
    gameBetHistory();
    gameResultAnnouncement();
    resetWheel();
  }, []);

  useEffect(() => {
    if (timeLeft?.timerBetTime === 9 && timeLeft?.timerStatus === 2) {
      gameResultSpinWheel();
    }
    if (timeLeft?.timerBetTime === 4 && timeLeft?.timerStatus === 2) {
      gameResult();
    }
    if (timeLeft?.timerBetTime === 3 && timeLeft?.timerStatus === 2) {
      gameBetHistory();
    }
    if (timeLeft?.timerBetTime === 1 && timeLeft?.timerStatus === 2) {
      resetWheel();
    }
  }, [timeLeft]);
  const resetWheel = () => {
    setRotation(0);
    setBetStatus(false);
    const Status = localStorage.getItem("funtarget_bet");
    if (Status === "true") {
      localStorage.setItem("funtarget_bet", "false");
    }
    // setSelectedAmounts([]);
    // setLastBet(Array(19).fill(0));
    // setCircleValues(Array(10).fill(0));
    // setSelectedCoinValue(null)
    setIsSpinning(false);
  };

  const totalBetAmount = selectedAmounts.reduce(
    (sum, amount) => sum + amount,
    0
  );
  useEffect(() => {
    const Status = localStorage.getItem("funtarget_bet");
    if (Status === "true") {
      setBetStatus(true);
    }
  }, [betStatus]);
  // console.log("gameResultHistory",betStatus)
  return (
    <div
      className="h-full min-h-screen overflow-y-scroll hide-scrollbar bg-center"
      style={{
        backgroundImage: `url(${homebg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <FunTargetHeader
        profileRefresher={profileRefresher}
        gameResultHistory={gameResultHistory}
        setProfileRefresher={setProfileRefresher}
        timeLeft={timeLeft}
      />

      {/* sn and win amount */}
      <div className="flex justify-between m-4">
        <div className="flex-col items-center justify-center text-center ">
          <p
            className="font-roboto text-[12px] font-extrabold"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no
          </p>
          <div
            className="relative h-6  w-20 px-1 text-[10px] font-roboto text-center  overflow-hidden"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            <img
              src={yellobtns}
              alt="Balance"
              className="absolute inset-0 w-full h-full opacity-90"
            />
            <div className="relative flex items-center justify-center h-full text-black font-bold">
              {gameResultData?.length > 0 &&
                Number(gameResultData[0]?.games_no) + 1}
            </div>
          </div>
        </div>
        <div className="flex-col items-center justify-center text-center ">
          <p
            className="font-roboto text-[12px] font-extrabold"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            Winner
          </p>
          <div
            className="relative h-6  w-20 text-[10px] font-roboto text-center text-white overflow-hidden"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            <img
              src={yellobtns}
              alt="Balance"
              className="absolute inset-0 w-full h-full opacity-90"
            />
            <div className="relative flex items-center justify-center h-full text-black font-bold">
              {gameResultDataAnnouncemnt?.win_amount > 0
                ? Number(gameResultDataAnnouncemnt?.win_amount).toFixed(2)
                : 0}
            </div>
          </div>
        </div>
      </div>
      {/* Time + Last 10 */}
      <div className="flex justify-between m-4">
        <div className="flex-col items-center justify-center text-center ">
          <p
            className="font-roboto text-[12px] font-extrabold"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            Time
          </p>
          <div
            className="relative h-6  w-20 text-[10px] font-roboto text-center text-white overflow-hidden"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            <img
              src={yellobtns}
              alt="Balance"
              className="absolute inset-0 w-full h-full opacity-90"
            />
            <div className="relative flex items-center justify-center h-full text-black font-bold">
              {timeLeft?.timerBetTime}
            </div>
          </div>
        </div>
        <div className="flex-col items-center justify-center text-center ">
          <p
            className="font-roboto text-[12px] font-extrabold"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            Last 10 data
          </p>
          <div
            className="relative h-6 w-20 px-1 text-[10px] font-roboto text-center text-white overflow-hidden"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            <img
              src={yellobtns}
              alt="Balance"
              className="absolute inset-0 w-full h-full opacity-90"
            />
            <div className="relative flex items-center justify-center h-full text-black font-bold">
              {gameResultData?.length > 0 ? (
                gameResultData.map((item, i) => <p key={i}>{item?.number}</p>)
              ) : (
                <p>No results</p> // Optional fallback
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chakra and Coins */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={badge}
          alt="Bottom Decoration"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-h-80 object-contain z-50"
        />
        <div className="flex justify-between items-start mt-20 relative z-20 ">
          {/* Left Coins */}
          <div className="h-8 w-24 bg-yellow opacity-80 rounded-e-xl">
            <div
              className="relative flex overflow-x-auto space-x-1 items-center h-full text-center hide-scrollbar justify-center"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              {coinlist1.map((coin, index) => (
                <img
                  key={index}
                  src={coin.img}
                  onClick={() => handleCoinClick(coin.value)}
                  className={`w-7 h-7 shadow-md cursor-pointer rounded-full ${
                    selectedCoinValue === coin.value
                      ? "border-2 border-yellow-400"
                      : ""
                  }`}
                  alt={`coin-${coin.value}`}
                />
              ))}
            </div>
          </div>

          {/* Chakra - with rotation */}
          <div
            className="relative h-52 w-52 rounded-full cursor-pointer"
            onClick={spinWheel}
          >
            <img
              className="absolute inset-0 w-full h-full object-contain"
              src={badachkra}
              alt="Big Wheel"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? "transform 6s cubic-bezier(0.33, 1, 0.68, 1)"
                  : "none",
                transformOrigin: "50% 50%",
              }}
            />

            <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 origin-center">
              <img src={isSpinning ? main : chotachakra1} alt="Center Wheel" />
            </div>
            <img
              src={isSpinning ? scr2 : scr1}
              alt="Top Decoration"
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 max-5 z-50"
            />
          </div>

          {/* Right Coins */}
          <div className="h-8 w-24 bg-yellow opacity-80 rounded-s-xl">
            <div
              className="relative flex overflow-x-auto space-x-1 items-center h-full text-center hide-scrollbar justify-center"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              {coinlist2.map((coin, index) => (
                <img
                  key={index}
                  src={coin.img}
                  onClick={() => handleCoinClick(coin.value)}
                  className={`w-7 h-7 shadow-md cursor-pointer rounded-full ${
                    selectedCoinValue === coin.value
                      ? "border-2 border-yellow-400"
                      : ""
                  }`}
                  alt={`coin-${coin.value}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Spin Button below chakra */}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-around gap-5 m-9">
        <button className="relative h-12 w-28" onClick={repeatBet}>
          <img src={cancelbet} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[14px] pointer-events-none">
            Repeat
          </div>
        </button>
        <button className="relative h-12 w-28" onClick={cancelBet}>
          <img src={cancelbet} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[14px] pointer-events-none">
            Cancel Bet
          </div>
        </button>
      </div>

      {/* Take / Cancel Ok */}
      <div className="flex items-start justify-between mt-9">
        <button className="relative h-12 w-28">
          <img src={lefttake} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[14px] pointer-events-none">
            Take
          </div>
        </button>
        <button
          disabled={timeLeft?.timerBetTime < 11 && timeLeft?.timerStatus === 2}
          onClick={placeBetHandler}
          className="relative h-12 w-28"
        >
          <img src={betokright} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[14px] pointer-events-none">
            Bet Ok
          </div>
        </button>
      </div>

      {/* Circle Buttons with Total Amount */}
      <div className="flex space-x-1 items-center justify-center mt-5">
        {[...Array(10).keys()].map((index) => (
          <div
            key={index}
            onClick={() => handleCircleClick(index)}
            className="cursor-pointer"
          >
            <div className="relative h-7 w-8">
              <img src={cirlbtn} alt="" className="h-full w-full" />
              {circleValues[index] > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-[10px] pointer-events-none">
                  {circleValues[index]}
                </div>
              )}
            </div>
            <div className="relative h-7 w-7">
              <img src={circlbtn} alt="" className="h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[14px] pointer-events-none">
                {index}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Coin Display */}
      <div className="flex items-start justify-between mt-7">
        <button className="relative h-7 w-18">
          <img src={lefttake} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[10px] pointer-events-none">
            {totalBetAmount}
          </div>
        </button>
        <div className="relative h-7 w-64 flex items-center justify-center text-black">
          <img src={bottombig} alt="" className="h-7 w-64 absolute inset-0" />
          <p className="absolute top-2 left-2 text-[10px] text-center w-full">
            {betStatus
              ? "You have placed bet in this match!"
              : "You have not placed bet in this match!"}
          </p>
        </div>
        <Link to={-1} className="relative  h-7 w-18">
          <img src={betokright} alt="" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[10px] pointer-events-none">
            Exit
          </div>
        </Link>
      </div>
    </div>
  );
}

export default FunTarget;
