import React, { useEffect, useState } from "react";
import TeenPattiHeader from "./TeenPattiHeader";
import bg_card from "../../assets/TeenPattiAssets/bg_card.png";
import { motion, AnimatePresence } from "framer-motion";

import card1 from "../../assets/cards/1.png";
import card2 from "../../assets/cards/2.png";
import card3 from "../../assets/cards/3.png";
import card4 from "../../assets/cards/4.png";
import card5 from "../../assets/cards/5.png";
import card6 from "../../assets/cards/6.png";
import card7 from "../../assets/cards/7.png";
import card8 from "../../assets/cards/8.png";
import card9 from "../../assets/cards/9.png";
import card10 from "../../assets/cards/10.png";
import card11 from "../../assets/cards/11.png";
import card12 from "../../assets/cards/12.png";
import card13 from "../../assets/cards/13.png";
import card14 from "../../assets/cards/14.png";
import card15 from "../../assets/cards/15.png";
import card16 from "../../assets/cards/16.png";
import card17 from "../../assets/cards/17.png";
import card18 from "../../assets/cards/18.png";
import card19 from "../../assets/cards/19.png";
import card20 from "../../assets/cards/20.png";
import card21 from "../../assets/cards/21.png";
import card22 from "../../assets/cards/22.png";
import card23 from "../../assets/cards/23.png";
import card24 from "../../assets/cards/24.png";
import card25 from "../../assets/cards/25.png";
import card26 from "../../assets/cards/26.png";
import { GiCardExchange } from "react-icons/gi";
import TeenPattiFutter from "./TeenPattiFutter";
import TeenPattiSocket from "./TeenPattiSocket";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../../utils/apis";
import ResultModal from "./ResultModal";

