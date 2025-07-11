import React, { useEffect, useState } from "react";
import JackpotHeader from "./jackpotHeader";
import JackpotFooter from "./JackpotFooter";
import fire_card from "../../assets/RedBlack/fire_card.gif";

import "./jackPotFlip.css";
import JackpotSocket from "./JackpotSocket";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import axios from "axios";
import ResultModal from "./ResultModal";
import useProfile from "../../reusable_component/gameApi";

function JackpotHome() {
  const userId = localStorage.getItem("userId");
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(6).fill(0));
  const [flippedIndex, setFlippedIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [revealedCards, setRevealedCards] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState(
    []
  );
  const [profileRefresher, setProfileRefresher] = useState(false);
   const { myDetails } = useProfile(userId);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    JackpotSocket.on("demo_jackpot", handleSocket);
    return () => JackpotSocket.off("demo_jackpot", handleSocket);
  }, []);
// console.log("betAmountc",betAmount)
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);

  useEffect(() => {
    const betStatus = localStorage.getItem("jackpot_bet");
    if (timeLeft === 5) {
      gameResultShuffle();
      gameResult();
      
    }
    if (timeLeft === 3) {
      if (betStatus === "true") {
        gameResultAnnouncement();
        localStorage.setItem("jackpot_bet", "false");
        gameBetHistory();
      }
    }

    if (timeLeft === 30) {
      // handleClear();
      // setIsResultModal(false);
      setNumberAmounts(Array(6).fill(0));
      setFlippedIndex(-1);
    }
  }, [timeLeft]);
  const diceImages = [
    { number: "SET", tir: `JACKPOT 20x` },
    { number: "PURE SEQ", tir: "10x" },
    { number: "SEQ", tir: "6x" },
    { number: "COLOR", tir: "5x" },
    { number: "PAIR", tir: "4x" },
    { number: "HIGH CARD", tir: "3x" },
  ];

  // Cards to reveal on flip (3 fire cards)
  // const revealedCards = [card1, card4, card6];
  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     const updated = [...prev];
  //     updated[index] += Number(betAmount);
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

    // setLastBet(updated);
    return updated;
  });
};

  // Flip cards one by one every 1 second when button clicked
  const flipCardsSequentially = (jsonImages) => {
    let i = 0;
    const interval = setInterval(() => {
      setFlippedIndex(i);
      i++;
      if (i >= jsonImages?.length) clearInterval(interval);
    }, 1000);
  };

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
      game_id: 25,
      json: bets,
    };
    console.log("object", payload);
    try {
      const response = await axios.post(apis?.jackpot_bet, payload);
      console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        localStorage.setItem("jackpot_bet", "true");
        toast.success(response?.data?.message);
      } else {
        toast.error("Bet failed!");
      }
    } catch (err) {
      console.log("error hisotry", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  // period number and last some results
  const gameResultShuffle = async () => {
    try {
      const res = await axios.post(`${apis?.jackpot_five_result}`, {
        game_id: 25,
        limit: "1",
      });
      console.log("game res", res);
      if (res?.data?.status === 200) {
        const a =res?.data?.data[0]
        const jsonImages = JSON.parse(a?.json);
        // console.log("jsonImagesjsonImages", jsonImages);
        flipCardsSequentially(jsonImages);
        setRevealedCards(jsonImages);
      }
    } catch (err) {
      console.log("error hisotry", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const gameResult = async () => {
    try {
      const res = await axios.post(`${apis?.jackpot_five_result}`, {
        game_id: 25,
        limit: "20",
      });
      // console.log("game res", res);
      if (res?.data?.status === 200) {
        setGameResultData(res?.data?.data);
      }
    } catch (err) {
      console.log("error hisotry", err);
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
    const sr = Number(gameResultData[0]?.games_no);
    const payload={
          userid: Number(userId),
          game_id: 25,
          games_no: sr,
      }
      // console.log("response payload",payload)
    try {
      const response = await axios.post(`${apis?.jackpot_win_amount}`, payload);
      console.log("gameresult announcment", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response?.data);
        setIsResultModal(true);
      }
    } catch (err) {
      console.log("server erro ", err);
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
      game_id: 25,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(`${apis?.jhandiMunda_Bet_history}`, payload);
      console.log("hisotry", res);
      if (res?.data?.status === 200) {
        setGameResultHistory(res?.data?.data);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
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
          "linear-gradient(to right,#8B4513, #A0522D, #A0522D, #8B4513)",
      }}
    >
      <div className="w-full">
        <JackpotHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />

        {/* Serial + Timer */}
        <div className="flex justify-between m-4">
          <div
            className="h-8 w-24 bg-[#d66f26] opacity-90 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:-{" "}
            <p className="font-bold">
              {Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-[#d66f26] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>

        {/* Card History */}
        <div
          className="flex overflow-x-auto hide-scrollbar space-x-2 items-center h-10 bg-[#990000] opacity-90 rounded-lg text-white text-center text-[12px] font-bold font-mono m-2 p-2"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          {gameResultData?.length > 0 ? (
            gameResultData.map((item, i) => {
              const url = diceImages[item?.number - 1];
              return (
                <p
                  key={i}
                  className="px-3 py-1 bg-white text-black rounded-md shadow whitespace-nowrap"
                >
                  {url?.number}
                </p>
              );
            })
          ) : (
            <p>no data</p>
          )}
        </div>

        {/* Fire Cards + Betting Grid */}
        <div className="flex flex-col items-center justify-center">
          {/* Fire cards with flip animation */}
          <div
            className="flex space-x-4 my-4"
            style={{ perspective: "1000px" }}
          >
            {revealedCards?.length > 0 ? (
              revealedCards?.map((cardSrc, idx) => (
                <div
                  key={idx}
                  className="flip-card w-24 h-36 cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className={`flip-card-inner ${
                      flippedIndex >= idx ? "flipped" : ""
                    }`}
                  >
                    <div className="flip-card-front w-full h-full rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={fire_card}
                        alt="Fire card"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flip-card-back w-full h-full rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={cardSrc}
                        alt={`Card ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between w-full space-x-4">
                {[...Array(3)].map((_, index) => (
                  <img
                    key={index}
                    src={fire_card}
                    alt="Fire card"
                    className="w-24 h-36 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Betting Grid */}
          <div className="grid grid-cols-3 gap-2 m-2 xsm:m-4">
            {diceImages.map((image, index) => (
              <div
                key={index}
                onClick={() => handleNumberClick(index)}
                className="relative bg-[#555555] rounded-lg text-center text-white font-bold text-[12px]  w-28 shadow-md cursor-pointer pt-2"
                style={{ textShadow: "1px 1px 2px black" }}
              >
                {image.number}
                <div className="bg-[#333333] text-sm font-normal mt-1 rounded-lg shadow-md cursor-pointer m-2 p-2">
                  {Number(numberAmounts[index])}
                </div>
                <div className="text-[10px] mb-2">
                  {image.tir?.slice(0, 7)} <br /> {image.tir?.slice(7)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        <JackpotFooter
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

export default JackpotHome;
