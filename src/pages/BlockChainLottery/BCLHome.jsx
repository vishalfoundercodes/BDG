import { useEffect, useRef, useState } from "react";
import BCLHeader from "./BCLHeader";
import { FaMinus, FaPlus } from "react-icons/fa";
import { TiArrowShuffle } from "react-icons/ti";
import { HiOutlineTicket } from "react-icons/hi2";
import ball1 from "../../assets/BCLAssets/ball1.svg";
import ball2 from "../../assets/BCLAssets/ball2.svg";
import ball3 from "../../assets/BCLAssets/ball3.svg";
import ball4 from "../../assets/BCLAssets/ball4.svg";
import ball5 from "../../assets/BCLAssets/ball5.svg";
import ball6 from "../../assets/BCLAssets/ball6.svg";
import ball7 from "../../assets/BCLAssets/ball7.svg";
import ball8 from "../../assets/BCLAssets/ball8.svg";
import ball9 from "../../assets/BCLAssets/ball9.svg";
import ball10 from "../../assets/BCLAssets/ball10.svg";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoChevronBack } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import grayWatch from "../../assets/BCLAssets/grayWatch.png";
import redWatch from "../../assets/BCLAssets/redWatch.png";
import BCLSocket from "./BCLSocket";
import ResultModal from "./ResultModal";
const balls = [
  ball1,
  ball2,
  ball3,
  ball4,
  ball5,
  ball6,
  ball7,
  ball8,
  ball9,
  ball10,
];
function BCLHome() {
  const generateRandomNumbers = () =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1);
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [activeTab, setActiveTab] = useState(27);
  const initialGameDataRef = useRef({
    27: { numbers: generateRandomNumbers(), tickets: [] },
    28: { numbers: generateRandomNumbers(), tickets: [] },
    29: { numbers: generateRandomNumbers(), tickets: [] },
  });
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] =
    useState(null);
  const [gameData, setGameData] = useState(initialGameDataRef.current);
  const [betAmount, setBetAmount] = useState(0.1);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  // const [numbers, setNumbers] = useState(
  //   Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
  // );
  const [multipleQuantity, setMultipleQuantity] = useState(10);
  // State for editing tickets
  const [editIndex, setEditIndex] = useState(null);
  const [editNumbers, setEditNumbers] = useState(
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
  );
  const [timeLeft, setTimeLeft] = useState(0);
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  useEffect(() => {
    const handleSocket = (hotair) => {
      // console.log("Socket Data:", JSON.parse(hotair));
      // console.log("hotairhotairhotairhotair",hotair)
      const q = JSON.parse(hotair);
      setTimeLeft(q);
    };
    BCLSocket.on(
      activeTab === 27
        ? `demo_lottery_27`
        : activeTab === 28
        ? "demo_lottery_28"
        : activeTab === 29
        ? "demo_lottery_29"
        : null,
      handleSocket
    );
    return () => BCLSocket.off(`demo_lottery_${activeTab}`, handleSocket);
  }, [activeTab]);
 
  // console.log("timeLefttimeLefttimeLeft",timeLeft)
  const getDrawInfo = () => {
    if (activeTab === 27)
      return {
        title: "Draw every hour",
        nextDraw:
          timeLeft?.nextDrawTime != null ? timeLeft.nextDrawTime : "--:--:--",
        timer:
          timeLeft?.timerBetTime != null
            ? formatTime(timeLeft.timerBetTime)
            : "--:--:--",
        sr_no:
          gameResultData?.length > 0 ? gameResultData[0]?.games_no + 1 : NaN,
        lastWinningNumber:
          gameResultData?.length > 0
            ? JSON.parse(gameResultData[0]?.number)
            : [],
      };
    if (activeTab === 28)
      return {
        title: "Draw every 3 hours",
        nextDraw:
          timeLeft?.nextDrawTime != null ? timeLeft.nextDrawTime : "--:--:--",
        timer:
          timeLeft?.timerBetTime != null
            ? formatTime(timeLeft.timerBetTime)
            : "--:--:--",
        sr_no:
          gameResultData?.length > 0 ? gameResultData[0]?.games_no + 1 : NaN,
        lastWinningNumber:
          gameResultData?.length > 0
            ? JSON.parse(gameResultData[0]?.number)
            : [],
      };
    if (activeTab === 29)
      return {
        title: `Draw once a day at ${timeLeft?.nextDrawTime != null ? timeLeft.nextDrawTime?.slice(10) : "10:59:00"}`,
        nextDraw:
          timeLeft?.nextDrawTime != null ? timeLeft.nextDrawTime : "--:--:--",
        timer:
          timeLeft?.timerBetTime != null
            ? formatTime(timeLeft.timerBetTime)
            : "--:--:--",
        sr_no:
          gameResultData?.length > 0 ? gameResultData[0]?.games_no + 1 : NaN,
        lastWinningNumber:
          gameResultData?.length > 0
            ? JSON.parse(gameResultData[0]?.number)
            : [],
      };
    return { title: "", nextDraw: "" };
  };
  let drawInfo;
