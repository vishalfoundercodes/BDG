import React, { useEffect, useState } from "react";
import Amrela from "../../assets/TitliKabootarAssets/Amrela.png";
import butterfly from "../../assets/TitliKabootarAssets/Butterfly.png";
import cow from "../../assets/TitliKabootarAssets/Cow.png";
import Eagle from "../../assets/TitliKabootarAssets/Egle.png";
import Gariyo from "../../assets/TitliKabootarAssets/Gariyo.png";
import Kite from "../../assets/TitliKabootarAssets/Kite.png";
import Lamp from "../../assets/TitliKabootarAssets/Lamp.png";
import Rebit from "../../assets/TitliKabootarAssets/Rebit.png";
import Rose from "../../assets/TitliKabootarAssets/Rose.png";
import sun from "../../assets/TitliKabootarAssets/sun.png";
import Bucket from "../../assets/TitliKabootarAssets/WatterDoll.png";
import Ball from "../../assets/TitliKabootarAssets/Ball.png";
import back from "../../assets/TitliKabootarAssets/back.png";
import bg from "../../assets/TitliKabootarAssets/bg.png";
import Historybg from "../../assets/TitliKabootarAssets/Historybg.png";
import balance from "../../assets/TitliKabootarAssets/balnce.png";
import DoubleUp from "../../assets/TitliKabootarAssets/DoubleUp.png";
import clear from "../../assets/TitliKabootarAssets/clear.png";
import repeat from "../../assets/TitliKabootarAssets/repeat.png";
import minmax from "../../assets/TitliKabootarAssets/min-max.png";
import Playwinbox from "../../assets/TitliKabootarAssets/Playwinbox.png";
import TKheader from "./TKheader";
import TitliSocket from "./TitliSocket";
import TkFutter from "./TkFutter";
import axios from "axios";
import { toast } from "react-toastify";
import ResultModal from "./ResultModal";
import apis from "../../utils/apis";
import useProfile from "../../reusable_component/gameApi";

