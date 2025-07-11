import React, { useEffect, useState } from "react";
import t_chance_bg from "../../assets/TripelChance/t_chance_bg.png";
import t_c_result_bg from "../../assets/TripelChance/t_c_result_bg.png";
import double_slide_bg from "../../assets/TripelChance/double_slide_bg.png";
import s_h_btn_bg from "../../assets/TripelChance/s_h_btn_bg.png";
import s_btn_bg from "../../assets/TripelChance/s_btn_bg.png";
import triple_grid_bg from "../../assets/TripelChance/triple_grid_bg.png";
import circle_bg from "../../assets/TripelChance/circle_bg.png";
import first_wheel from "../../assets/TripelChance/first_wheel.png";
import second_wheel from "../../assets/TripelChance/second_wheel.png";
import third_wheel from "../../assets/TripelChance/third_wheel.png";
import t_center_circle from "../../assets/TripelChance/t_center_circle.png";
import triple_text from "../../assets/TripelChance/triple_text.png";
import select_bg from "../../assets/TripelChance/select_bg.png";
import balance_bg from "../../assets/TripelChance/balance_bg.png";
import t_slide_bg_newH from "../../assets/TripelChance/t_slide_bg_newH.png";
import g_btn_bg from "../../assets/TripelChance/g_btn_bg.png";
import bet_bg from "../../assets/TripelChance/bet_bg.png";
import TripleChanceHeader from "./TripleChanceHeader";
import { IoTriangle } from "react-icons/io5";
import TripleChanceSocket from "./TripleChanceSocket";
import { toast } from "react-toastify";
import TripleChanceFooter from "./TripleChanceFooter";
import apis from "../../utils/apis";
import axios from "axios";

