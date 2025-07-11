import { useState, useEffect } from "react";
import DiceHeader from "./DiceHeader";
import dice1 from "../../assets/usaAsset/dice/1.png";
import dice2 from "../../assets/usaAsset/dice/2.png";
import dice3 from "../../assets/usaAsset/dice/3.png";
import dice4 from "../../assets/usaAsset/dice/4.png";
import dice5 from "../../assets/usaAsset/dice/5.png";
import dice6 from "../../assets/usaAsset/dice/6.png";
import DiceFooter from "./DiceFooter";
import DiceSocket from "./DiceSocket";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../../utils/apis";
import { useNavigate } from "react-router-dom";
import ResultModal from "./ResultModal";
import useProfile from "../../reusable_component/gameApi";

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];
export default function DiceHome() {
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(6).fill(0));
  const [shuffling, setShuffling] = useState(false);
  const [currentDice, setCurrentDice] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResultModal, setIsResultModal] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState(
    []
  );
  const [gameResultData, setGameResultData] = useState([]);
     const { myDetails } = useProfile(userId);
  const navigate = useNavigate();
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    DiceSocket.on("demo_dice", handleSocket);
    return () => DiceSocket.off("demo_dice", handleSocket);
  }, []);


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




// console.log("numberAmounts",numberAmounts)
  const shuffleDice = (diceNumber) => {
    console.log("diceNumberdiceNumber",diceNumber)
    if (!diceNumber || diceNumber < 1 || diceNumber > 6) {
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
        setCurrentDice(diceNumber - 1);
        setShuffling(false);
      }
    }, 100);
  };
console.log("shuffuf",shuffling)
  const handleClear = () => {
    setNumberAmounts(Array(6).fill(0));
  };
  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, []);
  useEffect(() => {
        const betStatus = localStorage.getItem("dice_bet")
        if (timeLeft === 6) {
          gameResultDiceShuffle()
          gameResult()
        }
       
        if (timeLeft === 3) {
            if (betStatus === "true") {
                gameResultAnnouncement()
                localStorage.setItem("dice_bet", "false")
            }
            gameBetHistory()
        }
       
        if (timeLeft === 30) {
            setIsResultModal(false)
            setCurrentDice(0);
            handleClear()
        }
    }, [timeLeft]);

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
      game_id: 20,
      json: bets,
    };
    // console.log("object", payload)
    try {
      const response = await axios.post(apis?.dragon_bet, payload);
      // console.log("bet resoinse", response)
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        localStorage.setItem("dice_bet", "true");
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
      const res = await axios.get(`${apis?.dice_Results}?game_id=20&limit=15`);
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
  const gameResultDiceShuffle = async () => {
    // console.log("dff")
    try {
      const res = await axios.get(`${apis?.dice_Results}?game_id=20&limit=15`);
      console.log("game gameResultDiceShuffle", res);
      if (res?.data?.status === 200) {
        const re=res?.data?.data;
         if (!shuffling) {
            const diceNumber = re?.length > 0 && Number(re[0]?.number)
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

  const gameResultAnnouncement = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    console.log("userId", typeof Number(userId));
    const sr =
      gameResultData?.length > 0 &&
      (timeLeft > 11
        ? Number(gameResultData[0]?.games_no) + 1
        : gameResultData[0]?.games_no);
    try {
      const response = await axios.get(`${apis?.dice_win_amount}`, {
        params: {
          userid: Number(userId),
          game_id: 20,
          games_no: sr,
        },
      });
      console.log("gameresult responsere", response);
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
      game_id: 20,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(`${apis?.dice_Bet_history}`, payload);
      // console.log("hisotry", res)
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
          "linear-gradient(to bottom, #333333, #444444, #444444, #444444, #444444, #444444, #333333)",
      }}
    >
      <div className="w-full">
        <DiceHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />

        {/* Serial + Timer */}
        <div className="flex justify-between m-4">
          <div
            className="h-8 w-24 bg-[#555555] opacity-90 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:-{" "}
            <p className="font-bold">
              {gameResultData?.length > 0 &&
                Number(gameResultData[0]?.games_no) + 1}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-[#555555] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>

        <div
          className=" flex overflow-x-auto hide-scrollbar space-x-2 h-8 items-center bg-[#555555] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono mx-3"
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
                  className="w-6 h-6 shadow-md rounded-md"
                />
              );
            })
          ) : (
            <p className="w-full text-center">no data</p>
          )}
        </div>

        {/* Shuffling Dice */}
        <div className="text-center mt-6">
          <img
            src={diceImages[currentDice]}
            alt={`Dice ${currentDice }`}
            className="w-24 h-24 mx-auto shadow-lg shadow-black/90 rounded-lg"
          />
          {/* <div className="mt-2 text-white font-bold">Dice Number: {currentDice + 1}</div> */}
        </div>

        {/* Dice Grid */}
        <div className="grid grid-cols-3 gap-2 m-4">
          {diceImages.map((image, index) => (
            <div
              key={index}
              onClick={() => handleNumberClick(index)}
              className="relative bg-[#555555] rounded-lg text-center text-white font-bold text-lg shadow-md cursor-pointer pt-2"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              <img
                src={image}
                alt={`Dice ${index + 1}`}
                className="mx-auto w-12 h-12 mb-1"
              />
              <div className="bg-[#333333] text-sm font-normal mt-1 rounded-lg shadow-md cursor-pointer m-2 p-2">
                {Number(numberAmounts[index])?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Clear Button */}
        <div className="m-4">
          <button
            onClick={handleClear}
            className="w-full bg-[#777777] rounded-lg text-white font-bold py-2 shadow-md hover:bg-green"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="w-full">
        <DiceFooter
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