function TitliKabootarHome() {
  const userId = localStorage.getItem("userId");
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(12).fill(0));
  const [lastBet, setLastBet] = useState(Array(12).fill(0));
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isResultModal, setIsResultModal] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] =
    useState(null);
  const [gameResultData, setGameResultData] = useState([]);
  const [lastWinAMount, setLastWinAMount] = useState(null);
  const [targetIndex, setTargetIndex] = useState("");
  const [animating, setAnimating] = useState(false);
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
     const { myDetails } = useProfile(userId);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      //   console.log("Socket Data:", q);
      setTimeLeft(q?.timerBetTime);
    };
    TitliSocket.on("demo_titli", handleSocket);
    return () => TitliSocket.off("demo_titli", handleSocket);
  }, []);

  const gameList = [
    Amrela,
    Ball,
    sun,
    Lamp,
    cow,
    Bucket,
    Kite,
    Gariyo,
    Rose,
    butterfly,
    Eagle,
    Rebit,
  ];

  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     const updated = [...prev];
  //     updated[index] += betAmount;
  //     setLastBet(updated);
  //     return updated;
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
    setNumberAmounts(Array(12).fill(0));
  };

  const startAnimation = (targetIndex) => {
    // const targetIndex=6
    // console.log("targetIndextargetIndex",targetIndex)
    const winIndex = Number(targetIndex) - 1;
    if (isNaN(winIndex) || winIndex < 0 || winIndex >= gameList.length) {
      toast.warn("Enter a valid number between 1 and 12");
      return;
    }
    setAnimating(true);
    let count = 0;
    let currentIndex = 0;
    const totalCycles = 2;
    const totalSteps = gameList.length * totalCycles + winIndex;

    const interval = setInterval(() => {
      setHighlightIndex(currentIndex);
      currentIndex = (currentIndex + 1) % gameList.length;
      count++;
      if (count > totalSteps) {
        clearInterval(interval);
        setAnimating(false);
        setHighlightIndex(winIndex);
      }
    }, 100);
  };
  const totalBetAmount = numberAmounts.reduce((sum, amount) => sum + amount, 0);

  // apis
  const placeBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const bets = [];
    numberAmounts.forEach((amount, index) => {
      if (amount > 0) bets.push({ number: Number(index + 1), amount });
    });

    const payload = {
      userid: userId,
      game_id: 21,
      bet: bets,
    };
    // console.log("object", payload);
    try {
      const response = await axios.post(apis?.titli_bet, payload);
      // console.log("bet resoinse", response);
      if (response?.data?.status === true) {
        setProfileRefresher(true);
        localStorage.setItem("titli_bet", "true");
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
  const gameResult = async () => {
    const payload = {
      game_id: 21,
      limit: 10,
    };
    // console.log("payloadpayload",payload)
    try {
      const res = await axios.post(`${apis?.titli_result}`, payload);
      // console.log("game res", res);
      if (res?.data?.status === true) {
        setGameResultData(res?.data?.data);
      }
    } catch (err) {
      console.log("eerr", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  
  const gameResultAnimation = async () => {
    const payload = {
      game_id: 21,
      limit: 10,
    };
    try {
      const res = await axios.post(`${apis?.titli_result}`, payload);
      // console.log("game res animations", res);
      if (res?.data?.status === true) {
        const card_id = res?.data?.data[0]?.card_id;
        startAnimation(card_id);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const getLastAmountHnadler = async () => {
    const sr = gameResultData[0]?.games_no;
    const payload = {
      games_no: sr,
      userid: userId,
      game_id: 21,
      //   limit:1
    };
    try {
      const res = await axios.post(`${apis?.titli_getAmount}`, payload);
      //   console.log("getLastAmountHnadler res", res);
      if (res?.data?.status === true) {
        setLastWinAMount(res?.data?.data);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
const gameResultApiForAnnouncement = async () => {
    const payload = {
      game_id: 21,
      limit: 10,
    };
    // console.log("payloadpayload", payload);
    try {
      const res = await axios.post(`${apis?.titli_result}`, payload);
      // console.log("game res", res);
      if (res?.data?.status === true) {
        const a = res?.data?.data[0]?.games_no;
        gameResultAnnouncement(a);
      }
    } catch (err) {
      // console.log("eerr", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameResultAnnouncement = async (a) => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    // const sr = gameResultData[0]?.games_no;
    const payload = {
      userid: Number(userId),
      game_id: 21,
      games_no: a,
    };
    // console.log("pYLOASD", payload);
    try {
      const response = await axios.post(`${apis?.titli_winAmount}`, payload);
      // console.log("announcement responsere", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response);
        setIsResultModal(true);
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
    const payload = {
      userid: userId,
      game_id: 21,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(`${apis?.titli_bet_history}`, payload);
      //   console.log("hisotry", res);
      if (res?.data?.status === true) {
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
    getLastAmountHnadler();
  }, []);

  useEffect(() => {
    const betStatus = localStorage.getItem("titli_bet");
    if (timeLeft === 8) {
      gameResult();
    }
    if (timeLeft === 7) {
      gameResultAnimation();
    }
    if (timeLeft === 5) {
      if (betStatus === "true") {
        gameResultApiForAnnouncement();
        localStorage.setItem("titli_bet", "false");
        gameBetHistory();
      }
    }

    if (timeLeft === 1) {
      handleClear();
      setIsResultModal(false);
      setNumberAmounts(Array(12).fill(0));
      getLastAmountHnadler();
    }
  }, [timeLeft]);
  //   console.log("gameResultData", gameResultData);
  return (
    <div
      className="h-full min-h-screen overflow-y-scroll hide-scrollbar bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <TKheader
        profileRefresher={profileRefresher}
        gameResultHistory={gameResultHistory}
        setProfileRefresher={setProfileRefresher}
      />

      {/* Serial + Timer */}
      <div className="flex justify-between m-4">
        <div
          className="relative h-8 w-36 text-[10px] font-roboto text-center text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={balance}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex flex-col items-center justify-center h-full px-2">
            S.no:-{" "}
            <p className="font-bold">
              {gameResultData?.length > 0 &&
                Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
        </div>
        <div
          className="relative h-8 w-24 text-center text-[20px] font-bold font-mono text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={balance}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex items-center justify-center h-full px-2">
            {timeLeft}
          </div>
        </div>
      </div>

      {/*results history */}
      <div className="relative m-2 h-16  rounded-lg overflow-hidden">
        <img
          src={Historybg}
          alt="History Background"
          className="absolute w-full inset-0 h-full opacity-70"
        />

        <div
          className="relative flex overflow-x-auto space-x-2 items-center h-full text-center text-[20px] font-bold font-mono p-2 hide-scrollbar mt-[7px] pl-36 xs1:pl-28 xs:pl-24 xsm:pl-28 justify-center"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          {gameResultData?.length > 0 ? (
            gameResultData?.map((imgSrc, index) => {
              const src = gameList[Number(imgSrc?.card_id - 1)];
              return (
                <img
                  key={index - 1}
                  src={src}
                  alt={`Result ${index}`}
                  className="w-10 h-10 shadow-md"
                />
              );
            })
          ) : (
            <p className="text-center w-full">no data</p>
          )}
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative bg-cover h-96 m-2">
        <img
          src={back}
          alt=""
          className="absolute inset-0 h-full w-full rounded-b-xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
          <div className="h-6 w-80">
            <img src={balance} alt="Balance" className="h-full w-full" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gameList.map((imgSrc, index) => (
              <div
                key={index}
                onClick={() => handleNumberClick(index)}
                className="w-16 flex flex-col items-center space-y-1 rounded rounded-b-lg p-1 cursor-pointer"
              >
                <div className="w-16 h-16 rounded overflow-hidden shadow relative bg-black">
                  <img
                    src={imgSrc}
                    alt={`grid-${index}`}
                    className="w-full h-full object-cover"
                  />
                  {highlightIndex === index && (
                    <div className="absolute inset-0 bg-yellow opacity-60 rounded"></div>
                  )}
                </div>
                <div className="w-16 h-5 rounded shadow bg-white flex items-center justify-center text-black">
                  {Number(numberAmounts[index]).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="m-3 flex items-center justify-between">
        <div className="h-10 w-20 cursor-pointer" onClick={handleDoubleUp}>
          <img src={DoubleUp} alt="Double Up" />
        </div>
        <div className="h-10 w-20 cursor-pointer" onClick={handleRebet}>
          <img src={repeat} alt="Rebet" />
        </div>
        <div className="h-10 w-20 cursor-pointer" onClick={handleClear}>
          <img src={clear} alt="Clear" />
        </div>
      </div>

      <div className="flex items-center justify-between m-4">
        {/* Min/Max Button */}
        <div
          className="relative h-12 w-24 cursor-pointer"
          onClick={handleDoubleUp}
        >
          <img src={minmax} alt="Double Up" className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className=" flex items-center justify-center text-white font-bold text-sm w-12  mt-3 ml-4">
              1
            </div>
            <div className=" flex items-center justify-center text-white font-bold text-sm w-12  mt-3 ml-2">
              500
            </div>
          </div>
        </div>

        {/* Play Button */}
        <div
          className="relative h-12 w-28 cursor-pointer"
          onClick={handleDoubleUp}
        >
          <img src={Playwinbox} alt="Double Up" className="h-full w-full" />
          <div className="absolute  left-5 inset-0  items-center justify-end">
            <div className=" text-white  text-xs pl-2  text-center w-12 mt-2">
              {Number(totalBetAmount).toFixed(2)}
            </div>
            <div className="text-green text-xs mt-1 w-12 ml-5">
              {lastWinAMount
                ? Number(lastWinAMount?.total_win_amount).toFixed(2)
                : 0}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-3 xs1:mt-0">
        <TkFutter
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
          gameList={gameList}
        />
      )}
    </div>
  );
}

export default TitliKabootarHome;
