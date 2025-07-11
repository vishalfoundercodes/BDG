import React, { useState, useEffect } from "react";
import JhandiMundaHeader from "./JhandiMundaHeader";
import heart from "../../assets/JhandiMunda/heart.png";
import flag from "../../assets/JhandiMunda/flag.png";
import dic_diamond from "../../assets/JhandiMunda/dic_diamond.png";
import dic_spade from "../../assets/JhandiMunda/dic_spade.png";
import dic_club from "../../assets/JhandiMunda/dic_club.png";
import face from "../../assets/JhandiMunda/face.png";
import dice_club from "../../assets/JhandiMunda/dice_club.png";
import dice_spade from "../../assets/JhandiMunda/dice_spade.png";
import dice_heart from "../../assets/JhandiMunda/dice_heart.png";
import dice_flag from "../../assets/JhandiMunda/dice_flag.png";
import dice_face from "../../assets/JhandiMunda/dice_face.png";
import dice_dimond from "../../assets/JhandiMunda/dice_dimond.png";
import JhandiMundaFooter from "./JhandiMundaFooter";
import axios from "axios";
import apis from "../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ResultModal from "./ResultModal";
import JhandiMundaSocket from "./JhandiMundaSocket";
import useProfile from "../../reusable_component/gameApi";

const diceImages = [heart, dic_spade, dic_diamond, dic_club, face, flag];
const randomDice = [
  dice_heart,
  dice_spade,
  dice_dimond,
  dice_club,
  dice_face,
  dice_flag,
];
function JhandiMundaHome() {
  const userId = localStorage.getItem("userId");
  const [timeLeft, setTimeLeft] = useState(0);
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [isResultModal, setIsResultModal] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState(
    []
  );
  const [gameResultData, setGameResultData] = useState([]);
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(6).fill(0));
  const [shuffling, setShuffling] = useState(false);
  const [shufflingDice, setShufflingDice] = useState(false);
  const [currentDice, setCurrentDice] = useState(0);
  const navigate = useNavigate();
     const { myDetails } = useProfile(userId);
  
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);

  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    JhandiMundaSocket.on("demo_jhandi", handleSocket);
    return () => JhandiMundaSocket.off("demo_jhandi", handleSocket);
  }, []);

  useEffect(() => {
    const betStatus = localStorage.getItem("jhandiMunda_bet");
    if (timeLeft === 5) {
      gameResultShuffle();
      gameResult();
    }

    if (timeLeft === 3) {
      if (betStatus === "true") {
        gameResultAnnouncement();
        localStorage.setItem("jhandiMunda_bet", "false");
        gameBetHistory();
      }
    }

    if (timeLeft === 1) {
      handleClear();
    }
  }, [timeLeft, gameResultData]);

  const shuffleDice = (diceNumber) => {
    const targetDice = parseInt(diceNumber);
    if (!targetDice || targetDice < 1 || targetDice > 6) {
      toast.warn("Number should be between 1 and 6.");
      return;
    }

    setShuffling(true);
    let counter = 0;
    const interval = setInterval(() => {
      setCurrentDice((prev) => (prev + 1) % 6);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        setCurrentDice(targetDice - 1);
        setShuffling(false);
      }
    }, 100);
  };

  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     const updated = [...prev];
  //     updated[index] += betAmount;
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

  const handleClear = () => {
    setNumberAmounts(Array(6).fill(0));
    setIsResultModal(false);
    setShufflingDice(false)
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
      game_id: 22,
      json: bets,
    };
    // console.log("object", payload);
    try {
      const response = await axios.post(apis?.jhandiMunda_bet, payload);
      //   console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        localStorage.setItem("jhandiMunda_bet", "true");
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
      const res = await axios.get(
        `${apis?.jhandiMunda_Results}?game_id=22&limit=1`
      );
      console.log("game gameResultShuffle", res);
      if (res?.data?.status === 200) {
        const a = res?.data?.data[0];
        if (!shuffling && a?.number) {
          setShufflingDice(true);
          const diceNumber = Number(a?.number);
          shuffleDice(diceNumber);
        }
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
      const res = await axios.get(
        `${apis?.jhandiMunda_Results}?game_id=22&limit=20`
      );
      console.log("game res", res);
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
    const sr = Number(gameResultData[0]?.games_no);
    try {
      const response = await axios.get(`${apis?.jhandiMunda_win_amount}/`, {
        params: {
          userid: Number(userId),
          game_id: 22,
          games_no: sr,
        },
      });
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
      game_id: 22,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(`${apis?.jhandiMunda_Bet_history}`, payload);
      //   console.log("hisotry", res);
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
  console.log("shuffleDice",shufflingDice)
  return (
    <div
      className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
      style={{
        background:
          "linear-gradient(to bottom, #66cc99, #339966, #006633, #003319)",
      }}
    >
      {" "}
      <div className="w-full">
        <JhandiMundaHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />

        {/* Top Row */}
        <div className="flex justify-between m-2">
          <div
            className="h-8 w-24 bg-[#339966] opacity-90 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:-{" "}
            <p className="font-bold">
              {Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-[#339966] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>

        {/* Dice History */}
        <div
          className="flex overflow-x-auto hide-scrollbar space-x-1 p-2 items-center bg-[#339966] rounded-lg text-center text-[20px] font-bold font-mono mx-3"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          {gameResultData?.length > 0 ? (
            gameResultData?.map((item, i) => {
              const url = diceImages[item?.number - 1];
              return (
                <img
                  key={i}
                  src={url}
                  alt={`Dice ${i}`}
                  className="w-12 object-cover h-12 shadow-md rounded-md"
                />
              );
            })
          ) : (
            <p>no data</p>
          )}
        </div>

        {/* Shuffling Dice */}
        <div className="text-center mt-6">
          {timeLeft < 6&&shufflingDice ? (
            <img
              src={randomDice[currentDice]}
              alt={`Dice ${currentDice + 1}`}
              className="w-24 h-24 mx-auto shadow-lg shadow-black/90 rounded-lg"
            />
          ) : (
            <p className="w-24 h-24 mx-auto shadow-2xl rounded-lg"></p>
          )}
          {/* <div className="mt-2 text-white font-bold">
            Dice Number: {currentDice + 1}
          </div> */}
        </div>
        {/* Dice Grid */}
        <div className="grid grid-cols-3 gap-0 m-4">
          {diceImages.map((image, index) => (
            <div
              key={index}
              onClick={() => handleNumberClick(index)}
              className="relative text-center text-white font-bold text-lg shadow-md cursor-pointer bg-cover bg-center h-32 border-[#48DFB1] border-[0.5px] rounded-lg"
              style={{
                backgroundImage: `url(${image})`,
              }}
            >
              <div className=" text-[10px] font-normal text-white pt-2 ">
                {Number(numberAmounts[index]).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <JhandiMundaFooter
          shuffling={shuffling}
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

export default JhandiMundaHome;
