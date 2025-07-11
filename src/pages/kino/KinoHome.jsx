import { useEffect, useState, useRef } from 'react';
import KinoHeader from './KinoHeader';
import KinoBetButton from './KinoBetButton';
import kenoSocket from './KenoSocket';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apis from '../../utils/apis';
import ResultModal from './ResultModal';
// admin_keno
function KinoHome() {
  const userId = localStorage.getItem("userId");
  const [selectedRisk, setSelectedRisk] = useState('low');
  const navigate = useNavigate()
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [gameResultAnnouncemnt, setGameResultAnnouncemnt] = useState(null);
  const [profileRefresher, setProfileRefresher] = useState(false)
  const [gameResultNumber, setGameResultNumber] = useState([])
  const [timeLeft, setTimeLeft] = useState(0);
  const [resultChecked, setResultChecked] = useState(false);
  const selectedNumbersRef = useRef([]);

  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q?.timerBetTime);
    };
    kenoSocket.on("demo_kino", handleSocket);
    return () => kenoSocket.off("demo_kino", handleSocket);
  }, []);

  useEffect(() => {
    console.log("Result Checked updated to:", resultChecked);
  }, [resultChecked]);
  // const { myDetails: data, loading, error, fetchProfileDetails } = useProfile(userId);

  const toggleNumber = (num) => {
    // console.log("numnum", num)
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      } else {
        return [...prev, num].slice(0, 10);
      }
    });
  };

  const handleRandomSelect = () => {
    const shuffled = [...numbers].sort(() => 0.5 - Math.random());
    const randomTen = shuffled.slice(0, 10);
    setSelectedNumbers(randomTen);
  };
  const handleClear = () => {
    setSelectedNumbers([]);
  };

  const handleChange = (e) => {
    setSelectedRisk(e.target.value);
    setSelectedNumbers([]);
  };

  const getMultiplierList = () => {
    const index = selectedNumbers.length - 1;
    if (index < 0 || index >= 10) return [];

    if (selectedRisk === "low") return lowList[index];
    if (selectedRisk === "medium") return mediumList[index];
    if (selectedRisk === "high") return highRiskList[index];

    return [];
  };

  const numbers = Array.from({ length: 40 }, (_, i) => i + 1);

  const lowList = [
    ['0.5x', '2.38x'],
    ['0.5x', '1.19x', '0.5x'],
    ['0.5x', '0.5x', '2.2x', '20x'],
    ['0.5x', '0.5x', '1.4x', '5x', '40x'],
    ['0.5x', '0.5x', '1x', '2.4x', '15x', '100x'],
    ['0.5x', '0.5x', '0.5x', '2.13x', '7x', '50x', '200x'],
    ['0.5x', '0.5x', '0.5x', '2x', '3.48x', '6x', '100x', '5000x'],
    ['1x', '0.2x', '0.2x', '1x', '5.21x', '8x', '30x', '300x', '5000x'],
    ['01x', '0.5x', '0.5x', '0.5x', '2x', '5.5x', '20x', '400x', '1000x', '5000x'],
    ['2x', '0.5x', '0.5x', '0.5x', '0.5x', '6.37x', '15x', '100x', '500x', '2000x', '5000x'],
  ];

  const mediumList = [
    ['0.2x', '3.28x'],
    ['0.2x', '1.18x', '7x'],
    ['0.2x', '0.2x', '2.74x', '3.5x'],
    ['0.2x', '0.2x', '1.5x', '8x', '80x'],
    ['0.2x', '0.2x', '1x', '3.5x', '20x', '250x'],
    ['0.2x', '0.2x', '0.2x', '2.56x', '9x', '120x', '450x'],
    ['1x', '0.2x', '0.2x', '2x', '5.3x', '10x', '200x', '1000x'],
    ['1x', '0.2x', '0.2x', '1x', '5.21x', '8x', '30x', '300x', '5000x'],
    ['1.5x', '0.2x', '0.2x', '0.2x', '2x', '10.07x', '30x', '800x', '2000x', '10000x'],
    ['2x', '0.3x', '0.3x', '0.3x', '0.3x', '6.2x', '25x', '300x', '8000x', '90000x', '800000x'],
  ];

  const highRiskList = [
    ['0x', '3.88x'],
    ['0x', '1.17x', '9x'],
    ['0x', '0x', '2.65x', '50x'],
    ['0x', '0x', '1.62x', '10x', '100x'],
    ['0x', '0x', '1x', '3.78x', '25x', '400x'],
    ['0x', '0x', '0x', '2.67x', '10x', '180x', '700x'],
    ['1x', '0x', '0x', '2x', '5.3x', '20x', '400x', '2000x'],
    ['1', '0x', '0x', '1x', '5.38x', '11x', '50x', '5000x', '10000x'],
    ['2x', '0x', '0x', '0x', '2x', '10.86x', '50x', '1000x', '5000x', '25000x'],
    ['2x', '0x', '0x', '0x', '1x', '5.57x', '30x', '500x', '1000x', '5000x', '10000x'],
  ];

  // game result api
  const gameResult = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const payload = {
      game_id: 17,
      limit: 10
    }
    try {
      const response = await axios.post(`${apis?.keno_result}`, payload)
      // console.log("gameresult responsere", response)
      if (response?.data?.status === 200) {
        setGameResultData(response?.data?.data)
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
    const payload = {
      userid: userId,
      game_id: 17,
      limit: 10
    }
    try {
      const response = await axios.post(`${apis?.keno_betHistory}`, payload)
      if (response?.data?.status === 200) {
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
  const winAmountHandler = async (sr) => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const payload1 = {
        game_id: 17,
        limit: 10
      }
      const response = await axios.post(`${apis?.keno_result}`, payload1)
      // console.log("gameresult responsere", response)
      if (response?.data?.status === 200) {
        const data = JSON.parse(response?.data?.data[0]?.number)
        setGameResultNumber(data)
        try {
          const payload = {
            userid: userId,
            game_id: 17,
            games_no: sr
          }
          // console.log("payload", payload)
          const response = await axios.post(`${apis?.keno_win_amount}`, payload)
          // console.log("responer", response)
          if (response?.data?.status === 200) {
            setGameResultAnnouncemnt(response?.data);
            // setIsResultModal(true);
            setResultChecked(true); // ✅ show red/yellow
            console.log("result checked:",resultChecked)
            setTimeout(() => {
              setResultChecked(false); // ❌ hide after 2 seconds
            console.log("result checked2:", resultChecked);
            }, 3000);
          }
        } catch (err) {
          if (err?.response?.data?.status === 500) {
            console.log("server erro ", err)
          } else {
            toast.error(err?.response?.data?.message)
          }
        }
      }
      // const sr = Number(gameResultData[0]?.games_no) + 1

    } catch (err) {
      console.log("errr game result", err)
    }

  }

  useEffect(() => {
    const betStatus = localStorage.getItem("keno_bet")
    gameResult()
    gameBetHistory()
    // fetchProfileDetails();
    // getMultiplier()
    const sr = Number(gameResultData[0]?.games_no) + 1
    if (betStatus === "true") winAmountHandler(sr)
  }, [])

  useEffect(() => {
    if (gameResultNumber.length > 0) {
      setSelectedNumbers((prev) => [...prev]); // force re-render
    }
  }, [gameResultNumber]);

  useEffect(() => {
    const betStatus = localStorage.getItem("keno_bet")
    if (timeLeft === 5) {
      gameResult()
      gameBetHistory()
    }
    if (timeLeft === 4) {
      if (betStatus === "true") {
        const sr = Number(gameResultData[0]?.games_no) + 1
        winAmountHandler(sr)
        localStorage.setItem("keno_bet", "false")
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!resultChecked) {
      handleClear();
    }
  }, [resultChecked]);

  // console.log("gameResultAnnouncemnt", gameResultAnnouncemnt)

  // if (loading) return <Loader />
  return (
    <div
      className="h-full w-full overflow-y-scroll hide-scrollbar"
      style={{
        background:
          "linear-gradient(to bottom, #005500, #2b7009, #569123, #569123, #569123, #2b7009, #2b7009)",
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <KinoHeader
            profileRefresher={profileRefresher}
            gameResultHistory={gameResultHistory}
          />
          {/* Serial + Timer */}
          <div className="flex justify-between mx-3 my-2 xs1:my-3">
            <div
              className="h-8 w-24 bg-[#005500] opacity-90 rounded-lg text-center text-[10px] font-roboto"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              S.no:- {gameResultData && Number(gameResultData[0]?.games_no) + 1}
            </div>
            <div
              className="h-8 w-24 bg-[#005500] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              {timeLeft}
            </div>
          </div>

          {/* Last Results */}
          <div className="bg-[#005500] opacity-90 rounded-lg text-center text-[20px] font-bold mx-3 xs1:my-5 px-2 pb-2 xs1:pt-2 xs1:pb-3">
            {gameResultData?.length > 0 ? (
              gameResultData?.slice(0, 2)?.map((row, rowIndex) => {
                const numbers = JSON.parse(row?.number || "[]");
                return (
                  <div key={rowIndex} className="grid grid-cols-10 gap-2">
                    {numbers?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="h-5 w-5 mt-2 shadow-lg text-center font-bold rounded-full text-[8px] flex items-center justify-center"
                          style={{
                            background:
                              "radial-gradient(circle at center, #003b09, #062b12, #010905)",
                          }}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="text-white">No result found</div>
            )}
          </div>
          {/* Number Grid */}
          {/* <div className="grid grid-cols-8 gap-1 xs1:gap-3 px-4 py-2">
            {numbers.map((num) => (
              // <div
              //   key={num}
              //   onClick={() => toggleNumber(num)}
              //   className={`h-8 w-8 border border-black shadow-lg font-bold rounded-full text-[12px] flex items-center justify-center cursor-pointer ${selectedNumbers.includes(num) ? "bg-yellow text-black" : "text-white"}`}
              //   style={{
              //     textShadow: '1px 1px 3px gray',
              //     background: selectedNumbers.includes(num)
              //       ? "radial-gradient(circle at center, #D3D3D3, #ffffff, #D3D3D3)"
              //       : "radial-gradient(circle at center, #003b09, #062b12, #010905)",
              //   }}
              // >
              //   {num}
              // </div>
              <div
      key={num}
      onClick={() => toggleNumber(num)}
      className={`h-8 w-8 border border-black shadow-lg font-bold rounded-full text-[12px]
        flex items-center justify-center cursor-pointer transition duration-500 ease-in-out
        ${
          selectedNumbers.includes(num)
            ? resultChecked
              ? gameResultNumber.includes(num)
                ? "bg-yellow text-black"
                : "bg-red text-white"
              : "bg-white text-black"
            : "bg-gradient-to-b from-[#003b09] via-[#062b12] to-[#010905] text-white"
        }
      `}
      style={{
        textShadow: "1px 1px 3px gray",
      }}
    >
      {num}
    </div>
            ))}
          </div> */}

          {/* Number Grid */}
          {/* <div className="grid grid-cols-8 gap-1 xs1:gap-3 px-4 py-2">
            {numbers.map((num) => {
              const isSelected = selectedNumbers.includes(num);

              const baseClasses =
                "h-8 w-8 border border-black shadow-lg font-bold rounded-full text-[12px] flex items-center justify-center cursor-pointer transition duration-500 ease-in-out";
              const textShadow = { textShadow: "1px 1px 3px gray" };

              if (resultChecked) {
                // Show yellow if matched, red if not
                const isWin = gameResultNumber.includes(num);
                console.log("is win:", isWin)
                return (
                  <div
                    key={num}
                    className={`${baseClasses} ${
                      isWin ? "bg-yellow text-black" : "bg-red text-white"
                    }`}
                    style={textShadow}
                  >
                    {num}
                  </div>
                );
              } else {
                // Normal state rendering
                return (
                  <div
                    key={num}
                    onClick={() => toggleNumber(num)}
                    className={`${baseClasses} ${
                      isSelected
                        ? "bg-white text-black"
                        : "bg-gradient-to-b from-[#003b09] via-[#062b12] to-[#010905] text-white"
                    }`}
                    style={textShadow}
                  >
                    {num}
                  </div>
                );
              }
            })}
          </div> */}
          {/* Number Grid */}
          <div className="grid grid-cols-8 gap-1 xs1:gap-3 px-4 py-2">
            {numbers.map((num) => {
              const isSelected = selectedNumbers.includes(num);
              const isWinning = gameResultNumber.includes(num);

              // console.log("selected number:", selectedNumbers)
              // console.log("is Selected: ", isSelected);
              const baseClasses =
                "h-8 w-8 border border-black shadow-lg font-bold rounded-full text-[12px] flex items-center justify-center transition duration-500 ease-in-out";
              const textShadow = { textShadow: "1px 1px 3px gray" };

              let extraClass = "";
              let clickable = true;

              if (resultChecked) {
                clickable = false;

                if (isSelected && isWinning) {
                  extraClass = "bg-yellow text-black"; // ✅ win
                } else if (isSelected && !isWinning) {
                  extraClass = "bg-[#D0312D] text-white"; // ❌ lose
                } else {
                  extraClass =
                    "bg-gradient-to-b from-[#003b09] via-[#062b12] to-[#010905] text-white"; // 🔘 normal
                }
              } else {
                if (isSelected) {
                  extraClass = "bg-white text-black"; // pre-selected
                } else {
                  extraClass =
                    "bg-gradient-to-b from-[#003b09] via-[#062b12] to-[#010905] text-white";
                }
              }

              return (
                <div
                  key={num}
                  onClick={clickable ? () => toggleNumber(num) : undefined}
                  className={`${baseClasses} ${extraClass} ${
                    clickable ? "cursor-pointer" : ""
                  }`}
                  style={textShadow}
                >
                  {num}
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex justify-evenly mx-3 my-1 xs1:my-3">
            <div
              onClick={handleRandomSelect}
              className="h-7 w-24 cursor-pointer bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[12px] font-serif font-bold shadow-lg m-2 rounded-lg flex items-center justify-center border border-black"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              RANDOM
            </div>
            <div
              onClick={handleClear}
              className="h-7 w-24 cursor-pointer bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[12px] font-serif font-bold shadow-lg m-2 rounded-lg flex items-center justify-center border border-black"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              CLEAR
            </div>
            <div
              className="h-7 w-24 bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[12px] font-serif font-bold shadow-lg m-2 rounded-lg flex items-center justify-center border border-black"
              style={{ textShadow: "1px 1px 3px black" }}
            >
              PAY TABLE
            </div>
          </div>

          {/* Risk Level */}
          <div className="text-white px-4 xs1:py-2 flex justify-evenly">
            {["low", "medium", "high"].map((level) => (
              <label
                key={level}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={level}
                  checked={selectedRisk === level}
                  onChange={handleChange}
                  className="appearance-none w-4 h-4 border-2 border-white rounded-full checked:bg-green checked:border-white transition"
                />
                <span className="capitalize font-bold">{level}</span>
              </label>
            ))}
          </div>

          {/* MULTIPLIERS  */}

          <div className="border border-white rounded-xl m-3">
            <div className="text-white px-4 py-0.5 xs1:py-2">
              {selectedNumbers.length === 0 ? (
                <p>Select at least one number to see multipliers</p>
              ) : (
                <div className="flex gap-2 flex-wrap mt-2">
                  {getMultiplierList().map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-white px-2 py-1 rounded text-[13px] items-center justify-center cursor-pointer"
                    >
                      <div className="h-4 w-4 rounded-full bg-[#006400] text-white text-[10px] flex items-center justify-center mr-2">
                        {idx}
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Kino Bet Button */}
        <KinoBetButton
          handleClear={handleClear}
          timeLeft={timeLeft}
          selectedRisk={selectedRisk}
          selectedNumbers={selectedNumbers}
          setProfileRefresher={setProfileRefresher}
        />
      </div>

      {isResultModal && (
        <ResultModal
          onClose={() => setIsResultModal(false)}
          gameResultNumber={gameResultNumber}
          announcementData={gameResultAnnouncemnt}
        />
      )}
    </div>
  );
}

export default KinoHome;