function TeenPattiHome() {
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [isResultModal, setIsResultModal] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  // const [gameResultDataAnnouncemntCards, setGameResultDataAnnouncemntCards] =
  //   useState(null);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState(
    []
  );
  const [gameResultData, setGameResultData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    TeenPattiSocket.on("demo_teenpatti", handleSocket);
    return () => TeenPattiSocket.off("demo_teenpatti", handleSocket);
  }, []);

  const ShowCard = [1, 2, 3, 4, 5, 6];

  const [selectedCards, setSelectedCards] = useState([null, null, null]);
  const [flipped, setFlipped] = useState(false);

  // We will keep track of which random card to show after flipping for each slot
  const [revealedCards, setRevealedCards] = useState([null, null, null]);

  const cardImages = {
    1: card1,
    2: card2,
    3: card3,
    4: card4,
    5: card5,
    6: card6,
    7: card7,
    8: card8,
    9: card9,
    10: card10,
    11: card11,
    12: card12,
    13: card13,
    14: card14,
    15: card15,
    16: card16,
    17: card17,
    18: card18,
    19: card19,
    20: card20,
    21: card21,
    22: card22,
    23: card23,
    24: card24,
    25: card25,
    26: card26,
  };

  const handleCardClick = (card) => {
    if (selectedCards.includes(card)) return;
    if (timeLeft<11) return;
    const index = selectedCards.findIndex((slot) => slot === null);
    if (index !== -1) {
      const updated = [...selectedCards];
      updated[index] = card;
      setSelectedCards(updated);
      setFlipped(false);
      setRevealedCards([null, null, null]);
    }
  };

  const handleSlotClick = (index) => {
    if (flipCard) return;
    const updated = [...selectedCards];
    updated[index] = null;
    setSelectedCards(updated);
    setFlipped(false);
    setRevealedCards([null, null, null]);
  };

  const toggleFlip = () => {
    if (!flipped) {
      // On flipping to show front side: assign random cards from selectedCards to revealedCards
      // We can shuffle or pick random cards, here we assign selected cards in random order

      // Shuffle selected cards:
      let shuffled = [...selectedCards].sort(() => Math.random() - 0.5);

      setRevealedCards(shuffled);
      setFlipped(true);
    } else {
      // Flip back to card backs
      setFlipped(false);
      setRevealedCards([null, null, null]);
    }
  };

  const isCardSelected = (card) => selectedCards.includes(card);
  // console.log("isCardSelected", selectedCards);
  // Check if all 3 slots filled
  const allSlotsFilled = selectedCards.every((slot) => slot !== null);

  // apis
  const placeBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }

    const payload = {
      userid: userId,
      game_id: 18,
      amount: betAmount,
      selected_cards: selectedCards,
    };
    // console.log("object", payload)
    try {
      const response = await axios.post(apis?.teenPatti_bet, payload);
      console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        localStorage.setItem("teenpatti_bet", "true");
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
  const gameResult = async () => {
    try {
      const res = await axios.post(`${apis?.teenPatti_Results}`, {
        game_id: 18,
        limit: 20,
      });
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
    const sr = Number(gameResultData[0]?.games_no)+1;
    console.log("`${apis?.teenPatti_win_amount}``${apis?.teenPatti_win_amount}`",`${apis?.teenPatti_win_amount}`,sr)
    try {
      const response = await axios.post(`${apis?.teenPatti_win_amount}`, {
        userid: Number(userId),
        game_id: 18,
        games_no: sr,
      });
      console.log("gameresult gameResultAnnouncement", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response?.data);
        setIsResultModal(true);
      }
    } catch (err) {
      console.log("server erro ", err)
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
      game_id: 18,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(`${apis?.teenPatti_Bet_history}`, payload);
      // console.log("hisotry", res);
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
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);
  useEffect(() => {
    const betStatus = localStorage.getItem("teenpatti_bet");
    if (timeLeft >= 11 && timeLeft <= 30 && betStatus === "true") {
      setFlipCard(true);
    }
   
    if (timeLeft === 5) {
      gameResult();
      if (betStatus === "true") {
        gameResultAnnouncement();
        localStorage.setItem("teenpatti_bet", "false");
        gameBetHistory();
      }
    }

    if (timeLeft === 1) {
      setFlipCard(false);
      setSelectedCards([null, null, null]);
      setRevealedCards([null, null, null]);
      setIsResultModal(false);
    }
  }, [timeLeft, gameResultData]);
  const parsedCards = gameResultData?.length > 0 && [1, 2, 3];
  // console.log("isResultModal", isResultModal);
  return (
    <div
      className="h-full w-full overflow-y-scroll justify-between flex flex-col hide-scrollbar"
      style={{
        background:
          "linear-gradient(to bottom, #5881BA, #5881BA, #5881BA, #5881BA)",
      }}
    >
      <div className="w-full">
        <TeenPattiHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />

        {/* Timer & Serial Info */}
        <div className="flex justify-between m-2">
          <div
            className="h-8 w-24 bg-[#3c5982] opacity-90 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:-{" "}
            <p className="font-bold">
              {Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-[#3c5982] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>

        {/* History Bar */}
        <div
          className="flex overflow-x-auto hide-scrollbar space-x-2 items-center h-17 bg-[#3c5982] opacity-90 rounded-lg text-white text-[14px] font-bold font-mono m-2 p-2"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          {gameResultData?.length > 0 ? (
            gameResultData?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[14px] justify-center"
              >
                <div className="w-4 h-4 rounded-sm text-[10px] flex items-center justify-center bg-slate-500">
                  {item?.game_name?.slice(0, 1)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">no data</p>
          )}
        </div>

        {/* Grid of Selectable Cards */}
        <div className="grid grid-cols-3 gap-3 m-4 h-80">
          <AnimatePresence>
            {timeLeft < 8 && parsedCards
              ? parsedCards.map((card, index) => (
                  <motion.div
                    key={`result-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="h-36 w-full rounded-sm flex items-center justify-center">
                      <motion.img
                        src={cardImages[parseInt(card)]}
                        alt={`Result Card ${card}`}
                        layoutId={`result-card-${index}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>
                ))
              : // Show interactive selectable cards before timeLeft === 5
                ShowCard.filter((card) => !isCardSelected(card)).map((card) => (
                  <motion.div
                    key={card}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => handleCardClick(card)}
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="h-36 w-full rounded-sm flex items-center justify-center">
                      <motion.img
                        src={bg_card}
                        alt="card"
                        layoutId={`card-${card}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>

        {/* Bottom 3 Slots for Selected Cards */}
        <div className="grid grid-cols-3 gap-7 m-6">
          {selectedCards.map((card, index) => (
            <motion.div
              key={index}
              layout
              className="h-28 w-full   flex items-center justify-center cursor-pointer perspective-1000"
              onClick={() => handleSlotClick(index)}
            >
              {card ? (
                <motion.div
                  // animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  layoutId={`card-${card}`}
                >
                  {/* Front of card - show revealed card only if flipped */}
                  <img
                    src={
                      flipped && revealedCards[index]
                        ? cardImages[revealedCards[index]]
                        : bg_card
                    }
                    alt={`card-${card}`}
                    className="w-full h-full object-contain absolute top-0 left-0"
                    style={{
                      transform: "rotateY(360deg)",
                      transition: "transform 0.6s",
                    }}
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white   border border-white rounded-lg"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Single Flip Button for all 3 cards, shown only when all slots filled */}
        {flipCard && (
          <div className="flex justify-center m-6">
            <button
              onClick={toggleFlip}
              className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              {flipped ? "Flip Back" : <GiCardExchange />}
            </button>
          </div>
        )}
      </div>
      <div className="w-full">
        <TeenPattiFutter
          placeBetHandler={placeBetHandler}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          timeLeft={timeLeft}
          allSlotsFilled={allSlotsFilled}
        />
      </div>
      {isResultModal && (
        <ResultModal
          onClose={() => setIsResultModal(false)}
          announcementData={gameResultDataAnnouncemnt}
          cardImages={cardImages}
        />
      )}
    </div>
  );
}

export default TeenPattiHome;