function TripleChancehome() {
  const userId = localStorage.getItem("userId");
  // console.log("userId",userId)
  const [selectedStart, setSelectedStart] = useState(1);
  const [activeModal, setActiveModal] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    timerBetTime: 0,
    timerStatus: 0,
  });
  const [betAmount, setBetAmount] = useState("");
  const [singleSelected, setSingleSelected] = useState([]);
  const [doubleSelected, setDoubleSelected] = useState([]);
  const [tripleSelected, setTripleSelected] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] =
    useState(null);
  const [lastWinAMount, setLastWinAMount] = useState(null);
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [gameResultDataWheel, setGameResultDataWheel] = useState(null);
  const [gameResultData, setGameResultData] = useState([]);
  const [resultAngles, setResultAngles] = useState({
    wheel1: null,
    wheel2: null,
    wheel3: null,
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotations, setRotations] = useState({
    wheel1: 0,
    wheel2: 0,
    wheel3: 0,
  });
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      // console.log("Socket Data:", q);
      setTimeLeft(q);
    };
    TripleChanceSocket.on("demo_triple", handleSocket);
    return () => TripleChanceSocket.off("demo_triple", handleSocket);
  }, []);
  const toggleModal = (name) => {
    setActiveModal((prev) => (prev === name ? null : name));
  };

  const doublelist = [5, 10, 15, 20, 25, 50, 75];

  // box selection
  // single
  const singleBetTotalAmount = singleSelected.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const handleSingleClick = (index) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }
    setSingleSelected((prev) => {
      if (prev.some((item) => item.game_id === index.toString())) {
        return prev.filter((item) => item.game_id !== index.toString());
      } else {
        return [
          ...prev,
          {
            game_id: index.toString(),
            amount: Number(betAmount),
            wheel_no: "1",
          },
        ];
      }
    });
  };

  // double
  const handleDoubleClick = (index) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const padded = index.toString().padStart(2, "0");

    setDoubleSelected((prev) => {
      if (prev.some((item) => item.game_id === padded)) {
        return prev.filter((item) => item.game_id !== padded);
      } else {
        return [
          ...prev,
          {
            game_id: padded,
            amount: Number(betAmount),
            wheel_no: "2",
          },
        ];
      }
    });
  };

  const handleDoubleRowClick = (rowIndex) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const newValues = Array.from({ length: 10 }, (_, i) => ({
      game_id: (rowIndex * 10 + i).toString().padStart(2, "0"),
      amount: Number(betAmount),
      wheel_no: "2",
    }));

    setDoubleSelected((prev) => {
      // Toggle row - remove if all exist, add if any missing
      const allExist = newValues.every((newVal) =>
        prev.some((item) => item.game_id === newVal.game_id)
      );

      return allExist
        ? prev.filter(
            (item) =>
              !newValues.some((newVal) => newVal.game_id === item.game_id)
          )
        : [
            ...prev,
            ...newValues.filter(
              (newVal) => !prev.some((item) => item.game_id === newVal.game_id)
            ),
          ];
    });
  };

  const handleDoubleColClick = (colIndex) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const newValues = Array.from({ length: 10 }, (_, i) => ({
      game_id: (i * 10 + colIndex).toString().padStart(2, "0"),
      amount: Number(betAmount),
      wheel_no: "2",
    }));

    setDoubleSelected((prev) => {
      // Toggle column
      const allExist = newValues.every((newVal) =>
        prev.some((item) => item.game_id === newVal.game_id)
      );

      return allExist
        ? prev.filter(
            (item) =>
              !newValues.some((newVal) => newVal.game_id === item.game_id)
          )
        : [
            ...prev,
            ...newValues.filter(
              (newVal) => !prev.some((item) => item.game_id === newVal.game_id)
            ),
          ];
    });
  };

  const handleDoubleRandom = (num) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    setDoubleSelected((prev) => {
      const randomIndexes = [...prev];
      const currentSize = prev.length;

      while (randomIndexes.length < currentSize + num) {
        const r = Math.floor(Math.random() * 100)
          .toString()
          .padStart(2, "0");

        if (!randomIndexes.some((item) => item.game_id === r)) {
          randomIndexes.push({
            game_id: r,
            amount: Number(betAmount),
            wheel_no: "2",
          });
        }
      }

      return randomIndexes;
    });
  };

  // Calculate total double bet amount
  const doubleBetTotalAmount = doubleSelected.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // triple
  const handleTripleClick = (index) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const padded = (selectedStart + index).toString().padStart(3, "0");

    setTripleSelected((prev) => {
      if (prev.some((item) => item.game_id === padded)) {
        return prev.filter((item) => item.game_id !== padded);
      } else {
        return [
          ...prev,
          {
            game_id: padded,
            amount: Number(betAmount),
            wheel_no: "3",
          },
        ];
      }
    });
  };

  const handleTripleRowClick = (rowIndex) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const newValues = Array.from({ length: 10 }, (_, i) => ({
      game_id: (selectedStart + rowIndex * 10 + i).toString().padStart(3, "0"),
      amount: Number(betAmount),
      wheel_no: "3",
    }));

    setTripleSelected((prev) => {
      // Toggle row - remove if all exist, add if any missing
      const allExist = newValues.every((newVal) =>
        prev.some((item) => item.game_id === newVal.game_id)
      );

      return allExist
        ? prev.filter(
            (item) =>
              !newValues.some((newVal) => newVal.game_id === item.game_id)
          )
        : [
            ...prev,
            ...newValues.filter(
              (newVal) => !prev.some((item) => item.game_id === newVal.game_id)
            ),
          ];
    });
  };

  const handleTripleColClick = (colIndex) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    const newValues = Array.from({ length: 10 }, (_, i) => ({
      game_id: (selectedStart + i * 10 + colIndex).toString().padStart(3, "0"),
      amount: Number(betAmount),
      wheel_no: "3",
    }));

    setTripleSelected((prev) => {
      // Toggle column
      const allExist = newValues.every((newVal) =>
        prev.some((item) => item.game_id === newVal.game_id)
      );

      return allExist
        ? prev.filter(
            (item) =>
              !newValues.some((newVal) => newVal.game_id === item.game_id)
          )
        : [
            ...prev,
            ...newValues.filter(
              (newVal) => !prev.some((item) => item.game_id === newVal.game_id)
            ),
          ];
    });
  };

  const handleTripleRandom = (num) => {
    if (Number(betAmount) <= 0) {
      toast.warn("Please select amount");
      return;
    }

    setTripleSelected((prev) => {
      const randomIndexes = [...prev];
      const currentSize = prev.length;

      while (randomIndexes.length < currentSize + num) {
        const r = (selectedStart + Math.floor(Math.random() * 100))
          .toString()
          .padStart(3, "0");

        if (!randomIndexes.some((item) => item.game_id === r)) {
          randomIndexes.push({
            game_id: r,
            amount: Number(betAmount),
            wheel_no: "3",
          });
        }
      }

      return randomIndexes;
    });
  };
  // Calculate total bet amount
  const tripleBetTotalAmount = tripleSelected.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const grandBetTotal = (
    (singleBetTotalAmount > 0 ? Number(singleBetTotalAmount) : 0) +
    (tripleBetTotalAmount > 0 ? Number(tripleBetTotalAmount) : 0) +
    (doubleBetTotalAmount > 0 ? Number(doubleBetTotalAmount) : 0)
  ).toFixed(2);

  // apis
  useEffect(() => {
    gameResult();
    gameBetHistory();
    getLastAmountHnadler();
  }, []);
  // console.log("fgfgfgf", timeLeft);
  useEffect(() => {
    const betStatus = localStorage.getItem("tripleChance_bet");
    if (timeLeft?.timerBetTime === 9 && timeLeft?.timerStatus === 2) {
      gameResult();
      gameResultAnimation();
    }

    if (timeLeft?.timerBetTime === 5 && timeLeft?.timerStatus === 2) {
      if (betStatus === "true") {
        gameResultApiForAnnouncement();
        localStorage.setItem("tripleChance_bet", "false");
        gameBetHistory();
      }
    }
    if (timeLeft?.timerBetTime === 1 && timeLeft?.timerStatus === 2) {
      getLastAmountHnadler();
      setIsSpinning(false);
      setRotations({
        wheel1: 0,
        wheel2: 0,
        wheel3: 0,
      });
      setIsResultModal(false);
      // setNumberAmounts(Array(12).fill(0));
    }
  }, [timeLeft?.timerBetTime]);

  const placeBetHandler = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const bets = [...singleSelected, ...doubleSelected, ...tripleSelected];
    const payload = {
      user_id: userId,
      bets,
    };
    console.log("object", payload);
    try {
      const response = await axios.post(apis?.tripleChance_bet, payload);
      console.log("bet resoinse", response);
      if (response?.data?.status === 200) {
        setProfileRefresher(true);
        // localStorage.setItem("tripleChance_bet", "true");
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

  // period number and last some results
  const gameResult = async () => {
    // const payload = {
    //   game_id: 21,
    //   limit: 10,
    // };
    // console.log("payloadpayload",payload)
    try {
      const res = await axios.post(`${apis?.tripleChance_result}${userId}`);

      // console.log("game res actullasdsy", res);

      if (res?.data?.success === true) {
        setGameResultData(res?.data);
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

  const gameResultAnimation = async () => {
    try {
      const res = await axios.post(`${apis?.tripleChance_result}${userId}`);
      if (res?.data?.success === true) {
        const result = res?.data?.result_triple_chance[0];
        console.log("game res animations", result);
        wheelSpin(result);
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
    // const sr = gameResultData[0]?.games_no;
    try {
      const res = await axios.get(`${apis?.tripleChance_win_amount}${userId}`);
      // console.log("getLastAmountHnadler res", res);
      if (res?.data?.success === true) {
        setLastWinAMount(res?.data);
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
    try {
      const res = await axios.get(`${apis?.tripleChance_result}${userId}`);
      console.log("game gameResultApiForAnnouncement", res);
      if (res?.data?.status === true) {
        const a = res?.data?.data[0]?.games_no;
        gameResultAnnouncement(a);
      }
    } catch (err) {
      console.log("gameResultApiForlAnnouncement", err);
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

    console.log(
      "gameResultAnnouncement",
      `${apis?.tripleChance_win_amount}${userId}`
    );
    try {
      const response = await axios.get(
        `${apis?.tripleChance_win_amount}${userId}`
      );
      console.log("announcement responsere", response);
      if (response?.data?.status === 200) {
        setGameResultDataAnnouncemnt(response);
        setIsResultModal(true);
      }
    } catch (err) {
      console.log("server announcement erro ", err);
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
        `${apis?.tripleChance_result_history}${userId}&limit=10`
      );
      // console.log("hisotry", res);
      if (res?.data?.success === true) {
        setGameResultHistory(res?.data?.history_triplechance);
      }
    } catch (err) {
      // console.log("error hisotry", err);
      if (err?.response?.data?.status === 500) {
        console.log("error hisotry", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  // console.log("gameResultData", gameResultData);
  // wheel spin
  const wheelSpin = (number) => {
    if (isSpinning) return;
    const result1 = number?.wheel1_result;
    const result2 = number?.wheel2_result;
    const result3 = number?.wheel3_result;
    let finalWheel1Index;
    if (result1 === 0) {
      finalWheel1Index = 6;
    } else if (result1 === 1) {
      finalWheel1Index = 8;
    } else if (result1 === 2) {
      finalWheel1Index = 10;
    } else if (result1 === 3) {
      finalWheel1Index = 2;
    } else if (result1 === 4) {
      finalWheel1Index = 4;
    } else if (result1 === 5) {
      finalWheel1Index = 7;
    } else if (result1 === 6) {
      finalWheel1Index = 5;
    } else if (result1 === 7) {
      finalWheel1Index = 3;
    } else if (result1 === 8) {
      finalWheel1Index = 1;
    } else if (result1 === 9) {
      finalWheel1Index = 9;
    }
    let finalWheel2Index;
    if (result2 === 0) {
      finalWheel2Index = 4;
    } else if (result2 === 1) {
      finalWheel2Index = 2;
    } else if (result2 === 2) {
      finalWheel2Index = 10;
    } else if (result2 === 3) {
      finalWheel2Index = 8;
    } else if (result2 === 4) {
      finalWheel2Index = 6;
    } else if (result2 === 5) {
      finalWheel2Index = 3;
    } else if (result2 === 6) {
      finalWheel2Index = 5;
    } else if (result2 === 7) {
      finalWheel2Index = 7;
    } else if (result2 === 8) {
      finalWheel2Index = 9;
    } else if (result2 === 9) {
      finalWheel2Index = 1;
    }
    let finalWheel3Index;
    if (result3 === 0) {
      finalWheel3Index = 6;
    } else if (result3 === 1) {
      finalWheel3Index = 8;
    } else if (result3 === 2) {
      finalWheel3Index = 10;
    } else if (result3 === 3) {
      finalWheel3Index = 2;
    } else if (result3 === 4) {
      finalWheel3Index = 4;
    } else if (result3 === 5) {
      finalWheel3Index = 7;
    } else if (result3 === 6) {
      finalWheel3Index = 5;
    } else if (result3 === 7) {
      finalWheel3Index = 3;
    } else if (result3 === 8) {
      finalWheel3Index = 1;
    } else if (result3 === 9) {
      finalWheel3Index = 9;
    }
    setIsSpinning(true);
    // --- Calculate spin target based on result number (0-9) ---
    // const result1 = finalWheel1Index; // you can replace with your own result
    const segments = 10;
    const degreesPerSegment = 360 / segments;
    const finalAngle1 = finalWheel1Index * degreesPerSegment; // 2 segments per number
    const finalAngle2 = finalWheel2Index * degreesPerSegment; // 2 segments per number
    const finalAngle3 = finalWheel3Index * degreesPerSegment; // 2 segments per number

    const extraTurns = 5; // 5 to 7 full spins
    const totalRotation1 = extraTurns * 360 + finalAngle1;
    const totalRotation2 = -(extraTurns * 360 + finalAngle2);
    const totalRotation3 = extraTurns * 360 + finalAngle3;
    // console.log("totalRotation", totalRotation1, finalAngle1);
    setRotations({
      wheel1: totalRotation1,
      wheel2: totalRotation2,
      wheel3: totalRotation3,
    });
  };

  const handleClear = () => {
    // console.log(":handleClear");
    setSingleSelected([]);
    setDoubleSelected([]);
    setTripleSelected([]);
  };
  const handleRebet = () => {
    console.log(":rebet");
    placeBetHandler();
  };

  const handleDouble = () => {
    if (singleSelected.length === 0) {
      toast.warn("No bets to double");
      return;
    }
    console.log("Doubling bets...");
    setBetAmount((prev) => prev * 2);
    setSingleSelected((prev) =>
      prev.map((item) => ({
        ...item,
        amount: item.amount * 2,
      }))
    );
  };

  // console.log("rotations.wheel1", betAmount);

  return (
    <div
      className="h-full relative min-h-screen overflow-y-scroll hide-scrollbar bg-center"
      style={{
        backgroundImage: `url(${t_chance_bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <TripleChanceHeader
        profileRefresher={profileRefresher}
        gameResultHistory={gameResultHistory}
        setProfileRefresher={setProfileRefresher}
        timeLeft={timeLeft?.timerBetTime}
      />
      {/* Serial + Timer */}
      <div className="flex justify-between mx-4 my-2">
        <div
          className="relative h-8 w-36 text-[10px] font-roboto text-center text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={t_c_result_bg}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex items-center justify-center h-full px-2">
            S.no :-&nbsp;{" "}
            <p className="font-bold">
              {gameResultData?.result_triple_chance?.length > 0 &&
                Number(gameResultData?.result_triple_chance[0]?.games_no) + 1}
            </p>
          </div>
        </div>
        <div
          className="relative h-8 w-24 text-center text-[20px] font-bold font-mono text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={t_c_result_bg}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex items-center justify-center h-full px-2">
            {timeLeft?.timerBetTime}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col px-4 justify-center items-center absolute bg-black z-40">
        {/* WRAPPER to make wheel not shift */}
        <div className="w-full relative z-50">
          {/* SINGLE */}
          <div className="relative w-full z-10">
            <button
              onClick={() => toggleModal("single")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">SINGLE</p>
              <IoTriangle
                size={20}
                className={`${
                  activeModal === "single"
                    ? "text-yellow rotate-0"
                    : "text-green rotate-180"
                } ml-1 z-10`}
              />
              <p className="bg-[#741618] w-[60px] h-4.5 flex items-center justify-center rounded z-10">
                PLAY:{Number(singleBetTotalAmount).toFixed(2)}
              </p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">
                WIN:
                {Number(lastWinAMount?.total_win_amount) > 0
                  ? Number(lastWinAMount?.total_win_amount).toFixed(2)
                  : 0}
              </p>
            </button>

            {activeModal === "single" && (
              <div
                className="absolute top-full left-0 w-full z-50"
                style={{
                  backgroundImage: `url(${select_bg})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                }}
              >
                <div className="flex w-full items-center justify-between my-1 px-1">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const specialIndexes = [1, 2, 5, 6, 9];
                    const isSelected = singleSelected.some(
                      (item) => item.game_id === index.toString()
                    );
                    const selectedItem = isSelected
                      ? singleSelected.find(
                          (item) => item.game_id === index.toString()
                        )
                      : null;

                    return (
                      <div key={index} className="relative">
                        {isSelected && (
                          <>
                            <div className="absolute top-0.5 left-3 text-center text-[8px] font-bold text-black">
                              {selectedItem.game_id}
                            </div>
                            <div className="absolute top-3.5 left-1.5 text-center text-[8px] font-bold text-black">
                              {selectedItem.amount}
                            </div>
                          </>
                        )}
                        <div
                          onClick={(e) => handleSingleClick(index, e)}
                          className={`h-7 w-7 shadow-md flex items-center justify-center rounded text-black text-[11px] cursor-pointer ${
                            isSelected
                              ? `bg-[url(${bet_bg})] bg-cover bg-center`
                              : specialIndexes.includes(index)
                              ? "bg-[#ffa6ff]"
                              : "bg-[#52f395]"
                          }`}
                          style={
                            isSelected
                              ? {
                                  backgroundImage: `url(${bet_bg})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }
                              : {}
                          }
                        >
                          {!isSelected && index}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* DOUBLE */}
          <div
            className={`relative w-full z-10 ${
              activeModal === "single" ? "mt-[40px]" : ""
            }`}
          >
            <button
              onClick={() => toggleModal("double")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">DOUBLE</p>
              <IoTriangle
                size={20}
                className={`${
                  activeModal === "double"
                    ? "text-yellow rotate-0"
                    : "text-green rotate-180"
                }  z-10`}
              />
              <p className="bg-[#741618] w-[60px] h-4.5 flex items-center justify-center rounded z-10">
                PLAY:{Number(doubleBetTotalAmount).toFixed(2)}
              </p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">
                WIN:
                {Number(lastWinAMount?.second_wheel_amount) > 0
                  ? Number(lastWinAMount?.second_wheel_amount).toFixed(2)
                  : 0}
              </p>
            </button>
            {activeModal === "double" && (
              <div className="absolute top-full left-0 w-full z-50">
                <div className="relative h-72 w-full overflow-">
                  <img
                    src={double_slide_bg}
                    alt="Double Slide Background"
                    className="absolute inset-0 w-full h-full"
                  />

                  <div className="relative z-10 w-full flex justify-between items-center h-full p-2 gap-1">
                    <div className="flex flex-col space-y-1">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-5 w-4 rounded shadow-md mr-1"
                        >
                          <img
                            onClick={() => handleDoubleRowClick(index)}
                            src={s_h_btn_bg}
                            alt=""
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <div className="h-60 w-full shadow-md overflow-auto">
                        <div className="grid grid-cols-10 gap-1">
                          {Array.from({ length: 100 }).map((_, index) => {
                            const row = Math.floor(index / 10);
                            const col = index % 10;
                            const padded = index.toString().padStart(2, "0");
                            const isSelected = doubleSelected.some(
                              (item) => item.game_id === padded
                            );
                            const selectedItem = isSelected
                              ? doubleSelected.find(
                                  (item) => item.game_id === padded
                                )
                              : null;

                            return (
                              <div key={index} className="relative">
                                {isSelected && (
                                  <>
                                    <div className="absolute top- left-2 text-center text-[8px] font-bold text-black">
                                      {selectedItem.game_id}
                                    </div>
                                    <div className="absolute top-2.5 left-0 right-0 text-center text-[8px] font-bold text-black">
                                      {selectedItem.amount}
                                    </div>
                                  </>
                                )}
                                <div
                                  className={`w-6 h-5 flex items-center justify-center text-black text-[11px] cursor-pointer ${
                                    isSelected
                                      ? `bg-[url(${bet_bg})] bg-cover bg-center`
                                      : (row + col) % 2 === 0
                                      ? "bg-[#52f395]"
                                      : "bg-[#ffa6ff]"
                                  }`}
                                  style={
                                    isSelected
                                      ? {
                                          backgroundImage: `url(${bet_bg})`,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }
                                      : {}
                                  }
                                  onClick={() => handleDoubleClick(index)}
                                >
                                  {!isSelected && padded}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-10 gap-1">
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div
                            key={index}
                            className={`w-6 h-4 flex items-center justify-center text-white text-[11px]`}
                          >
                            <img
                              onClick={() => handleDoubleColClick(index)}
                              src={s_btn_bg}
                              alt=""
                              className="h-full w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-60 w-10 rounded shadow-md ml-1 mt-2">
                      <div className="flex flex-col space-y-1">
                        {doublelist.map((num, index) => (
                          <div
                            onClick={() => handleDoubleRandom(num)}
                            key={index}
                            className="h-[30px] w-8 bg-[#741618] rounded shadow-md mr-1 flex items-center justify-center font-mono font-bold text-[12px]"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TRIPLE */}
          <div
            className={`relative w-full z-10 ${
              activeModal === "double" ? "mt-[18em]" : ""
            }`}
          >
            <button
              onClick={() => toggleModal("triple")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">TRIPLE</p>
              <IoTriangle
                size={20}
                className={`${
                  activeModal === "triple"
                    ? "text-yellow rotate-0"
                    : "text-green rotate-180 ease-in"
                } ml-1.5 z-10`}
              />
              <p className="bg-[#741618] w-[60px] h-4.5 flex items-center justify-center rounded z-10">
                PLAY:{Number(tripleBetTotalAmount).toFixed(2)}
              </p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">
                WIN:
                {Number(lastWinAMount?.third_wheel_amount) > 0
                  ? Number(lastWinAMount?.third_wheel_amount).toFixed(2)
                  : 0}
              </p>
            </button>

            {activeModal === "triple" && (
              <div className="absolute top-full left-0 w-full z-50">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={triple_grid_bg}
                    alt="Triple Grid Background"
                    className="absolute inset-0 w-full h-full"
                  />

                  <div className="relative z-10 flex justify-between items-center h-full p-2 gap-1">
                    <div className="flex flex-col space-y-1">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="h-5 w-4 shadow-md mr-1">
                          <img
                            onClick={() => handleTripleRowClick(index)}
                            src={s_h_btn_bg}
                            alt=""
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-1">
                      <div className="grid grid-cols-10 gap-1 mb-1">
                        {Array.from({ length: 10 }).map((_, index) => {
                          const value = index * 100;
                          return (
                            <div
                              key={index}
                              className={`w-6 h-4 flex items-center justify-center font-mono text-[10px] cursor-pointer ${
                                selectedStart === value
                                  ? "bg-yellow text-black"
                                  : "bg-[#741618] text-white"
                              }`}
                              onClick={() => setSelectedStart(value)}
                            >
                              {value.toString().padStart(3, "0")}
                            </div>
                          );
                        })}
                      </div>

                      <div className="h-60 w-full shadow-md overflow-auto">
                        <div className="grid grid-cols-10 gap-1">
                          {Array.from({ length: 100 }).map((_, index) => {
                            const value = selectedStart + index;
                            const padded = value.toString().padStart(3, "0");
                            const row = Math.floor(index / 10);
                            const col = index % 10;
                            const isSelected = tripleSelected.some(
                              (item) => item.game_id === padded
                            );
                            const selectedItem = isSelected
                              ? tripleSelected.find(
                                  (item) => item.game_id === padded
                                )
                              : null;
                            const bgColor =
                              (row + col) % 2 === 0
                                ? "bg-[#52f395]"
                                : "bg-[#ffa6ff]";

                            return (
                              <div key={value} className="relative">
                                {isSelected && (
                                  <>
                                    <div className="absolute top-0 left-1 text-center text-[8px] font-bold text-black">
                                      {selectedItem.game_id}
                                    </div>
                                    <div className="absolute top-2.5 left-1 text-center text-[8px] font-bold text-black">
                                      {selectedItem.amount}
                                    </div>
                                  </>
                                )}
                                <div
                                  onClick={() => handleTripleClick(index)}
                                  className={`w-6 h-5 flex items-center justify-center text-black text-[11px] cursor-pointer ${
                                    isSelected
                                      ? `bg-[url(${bet_bg})] bg-cover bg-center`
                                      : bgColor
                                  }`}
                                  style={
                                    isSelected
                                      ? {
                                          backgroundImage: `url(${bet_bg})`,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }
                                      : {}
                                  }
                                >
                                  {!isSelected && padded}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-10 gap-1">
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div
                            key={index}
                            className="w-6 h-4 flex items-center justify-center text-white text-[11px]"
                          >
                            <img
                              onClick={() => handleTripleColClick(index)}
                              src={s_btn_bg}
                              alt=""
                              className="h-full w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-60 w-10 rounded shadow-md ml-1 mt-1">
                      <div className="flex flex-col space-y-1">
                        {doublelist.map((num, index) => (
                          <div
                            onClick={() => handleTripleRandom(num)}
                            key={index}
                            className="h-[30px] w-8 bg-[#741618] rounded shadow-md mr-1 flex items-center justify-center font-mono font-bold text-[12px]"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* chakra */}
      <div className="flex items-center justify-center mx-4 mt-24">
        <div className="h-80 w-80 rounded-full relative overflow-hidden">
          <div className="absolute inset-0  z-30 top-4 left-[9.4rem] w-5 h-5 bg-red rounded-full"></div>
          {/* Background Circle */}
          <img
            src={circle_bg}
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0"
          />

          {/* First Wheel */}
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 z-10">
            {isSpinning ? (
              <img
                style={{
                  transform: `rotate(${rotations.wheel1}deg)`,
                  // transition: "transform 5s linear ",
                  transition: "transform 5s ease-in-out 0.5s ",
                  transformOrigin: "center",
                }}
                src={first_wheel}
                alt="First Wheel (Front)"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={first_wheel}
                alt="First Wheel (Front)"
                className="w-full h-full object-contain"
              />
            )}
            {/* {resultAngles.wheel1 !== null && (
              <Dot angle={resultAngles.wheel1} size="12px" />
            )} */}
          </div>

          {/* Second Wheel */}
          <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 z-10">
            {isSpinning ? (
              <img
                style={{
                  transform: `rotate(${rotations.wheel2}deg)`,
                  // transition: "transform 5s linear",
                  transition: "transform 5s ease-in-out 0.5s",
                  transformOrigin: "center",
                }}
                src={second_wheel}
                alt="Second Wheel"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={second_wheel}
                alt="Second Wheel"
                className="w-full h-full object-contain"
              />
            )}
            {/* {resultAngles.wheel2 !== null && (
              <div className="z-50">
                <Dot angle={resultAngles.wheel2} size="12px" />
              </div>
            )} */}
          </div>

          {/* Third Wheel */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 z-10">
            {isSpinning ? (
              <img
                style={{
                  transform: `rotate(${rotations.wheel3}deg)`,
                  // transition: "transform 5s linear",
                  transition: "transform 5s ease-in-out 0.5s",
                  transformOrigin: "center",
                }}
                src={third_wheel}
                alt="Third Wheel"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={third_wheel}
                alt="Third Wheel"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Center and Text */}
          <div className="absolute top-1/2 left-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={t_center_circle}
              alt="Center"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-9 h-9 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={triple_text}
              alt="Triple"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      {/* 
      <button className="" onClick={gameResultAnimation}>
        Spin
      </button> */}
      <div className="flex items-center justify-between">
        <div className="">
          <div className="h-16 w-64 mx-2 relative z-10 ">
            {/* Background image */}
            <img
              src={balance_bg}
              alt=""
              className="h-full w-full absolute inset-0 z-0"
            />
            {/* Foreground content (two boxes) */}
            <div className="relative z-10 h-full w-full flex justify-between items-center px-1 ">
              <div className="h-14 w-[136px] rounded shadow-sm flex flex-col justify-center gap-1 ">
                <div className="h-6 w-full pl-1 text-sm font-mono ">
                  Play: {grandBetTotal}
                </div>
                <div className="h-6 w-full pl-1 text-sm font-mono text-green">
                  Win:
                  {Number(lastWinAMount?.total_win_amount) > 0
                    ? Number(lastWinAMount?.total_win_amount).toFixed(2)
                    : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="h-20 w-64 z-50 mx-2 relative">
            <div className="absolute w-full flex flex-col items-start justify-between py-1 px-2">
              <div className="flex items-center gap-1 w-full">
                {gameResultData?.result_triple_chance?.map((item, i) => {
                  return (
                    <p
                      key={i}
                      className="flex items-center justify-between w-full"
                    >
                      {item?.wheel1_result}
                    </p>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 w-full">
                {gameResultData?.result_triple_chance?.map((item, i) => {
                  return (
                    <p
                      key={i}
                      className="flex items-center justify-between w-full"
                    >
                      {item?.wheel2_result}
                    </p>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 w-full">
                {gameResultData?.result_triple_chance?.map((item, i) => {
                  return (
                    <p
                      key={i}
                      className="flex items-center justify-between w-full"
                    >
                      {item?.wheel3_result}
                    </p>
                  );
                })}
              </div>
            </div>
            {/* <div className="relative w-full z-50">
              <div className="-top-12 right-[1.1rem] w-[80px] h-[30px] absolute">
                <img src={g_btn_bg} alt="fg" />
                <p className="-mt-[26px] text-black ml-5 text-[14px]"> INFO</p>
              </div>
            </div> */}

            <div className="relative w-full z-50">
              <button
                disabled={
                  timeLeft?.timerBetTime <= 10 &&
                  timeLeft?.timerBetTime > 0 &&
                  timeLeft?.timerStatus === 2
                }
                onClick={() => handleRebet()}
                className="-top-10 xs1:-top-12 z-50 -right-[5.2rem] xs1:-right-[7rem] w-[60px] xs1:w-[80px] h-[30px] absolute"
              >
                <img className="z-50" src={g_btn_bg} alt="fg" />
                <p className="-mt-[20px] z-50 xs1:-mt-[26px] text-black ml-3 xs1:ml-4 text-[12px] xs1:text-[14px]">
                  {" "}
                  REBET
                </p>
              </button>
            </div>
            <div className="relative w-full z-50">
              <button
               disabled={
                  timeLeft?.timerBetTime <= 10 &&
                  timeLeft?.timerBetTime > 0 &&
                  timeLeft?.timerStatus === 2
                }
                onClick={() => handleClear()}
                className="top-0 xs1:-top-2 z-50 -right-[5.2rem] xs1:-right-[7rem] w-[60px] xs1:w-[80px] h-[30px] absolute"
              >
                <img src={g_btn_bg} alt="fg" />
                <p className="-mt-[20px] z-50 xs1:-mt-[26px] text-black ml-2 xs1:ml-3.5 text-[12px] xs1:text-[14px]">
                  {" "}
                  CLEAR
                </p>
              </button>
            </div>
            <div className="relative w-full z-50">
              <button
               disabled={
                  timeLeft?.timerBetTime <= 10 &&
                  timeLeft?.timerBetTime > 0 &&
                  timeLeft?.timerStatus === 2
                }
                onClick={() => handleDouble()}
                className="top-10 xs1:top-8 -right-[5.2rem] xs1:-right-[7rem] w-[60px] xs1:w-[80px] h-[30px] absolute"
              >
                <img src={g_btn_bg} alt="fg" />
                <p className="-mt-[20px] xs1:-mt-[26px] text-black ml-2 xs1:ml-3.5 text-[12px] xs1:text-[14px]">
                  {" "}
                  DOUBLE
                </p>
              </button>
            </div>

            <img src={t_c_result_bg} alt="" className="h-full w-full " />
          </div>
        </div>
        <div className="h-40 w-52  mx-2 relative">
          <img src={t_c_result_bg} alt="" className="h-full w-full " />
        </div>
      </div>
      <div className="w-full -mt-2">
        <TripleChanceFooter
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          onPlaceBet={placeBetHandler}
          timer={timeLeft?.timerBetTime}
          timerStatus={timeLeft?.timerStatus}
        />
      </div>
    </div>
  );
}

export default TripleChancehome;