// console.log("gameResultData",gameResultData)
  const increaseNumber = (index) => {
    setGameData((prev) => {
      const updated = [...prev[activeTab].numbers];
      updated[index] = (updated[index] + 1) % 10;
      return {
        ...prev,
        [activeTab]: { ...prev[activeTab], numbers: updated },
      };
    });
  };

  const decreaseNumber = (index) => {
    setGameData((prev) => {
      const updated = [...prev[activeTab].numbers];
      updated[index] = (updated[index] - 1 + 10) % 10;
      return {
        ...prev,
        [activeTab]: { ...prev[activeTab], numbers: updated },
      };
    });
  };

  const handleLuckyDip = () => {
    const randomNumbers = generateRandomNumbers();
    setGameData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], numbers: randomNumbers },
    }));
  };
  const handleAddTicket = () => {
    const qty = isMultiple ? Number(multipleQuantity) : 1;
    if (qty <= 0 || isNaN(qty)) return;
    if (isMultiple) {
      setGameData((prev) => {
        const currentNumbers = [...prev[activeTab].numbers];
        const newTickets = Array.from({ length: qty }, () =>
          generateRandomNumbers()
        );
        return {
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            tickets: [...prev[activeTab].tickets, ...newTickets],
            numbers: generateRandomNumbers(),
          },
        };
      });
    } else {
      setGameData((prev) => {
        const currentNumbers = [...prev[activeTab].numbers];
        const newTickets = Array.from({ length: qty }, () => [
          ...currentNumbers,
        ]);

        return {
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            tickets: [...prev[activeTab].tickets, ...newTickets],
            numbers: generateRandomNumbers(),
          },
        };
      });
    }
  };
  // console.log("gameData", gameData);
  // Edit handlers
  const startEditing = (index) => {
    setEditIndex(index);
    setEditNumbers(gameData[activeTab].tickets[index]);
  };
  const saveEditing = () => {
    setGameData((prev) => {
      const updatedTickets = [...prev[activeTab].tickets];
      updatedTickets[editIndex] = [...editNumbers];

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          tickets: updatedTickets,
        },
      };
    });
    setEditIndex(null);
  };
  const cancelEditing = () => {
    setEditIndex(null);
  };
  const handlePreviousTicket = () => {
    if (editIndex > 0) {
      const newIndex = editIndex - 1;
      setEditIndex(newIndex);
      setEditNumbers([...gameData[activeTab].tickets[newIndex]]);
    }
  };
  const handleNextTicket = () => {
    if (editIndex < gameData[activeTab].tickets.length - 1) {
      const newIndex = editIndex + 1;
      setEditIndex(newIndex);
      setEditNumbers([...gameData[activeTab].tickets[newIndex]]);
    }
  };
  // apis
  const betHandler = async () => {
    const payload = {
      userid: userId,
      game_id: activeTab,
      selected_numbers: JSON.stringify(gameData[activeTab].tickets),
    };
    try {
      // console.log("payload", payload);
      const response = await axios.post(`${apis?.gameon_lottery_bet}`, payload);
      // console.log("response", response);
      if (response?.data?.status === 200) {
        gameBetHistory()
        setProfileRefresher(true);
        localStorage.setItem(`bcl_lottery_${activeTab}`, "true");
        toast.success(response?.data?.message);
      } else {
        toast.warn(response?.data?.message);
      }
    } catch (err) {
      // console.log("err", err);
      if (err?.response?.data?.status === 500) {
        console.log("err0", err);
        toast.error("Something went wrong");
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const gameResult = async () => {
    const payload = {
      game_id: activeTab,
      limit: 10,
      user_id: userId,
    };
    console.log("payload",payload)
    try {
      const res = await axios.post(`${apis?.gameon_lottery_result}`, payload);
      console.log("game res", res);
      if (
        res?.data?.status === true ||
        res?.data?.status === 200 ||
        res?.data?.status === "200"
      ) {
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
    const payload = {
      userid: Number(userId),
      game_id: activeTab,
      games_no: drawInfo.sr_no,
    };
    // console.log("gameResultAnnouncement pYLOASD", payload);
    try {
      const response = await axios.post(
        `${apis?.gameon_lottery_win_amount}`,
        payload
      );
      // console.log("announcement responsere", response);
      if (
        response?.data?.status === true ||
        response?.data?.status === 200 ||
        response?.data?.status === "200"
      ) {
        setGameResultDataAnnouncemnt(response);
        setIsResultModal(true);
      } else {
        console.log("40000", response);
      }
    } catch (err) {
      // console.log("server announcement erro ", err);
      if (err?.response?.data?.status === 500) {
        console.log("server erro ", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };

  const gameBetHistory = async () => {
    const payload = {
      user_id: userId,
      game_id: activeTab,
     limit:10
    };
    try {
      const res = await axios.post(
        `${apis?.gameon_lottery_result_history}`,
        payload
      );
      // console.log("hisotry hhhhhhhhhhhhhhhhhhhh", res);
      if (
        res?.data?.success === true ||
        res?.data?.status === 200 ||
        res?.data?.status === "200"
      ) {
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
    drawInfo = getDrawInfo()

  useEffect(() => {
    gameResult();
    gameBetHistory();
  }, [activeTab]);
  useEffect(() => {
    if (timeLeft?.timerBetTime === 27) {
      gameResult();
    }
    if (timeLeft?.timerBetTime ===25) {
      const betStatus = localStorage.getItem(`bcl_lottery_${activeTab}`);
      if (betStatus === "true") {
        gameResultAnnouncement();
        gameBetHistory();
        localStorage.setItem(`bcl_lottery_${activeTab}`, "false");
      }
    }
    if (timeLeft?.timerBetTime === 1) {
      setIsResultModal(false);
    }
  }, [timeLeft]);
  // console.log("ticketstickets", timeLeft?.timerBetTime);
  return (
    <div
      className="h-full w-full overflow-y-scroll  flex flex-col items-center hide-scrollbar"
      style={{ background: "#0D1B2A" }}
    >
      <div className="w-full">
        <BCLHeader
        balls={balls}
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
          timer={
            timeLeft?.timerBetTime != null
              ? formatTime(timeLeft.timerBetTime)
              : "--:--:--"
          }
        />
        {/* <div
          className="mt-3 font-sans font-extrabold text-xl text-white flex items-center justify-center"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          TOTAL JACKPOT
        </div> */}

        {/* <div className="mt-2 flex items-center justify-center ">
          <div className="h-[60px] w-[247px] rounded-3xl border-[2px] border-white flex items-center justify-center shadow-lg">
            <div className="h-[52px] w-60 rounded-3xl bg-gradient-to-r from-yellow to-orange-500 text-black text-xl font-extrabold flex items-center justify-center shadow-lg">
              GUC 1,00,000
            </div>
          </div>
        </div> */}
        <div className="flex items-center justify-center px-3">
          <div className="bg-[#0D3A63] text-[10.8px] grid grid-cols-3 w-full rounded-xl mt-2">
            {[
              {
                label: "Gameon Lottery",
                time: "1 Hr",
                duration: 30,
                gameid: 27,
              },
              {
                label: "Gameon Lottery",
                time: "3 Hr",
                duration: 60,
                gameid: 28,
              },
              {
                label: "Gameon Lottery",
                time: "24 Hr",
                duration: 180,
                gameid: 29,
              },
            ].map((item) => (
              <div
                key={item.time}
                className={`flex flex-col col-span-1 rounded-xl items-center px-2 py-1 cursor-pointer ${
                  activeTab === item.gameid
                    ? "bg-gradient-to-b from-customlightbtn to-customdarkBluebtn"
                    : ""
                }`}
                onClick={() => setActiveTab(item?.gameid)}
              >
                <div>
                  <img
                    src={activeTab === item.gameid ? redWatch : grayWatch}
                    className="h-9 w-9"
                    alt="timer"
                  />
                </div>
                <p
                  className={`text-nowrap font-normal ${
                    activeTab === item.gameid ? "" : "text-white opacity-60"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-normal  ${
                    activeTab === item.gameid ? "" : "text-white opacity-60"
                  }`}
                >
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {[27, 28, 29].includes(activeTab) && (
          <>
            <div className="flex mt-2 items-center xs1:px-2 gap-1">
              <div className=" flex items-center justify-center ">
                <div className="h-10 w-72 bg-[#0D3A63] items-center justify-center text-white text-[8px] pt-2 rounded-lg">
                  <div className="flex items-center justify-center text-white text-[8px]">
                    {drawInfo.title}
                  </div>
                  <div className="flex items-center justify-center text-white text-[12px] font-extrabold gap-2">
                    NEXT DRAW ON
                    <div className="text-orange-500 text-[12px] font-bold">
                      {drawInfo.nextDraw}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xsm h-10 w-full rounded-lg bg-[#0D3A63]  justify-center">
                {drawInfo.timer}
              </div>
            </div>

            {/* Toggle Button */}
            <div className="mt-2 flex items-center justify-center">
              <div className="flex overflow-hidden w-72 bg-[#0D3A63] rounded-full">
                <button
                  className={`w-1/2 py-2 text-[14px] font-bold transition-all duration-300 rounded-l-full ${
                    !isMultiple
                      ? "bg-[#AAFCB8] text-[#0D3A63]"
                      : "text-[#AAFCB8] bg-transparent"
                  }`}
                  onClick={() => setIsMultiple(false)}
                >
                  Single Ticket
                </button>
                <button
                  className={`w-1/2 py-2 text-[14px] font-bold transition-all duration-300 rounded-r-full ${
                    isMultiple
                      ? "bg-[#AAFCB8] text-[#0E50B3]"
                      : "text-[#AAFCB8] bg-transparent"
                  }`}
                  onClick={() => setIsMultiple(true)}
                >
                  Multiple Ticket
                </button>
              </div>
            </div>

            {!isMultiple ? (
              <div>
                {/* Number Selectors */}
                <div className="mt-4 flex justify-center gap-3">
                  {gameData[activeTab]?.numbers?.map((num, index) => {
                    // console.log("numbersss",num)
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center rounded-lg"
                        style={{
                          background:
                            "linear-gradient(to top, #9FE0FE, #9FE0FE, #D6F2FE, #F0FAFE)",
                        }}
                      >
                        <button
                          className="text-[#0E50B3] font-bold p-1"
                          onClick={() => increaseNumber(index)}
                        >
                          <FaPlus />
                        </button>
                        <div className="w-12 h-10 flex items-center justify-center text-black text-xl font-bold shadow-inner">
                          {num}
                        </div>
                        <button
                          className="text-[#0E50B3] font-bold p-1"
                          onClick={() => decreaseNumber(index)}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Lucky Dip & Add Ticket */}
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="h-10 w-32 border-2 border-[#AAFCB8] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                    onClick={handleLuckyDip}
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#AAFCB8] text-[20px] text-black">
                      <TiArrowShuffle />
                    </div>
                    <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]">
                      Lucky Dip
                    </div>
                  </div>

                  <div
                    className="h-10 w-32 border-2 border-[#2C69D0] bg-[#2C69D0] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                    onClick={handleAddTicket}
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#2654B4] text-[20px] text-[#AAFCB8]">
                      <HiOutlineTicket />
                    </div>
                    <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]">
                      Add ticket
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="m-6 text-[12px] font-mono font-bold">
                  Quantity of tickets
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-14 w-80 rounded-xl border border-[#AAFCB8] flex items-center justify-center px-4">
                    <input
                      type="text"
                      value={multipleQuantity}
                      onChange={(e) => {
                        // setMultipleQuantity(e.target.value)
                          const val = e.target.value;

                      if (/^\d*$/.test(val)) {
                        const num = Number(val);
                        // const wallet = Number(myDetails?.data?.wallet || 0);
                        // if (val === "" || num <= wallet) {
                          // setBetAmount(val)

                          // if(multipleQuantity <= 0){
                          //   toast.error("select valid number");
                          //   console.log("valid number inter");
                          // }

                        // }
                        setMultipleQuantity(num);
                      }}





                      }
                      className="w-full h-full bg-transparent text-[#AAFCB8] text-center text-3xl font-roboto font-bold outline-none placeholder-[#AAFCB8]"
                      min={1}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div
                    className="h-10 w-40 border-2 border-[#2C69D0] bg-[#2C69D0] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                    onClick={handleAddTicket}
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#2654B4] text-[20px] text-[#AAFCB8]">
                      <HiOutlineTicket />
                    </div>
                    <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]" onClick={() => (
multipleQuantity > 0 
    ? console.log("valid quantity") 
    : toast.error("valid number Enter")
)}>
                              Add {multipleQuantity} ticket
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket List */}
            <div className="mt-6 mx-6 h-56 rounded-2xl border border-[#1f4fa4] overflow-hidden">
              <div
                className="text-white text-lg font-bold  h-14 rounded-t-2xl flex items-center justify-between px-4 shadow-lg"
                style={{
                  background: "linear-gradient(145deg, #3c75da, #1f4fa4)",
                }}
              >
                <div className="flex flex-col justify-center">
                  <div className="text-gray-300 text-sm font-bold">
                    Draw #{drawInfo.sr_no}
                  </div>
                  <div className="text-gray-300 text-xs font-bold">
                    {drawInfo.nextDraw}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-gray-300 text-xs font-bold">
                    Last winning number
                  </div>
                  <div className="flex gap-1 mt-1">
                    {drawInfo.lastWinningNumber?.length > 0 ? (
                      drawInfo.lastWinningNumber?.map((ball, index) => {
                        // console.log(ball);
                        return (
                          <div key={index} className="relative h-4 w-4">
                            <img
                              src={balls[Number(ball)]}
                              alt="d"
                              className="h-full w-full object-contain"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                              {Number(ball)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-white">no result</div>
                    )}
                  </div>
                </div>
              </div>
              {gameData[activeTab]?.tickets?.length > 0 ? (
                <div className="flex items-center justify-between  m-2">
                  <div className="text-slate-100 text-[12px] p-2">
                    {gameData[activeTab]?.tickets?.length} ticket
                  </div>
                  <button
                    className="font-mono text-[12px] text-[#AAFCB8] cursor-pointer"
                    onClick={() =>
                      setGameData((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab],
                          tickets: [],
                        },
                      }))
                    }
                  >
                    clear
                  </button>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center -mt-10">
                  <p>
                    {" "}
                    <HiOutlineTicket
                      size={40}
                      className="text-redAviator "
                    />{" "}
                  </p>
                  <p>No ticket found , please add ticket</p>
                </div>
              )}

              {/* 👇 Scrollable ticket list only */}
              <div className=" max-h-32 overflow-y-auto hide-scrollbar pr-1 flex flex-col items-center ">
                {gameData[activeTab]?.tickets?.map((ticket, index) => (
                  <div
                    key={index}
                    className="mb-3 flex gap-2 flex-wrap rounded-lg p-3 w-80 items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #3c75da, #1f4fa4)",
                    }}
                  >
                    <span className="text-white text-xs font-roboto font-extrabold mr-2">
                      #{index + 1}
                    </span>
                    {ticket.map((num, idx) => (
                      <div key={idx} className="relative h-6 w-6">
                        <img
                          src={
                            num === 0
                              ? ball1
                              : num === 1
                              ? ball2
                              : num === 2
                              ? ball3
                              : num === 3
                              ? ball4
                              : num === 4
                              ? ball5
                              : num === 5
                              ? ball6
                              : num === 6
                              ? ball7
                              : num === 7
                              ? ball8
                              : num === 8
                              ? ball9
                              : ball10
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                          {num}
                        </div>
                      </div>
                    ))}
                    <div className=" flex justify-center gap-1">
                      <button
                        className="group h-5 w-5 rounded-full text-[12px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                        onClick={() => startEditing(index)}
                      >
                        {" "}
                        <MdOutlineModeEdit className="text-white group-hover:text-black" />
                      </button>

                      <button
                        className="group h-5 w-5 rounded-full text-[12px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                        onClick={() => {
                          setGameData((prev) => {
                            const updatedTickets = prev[
                              activeTab
                            ].tickets.filter((_, i) => i !== index);
                            return {
                              ...prev,
                              [activeTab]: {
                                ...prev[activeTab],
                                tickets: updatedTickets,
                              },
                            };
                          });
                        }}
                      >
                        <RxCross2 className="text-white group-hover:text-black" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Modal/UI */}
              {editIndex !== null && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
                  onClick={cancelEditing}
                >
                  <div
                    className="bg-[#0D1B2A] rounded-2xl  flex flex-col items-center gap-4 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="text-white font-bold">
                        Edit Ticket #{editIndex + 1}
                      </div>

                      <button
                        className="group h-8 w-8 rounded-full text-[15px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                        onClick={cancelEditing}
                      >
                        <RxCross2 className="text-white group-hover:text-black" />
                      </button>
                    </div>

                    <div className="h-[1px] w-full bg-gray"></div>

                    <div className="flex gap-5">
                      {editNumbers.map((num, i) => (
                        <div key={i} className="relative h-10 w-10">
                          <img
                            src={
                              num === 0
                                ? ball1
                                : num === 1
                                ? ball2
                                : num === 2
                                ? ball3
                                : num === 3
                                ? ball4
                                : num === 4
                                ? ball5
                                : num === 5
                                ? ball6
                                : num === 6
                                ? ball7
                                : num === 7
                                ? ball8
                                : num === 8
                                ? ball9
                                : ball10
                            }
                            alt=""
                            className="h-full w-full object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                            {num}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {editNumbers.map((num, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center rounded-lg"
                          style={{
                            background:
                              "linear-gradient(to top, #9FE0FE, #9FE0FE, #D6F2FE, #F0FAFE)",
                          }}
                        >
                          <button
                            className="text-[#0E50B3] font-bold p-1"
                            onClick={() =>
                              setEditNumbers((prev) => {
                                const copy = [...prev];
                                copy[i] = (copy[i] + 1) % 10;
                                return copy;
                              })
                            }
                          >
                            <FaPlus />
                          </button>
                          <div className="w-12 h-10 flex items-center justify-center text-black text-xl font-bold shadow-inner">
                            {editNumbers[i]}
                          </div>
                          <button
                            className="text-[#0E50B3] font-bold p-1"
                            onClick={() =>
                              setEditNumbers((prev) => {
                                const copy = [...prev];
                                copy[i] = (copy[i] - 1 + 10) % 10;
                                return copy;
                              })
                            }
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-4">
                      <button
                        className=" text-white font-normal px-4 py-2 rounded-full text-[10px] flex items-center gap-2"
                        onClick={handlePreviousTicket}
                        disabled={editIndex === 0}
                      >
                        <IoChevronBack /> Privious ticket
                      </button>
                      <button
                        className=" text-white font-normal text-[10px] px-4 py-2 rounded-full"
                        onClick={saveEditing}
                        style={{
                          background:
                            "linear-gradient(145deg, #3c75da, #1f4fa4)",
                        }}
                      >
                        Save changes
                      </button>
                      <button
                        className=" text-white font-normal px-4 py-2 rounded-full text-[10px] flex items-center gap-2"
                        onClick={handleNextTicket}
                        disabled={
                          editIndex === gameData[activeTab]?.tickets.length - 1
                        }
                      >
                        Next ticket <IoIosArrowForward />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="w-full mt-10 px-2 flex items-center justify-between ">
        <button
          onClick={() => betHandler()}
          className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9 w-full font-serif font-bold text-[14px] m-2 rounded-2xl flex items-center justify-center"
        >
          BET
        </button>
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

export default BCLHome;
