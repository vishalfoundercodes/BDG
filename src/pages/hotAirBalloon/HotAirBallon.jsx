import React, { useState, useEffect } from "react";
import HotAirBallonHeader from "./HotAirBallonHeader";
import heart from "../../assets/JhandiMunda/heart.png";
import flag from "../../assets/JhandiMunda/flag.png";
import dic_diamond from "../../assets/JhandiMunda/dic_diamond.png";
import dic_spade from "../../assets/JhandiMunda/dic_spade.png";
import dic_club from "../../assets/JhandiMunda/dic_club.png";
import face from "../../assets/JhandiMunda/face.png";
import balloon_gif from "../../assets/ballon/balloon_gif.gif";
import blast from "../../assets/ballon/blast.gif";
import HotAirBallonFooter from "./HotAirBallonFooter";
import axios from "axios";
import apis from "../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HotAirBallonSocket from "./HotAirBallonSocket";
import { GoHistory } from "react-icons/go";
import MyHistoryModal from "./MyHistoryModal";
import "./hotAirBallon.css";
import bg from "../../assets/ballon/bg.png";
import balloon_bg from "../../assets/ballon/balloon_bg.png";
const diceImages = [heart, dic_spade, dic_diamond, dic_club, face, flag];

function HotAirBallon() {
  const userId = localStorage.getItem("userId");
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [showBlast, setShowBlast] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betDuration, setBetDuration] = useState(0);
  const [changeBg, setChangeBg] = useState({
    modal: false,
    selectBg: false,
    image: "",
  });
  const [betStatus, setBetStatus] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isHistoryModal, setIsHistoryModal] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultData, setgameResultData] = useState([]);
  const [betAmount, setBetAmount] = useState(1);
  const navigate = useNavigate();
  const [betApiHitted, setBetApiHitted] = useState({
    cancel1: false,
    cancel2: false,
    bet1: false,
    bet2: false,
    cashout1: false,
    cashout2: false,
  });

  useEffect(() => {
    gameHistory();
    gameBetHistory();
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q);
      // console.log("wqqqqqqqqqqqqqqq", q);
      const status = q?.status;
      if (status === 1) {
        setGameStatus(1);
        setShowBlast(false);
        setShowBetModal(false);
      } else if (status === 2) {
        setGameStatus(2);
        setShowBlast(true);
        setShowBetModal(false);
      } else if (status === 0) {
        setGameStatus(0);
        setShowBlast(false);
        setShowBetModal(true);
        setBetDuration(q.betTime || 0);
      }
      if (q?.status === 0 && q?.betTime === 9) {
        gameHistory();
      }
    };
    HotAirBallonSocket.on("demo_hotair", handleSocket);
    return () => HotAirBallonSocket.off("demo_hotair", handleSocket);
  }, []);

  const placeBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const sr =
      timeLeft?.betTime < 10 && timeLeft?.status === 0
        ? timeLeft?.period
        : Number(timeLeft?.period) + 1;
    const payload = {
      uid: userId,
      game_id: 23,
      number: 1,
      amount: betAmount,
      game_sr_num: sr,
    };
    // console.log("object bethandler", payload);
    try {
      const response = await axios.post(apis?.hotAirBalloon_bet, payload);
      // console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        // setProfileRefresher(true);
        localStorage.setItem("hotAirBalloon_bet_status", "1");
        localStorage.setItem("hotAirBalloon_sr", sr);
        localStorage.setItem("hotAirBalloon_bet_amount", betAmount);
        setBetApiHitted({ bet1: true });
        setBetApiHitted({ cancel1: false });
        setBetStatus(true);
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      // console.log("error bet", err);
      if (err?.response?.data?.status === 500) {
        console.log("error bet", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  // cancel and cashout
  const cancelNormalBetHandler = async () => {
    const sr = localStorage.getItem("hotAirBalloon_sr");

    const payload = {
      userid: userId,
      gamesno: sr,
    };
    // console.log("cancel pYLOAD", payload);
    try {
      const res = await axios.post(
        `${apis?.hotAirBalloon_bet_cancel}`,
        payload
      );
      // console.log("cvancelcancelcanel", res);
      if (res?.data?.success === true || res?.data?.status === 200) {
        localStorage.setItem("hotAirBalloon_bet_status", "0");
        localStorage.setItem("hotAirBalloon_sr", "0");
        localStorage.setItem("hotAirBalloon_bet_amount", "0");
        setBetApiHitted({ cancel1: true });
        setBetStatus(false);
        toast.success(res?.data?.message);
      } else {
        toast.warn(res?.data?.message);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        toast.error("Server problem");
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const cashoutNormalBetHandler = async () => {
    const sr = localStorage.getItem("hotAirBalloon_sr");
    const betAmount = localStorage.getItem("hotAirBalloon_bet_amount");
    const saltParams = {
      uid: userId,
      multiplier: timeLeft?.timer,
      game_sr_num: sr,
      number: 1,
      totalamount: betAmount,
    };
    const salt = btoa(JSON.stringify(saltParams));
    // console.log("saltEncodedsaltEncoded",saltParams, salt);
    try {
      const res = await axios.post(`${apis?.hotAirBalloon_cashout}`, { salt });
      // console.log("cashout", res);
      if (res?.data?.status === 200) {
        setBetApiHitted({ cashout1: true });
        localStorage.setItem("hotAirBalloon_bet_status", "0");
        localStorage.setItem("hotAirBalloon_sr", "0");
        localStorage.setItem("hotAirBalloon_bet_amount", "0");
        setBetStatus(false);
        toast.success(res?.data?.message);
      } else {
        toast.warn(res?.data?.message);
      }
    } catch (err) {
      // console.log("eeeeeeeeeeeeee",err)
      if (err?.response?.data?.status === 500) {
        console.log("Server problem");
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const gameBetHistory = async () => {
    const payload = {
      uid: userId,
      game_id: 23,
      limit: 10,
      offset: 0,
    };
    try {
      const res = await axios.post(
        `${apis?.hotAirBalloon_bet_history}`,
        payload
      );
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
  const gameHistory = async () => {
    const payload = {
      uid: userId,
      game_id: 23,
      limit: 20,
      offset: 0,
    };
    try {
      const res = await axios.get(
        `${apis?.hotAirBalloon_last_five_result}`,
        payload
      );
      console.log("hisotry", res);
      if (res?.data?.status === 200 || res?.data?.status === "200") {
        setgameResultData(res?.data?.data);
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
    const status = localStorage.getItem("hotAirBalloon_bet_status");
    if (status === 1) {
      setBetStatus(true);
    }
    if (timeLeft?.status === 2) {
      const lastBetRound = localStorage.getItem("hotAirBalloon_sr");
      const currentRound = Number(timeLeft?.period);
      // console.log("lastBetRound and currentRound",betStatus,Number(lastBetRound),currentRound)
      if (lastBetRound != "0" && Number(lastBetRound) === currentRound) {
        localStorage.setItem("hotAirBalloon_bet_status", "0");
        localStorage.setItem("hotAirBalloon_sr", "0");
        setBetStatus(false);
      }
    }
  }, [timeLeft, betStatus]);

  useEffect(() => {
    const img = localStorage.getItem("hotAirBallonBg");
    if (img) {
      // console.log("bgimage",img)
      setChangeBg({ modal: false, selectBg: false, image: img });
    }
  }, [changeBg?.selectBg]);

  useEffect(() => {
    if (isHistoryModal) {
      gameBetHistory();
    }
  }, [isHistoryModal]);
  // console.log("gameResultDatagameResultData", timeLeft);
  return (
    <div
      className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
      style={{
        background: "linear-gradient(to bottom, #E0D093, #E3D397)",
      }}
    >
      {" "}
      <div className="w-full px-2">
        <HotAirBallonHeader
          betApiHitted={betApiHitted}
          changeBg={changeBg}
          setChangeBg={setChangeBg}
          isSoundOn={isSoundOn}
          setIsSoundOn={setIsSoundOn}
          setIsHistoryModal={setIsHistoryModal}
        />
        {/* Top Row */}
        <div className="flex justify-between mt-2">
          <div
            className="h-8 w-24 bg-[#9b9393] bg-opacity-60 rounded-lg text-center text-[10px] font-roboto"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            S.no:- <p className="font-bold">{Number(timeLeft?.period)}</p>
          </div>
        </div>

        {/* ballon History */}
        <div
          className="flex overflow-x-auto hide-scrollbar space-x-1 p-2 mt-2 items-center bg-[#9b9393] bg-opacity-60 rounded-lg text-center text-[14px] font-bold font-mono"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          {gameResultData?.length > 0 ? (
            gameResultData?.map((item, i) => {
              return (
                <p className="bg-gray rounded-full px-2 py0.5 text-center">
                  {item?.price}
                </p>
              );
            })
          ) : (
            <p className="text-center w-full text-white">no data</p>
          )}
        </div>

        {/* hot air ballon animation swction */}
        <div
          className="w-full mt-2 border-[2px] border-[#9b9393] rounded-md min-h-[400px]  relative overflow-hidden"
          style={{
            backgroundImage: `url(${
              changeBg?.image === "1" ? balloon_bg : bg
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {gameStatus === 1 && (
            <>
            <p className="absolute left-1/2 translate-x-[-50%] drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] font-extrabold z-50 mb-14 balloon-fly text-lg">{timeLeft?.timer}</p>
              <img
                className="w-28 h-28 absolute left-1/2 translate-x-[-50%] balloon-fly"
                src={balloon_gif}
                alt="balloon"
              />
            </>
          )}

          {showBlast && (
            <>
              <img
                className="w-48 h-48 absolute left-1/2 bottom-1/3 translate-x-[-50%]"
                src={blast}
                alt="blast"
              />
              <p className="absolute left-1/2 bottom-1/4 drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] font-extrabold translate-x-[-50%] text-redAviator text-4xl">
                {timeLeft?.timer}x
              </p>
            </>
          )}
          {showBetModal && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#E0D094] p-6 rounded-md shadow-lg text-white text-center w-60">
                <p className="text-lg font-bold mb-2">
                  Waiting for next round {betDuration} sec
                </p>
                <div className="w-full h-2 bg-gray rounded">
                  <div
                    className="h-full bg-green rounded transition-all duration-1000"
                    style={{ width: `${(betDuration / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <HotAirBallonFooter
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={placeBetHandler}
          cancelNormalBetHandler={cancelNormalBetHandler}
          cashoutNormalBetHandler={cashoutNormalBetHandler}
          timeLeft={timeLeft}
          betStatus={betStatus}
          setBetStatus={setBetStatus}
        />
      </div>
      {isHistoryModal && (
        <MyHistoryModal
          data={gameResultHistory}
          setIsHistoryModal={setIsHistoryModal}
        />
      )}
    </div>
  );
}

export default HotAirBallon;
