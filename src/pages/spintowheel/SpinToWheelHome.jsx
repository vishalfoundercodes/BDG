import { useEffect, useRef, useState } from "react";
import SpinToWheelHeader from "./SpinToWheelHeader";
import SpinWheel from "./SpinWheel";
import SpinToWheelFooter from "./SpinToWheelFooter";
import SpinSocket from "./SpinSocket";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import ResultModal from "./ResultModal";
import useProfile from "../../reusable_component/gameApi";


function SpinToWheelHome() {
  const [betAmount, setBetAmount] = useState(1);
  const [numberAmounts, setNumberAmounts] = useState(Array(10).fill(0));
  const [oddAmount, setOddAmount] = useState(0);
  const [evenAmount, setEvenAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const wheelRef = useRef();
  const [isResultModal, setIsResultModal] = useState(false);
  const [profileRefresher, setProfileRefresher] = useState(false)
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);

  const userId = localStorage.getItem("userId");
  const { myDetails } = useProfile(userId);
  const navigate = useNavigate()
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      // console.log("qqqqqqqqqqqq",q)
      setTimeLeft(q?.timerBetTime);
    };
    SpinSocket.on("demo_spin2win", handleSocket);
    return () => SpinSocket.off("demo_spin2win", handleSocket);
  }, []);

  // const handleNumberClick = (index) => {
  //   setNumberAmounts((prev) => {
  //     const updated = [...prev];
  //     updated[index] += betAmount;
  //     return updated;
  //   });
  // };
  
  const handleNumberClick = (index) => {
    const wallet = Number(myDetails?.data?.wallet || 0);
    const totalUsed = numberAmounts.reduce((sum, num) => sum + num, 0);
    const bet = Number(betAmount || 0);

    if (totalUsed + bet > wallet) {
      // Optionally show a warning
      // toast.warning("Not enough balance");
      return; // prevent update
    }

    setNumberAmounts((prev) => {
      const updated = [...prev];
      updated[index] += bet;
      return updated;
    });
  };
  
  const handleOddClick = () => {
    setOddAmount((prev) => prev + betAmount);
  };

  const handleEvenClick = () => {
    setEvenAmount((prev) => prev + betAmount);
  };

  const handleClear = () => {
    setNumberAmounts(Array(10).fill(0));
    setOddAmount(0);
    setEvenAmount(0);
  };


  useEffect(() => {
    gameResult()
    gameBetHistory()
  }, [])

  useEffect(() => {
    const betStatus = localStorage.getItem("spin_bet")
    if (timeLeft === 11) {
      gameResult()
    }
    if (timeLeft === 4) {
      if (betStatus === "true") {
        gameResultAnnouncement()
        localStorage.setItem("spin_bet", "false")
      }
    }
    if (timeLeft === 2) {
      gameBetHistory()
    }
    if (timeLeft === 1) {
      setIsResultModal(false)
      handleClear()
    }
  }, [timeLeft]);

  const placeBetHandler = async () => {
    const bets = [];

    numberAmounts.forEach((amount, index) => {
      // const finalIndex = index === 0 ? 1 : index === 1 ? 0 : index === 2 ? 9 : index === 3 ? 8 : index === 4 ? 7 : index === 5 ? 6 : index === 6 ? 5 : index === 7 ? 4 : index === 8 ? 3 : index === 9 ? 2 : null
      if (amount > 0) bets.push({ game_id: index, amount });
    });

    if (oddAmount > 0) bets.push({ game_id: 11, amount: oddAmount });
    if (evenAmount > 0) bets.push({ game_id: 10, amount: evenAmount });
    const payload = {
      user_id: userId,
      bets
    }
    try {
      const response = await axios.post(`${apis?.spin_bet}`, payload);
      // console.log("apyload", payload)
      // console.log("respone", response)
      if (response?.data?.success === true) {
        setProfileRefresher(true)
        localStorage.setItem("spin_bet", "true");
        toast.success(response?.data?.message)
        // if (wheelRef.current?.spinWheel) wheelRef.current.spinWheel();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Bet placement error!");
    }
  };

  // game result api
  const gameResult = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`${apis?.spin_result}?user_id=${userId}&limit=15`)
      console.log("gameresult responsere", response)
      if (response?.data?.success === true) {
        setGameResultData(response?.data?.data)
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server error", err)
      } else {
        toast.error(err?.response?.data?.message)
      }
    }
  }
  const gameResultAnnouncement = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`${apis?.spin_result}?user_id=${userId}`)
      // console.log("gameresult responsere", response)
      if (response?.data?.success === true) {
        setGameResultDataAnnouncemnt(response?.data)
        setIsResultModal(true)
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err)
      } else {
        toast.error(err?.response?.data?.message)
      }
    }
  }

  const gameBetHistory = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`${apis?.spin_betHistory}?user_id=${userId}&limit=10`)
      console.log("respbne history", response)
      if (response?.data?.success === true) {
        setGameResultHistory(response?.data?.data)
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err)
      } else {
        toast.error(err?.response?.data?.message)
      }
    }
  }

  // console.log("gameResultData", userSpesult)
  return (
    <div
      // className="h-screen w-full overflow-y-scroll flex flex-col items-center justify-between hide-scrollbar"
      className="h-full w-full overflow-y-scroll flex flex-col items-center hide-scrollbar"
      style={{
        background:
          "linear-gradient(to bottom, #8B8000, #B8860B, #DAA520, #DAA520, #DAA520, #B8860B, #8B8000)",
      }}
    >
      <div className="w-full">
        <SpinToWheelHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />
        {/* Serial + Timer */}
        <div className="flex justify-between  my-2">
          <div
            className="h-8 w-24 bg-[#8B8000] opacity-90 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no :-{" "}
            <p className="font-bold">
              {gameResultData?.length > 0 &&
                (timeLeft > 11
                  ? Number(gameResultData[0]?.period_no) + 1
                  : gameResultData[0]?.period_no)}
            </p>
          </div>
          <div
            className="h-8 w-24 bg-[#8B8000] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {timeLeft}
          </div>
        </div>
        <div className="flex items-center justify-center px-3">
          <div
            className="h-8 w-full bg-[#8B8000] overflow-scroll hide-scrollbar opacity-90 rounded-lg flex items-center justify-center text-[20px] font-bold font-mono"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            {gameResultData?.length > 0 ? (
              gameResultData.slice(timeLeft > 11 ? 0 : 1).map((item, i) => (
                <p
                  className="bg-yellow rounded-md px-2 flex items-center justify-between w-full text-center"
                  key={i}
                >
                  {item?.win_number}
                </p>
              ))
            ) : (
              <p className="w-full text-center">no data</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center mt-5 xs1:mt-0 w-full">
          <SpinWheel ref={wheelRef} gameResultData={gameResultData} />
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-2 mx-4 my-2 xs1:my-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              onClick={() => handleNumberClick(i)}
              className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] rounded-lg text-center text-white font-bold text-lg shadow-md cursor-pointer"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              {i}
              <div className="text-sm font-normal border-t-[1px] border-t-gradient-to-tr from-[#00308F] to-[#4169E1] ">
                {Number(numberAmounts[i])}
              </div>
            </div>
          ))}
        </div>

        {/* Odd & Even Grid */}
        <div className="grid grid-cols-2 gap-2 mx-4 mb-0">
          <div
            onClick={handleOddClick}
            className="relative bg-gradient-to-tr from-[#800020] to-[#B22222] w-full flex items-center rounded-lg text-center text-white font-bold text-lg py-0.5 xs1:py-1.5 shadow-md cursor-pointer"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            {" "}
            <div className="flex justify-between mr-2 ml-2 w-full">
              <div> Odd</div>
              <div className="text-sm font-normal">{Number(oddAmount)}</div>
            </div>
          </div>
          <div
            onClick={handleEvenClick}
            className="relative bg-gradient-to-tr from-[#00308F] to-[#4169E1] rounded-lg w-full flex items-center text-center text-white font-bold text-lg py-0.5 xs1:py-1.5 shadow-md cursor-pointer"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            <div className="flex justify-between w-full mr-2 ml-2 ">
              <div> Even</div>
              <div className="text-sm font-normal">{Number(evenAmount)}</div>
            </div>
          </div>
        </div>

        {/* Clear Button */}
        <div className="mx-4 my-4 xs1:my-4 mb-0 xs1:mb-0">

          <button
            onClick={handleClear}
            className="w-full bg-yellow rounded-lg text-white font-bold py-0.5 xs1:py-1 shadow-md"
            style={{ textShadow: "1px 1px 2px black" }}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="w-full mt-0 xs1:mt-0">
        <SpinToWheelFooter
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={placeBetHandler}
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

export default SpinToWheelHome;
