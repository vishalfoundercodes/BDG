import { useEffect, useState } from "react";
import SevenUpHeader from './SevenUpHeader';
import dice1 from "../../assets/usaAsset/dice/1.png";
import dice2 from "../../assets/usaAsset/dice/2.png";
import dice3 from "../../assets/usaAsset/dice/3.png";
import dice4 from "../../assets/usaAsset/dice/4.png";
import dice5 from "../../assets/usaAsset/dice/5.png";
import dice6 from "../../assets/usaAsset/dice/6.png";
import dice_two from "../../assets/SevenUpDown/dice_two.png";
import Ludo_dice from "../../assets/SevenUpDown/Ludo_dice.gif";
import SevenUpDownFooter from './SevenUpDownFooter';
import SevenUpDownSocket from "./SevenUpDownSocket";
import axios from "axios";
import apis from "../../utils/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ResultModal from "./ResultModal";
import useProfile from "../../reusable_component/gameApi";


function SevenUpDownHome() {
    const userId = localStorage.getItem("userId");
    const [timeLeft, setTimeLeft] = useState(0);
    const [profileRefresher, setProfileRefresher] = useState(false)
    const [isResultModal, setIsResultModal] = useState(false);
    const [gameResultHistory, setGameResultHistory] = useState([]);
    const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState([]);
    const [gameResultData, setGameResultData] = useState([]);
    const [betAmount, setBetAmount] = useState(1);
    const [numberAmounts, setNumberAmounts] = useState(Array(14).fill(0));
    const [showGif, setShowGif] = useState(false);
    const [diceValues, setDiceValues] = useState([null, null]);
    const navigate = useNavigate()
       const { myDetails } = useProfile(userId);
    useEffect(() => {
        const handleSocket = (hotair) => {
            const q = JSON.parse(hotair);
            setTimeLeft(q?.timerBetTime);
        };
        SevenUpDownSocket.on("demo_7up", handleSocket);
        return () => SevenUpDownSocket.off("demo_7up", handleSocket);
    }, []);
    useEffect(() => {
        gameResult()
        gameBetHistory()
    }, [])
    useEffect(() => {
        const betStatus = localStorage.getItem("sevenUpDown_bet")
        if (timeLeft === 5) {
            gameResultShuffle()
            gameResult()
            // if (gameResultData?.length > 0) {
            //     const result = gameResultData[0]?.number
            //     handleDiceShow(result)
            // }
        }
        if (timeLeft === 3) {
            if (betStatus === "true") {
                gameResultAnnouncement()
                localStorage.setItem("sevenUpDown_bet", "false")
                gameBetHistory()
            }
        }

        if (timeLeft === 30) {
            setDiceValues([null, null]);
            setIsResultModal(false)
            setNumberAmounts(Array(14).fill(0))
        }
    }, [timeLeft, gameResultData]);
    const data = [
        { number: 2, images: [dice1, dice1] },
        { number: 3, images: [dice2, dice1] },
        { number: 4, images: [dice2, dice2] },
        { number: 5, images: [dice1, dice4] },
        { number: 6, images: [dice3, dice3] },
        { number: 7, images: [dice5, dice2] },
        { number: 8, images: [dice4, dice4] },
        { number: 9, images: [dice5, dice4] },
        { number: 10, images: [dice5, dice5] },
        { number: 11, images: [dice5, dice6] },
        { number: 12, images: [dice6, dice6] },

    ];
    const numberToImages = {};
    data.forEach((entry) => {
        numberToImages[entry.number] = entry.images;
    });

    const betNo = [
        { number: 1, tir: '2 to 6' },
        { number: 2, tir: '7' },
        { number: 3, tir: '8 to 12' },
        { number: 4, tir: '2' },
        { number: 5, tir: '3' },
        { number: 6, tir: '4' },
        { number: 7, tir: '5' },
        { number: 8, tir: '6' },
        { number: 9, tir: '8' },
        { number: 10, tir: '9' },
        { number: 11, tir: '10' },
        { number: 12, tir: '11' },
        { number: 13, tir: '12' },
    ];

    const pickGradient = (num) => {
        if (num < 7) return 'from-[#66FF99] to-[#33CC66]';
        if (num === 7) return 'from-[#66CCFF] to-[#3399FF]';
        return 'from-[#FF9999] to-[#FF4D4D]';
    };

    // const handleNumberClick = (index) => {
    //     setNumberAmounts((prev) => {
    //         const updated = [...prev];
    //         updated[index] += betAmount;
    //         return updated;
    //     });
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

    const handleDiceShow = (result) => {
        console.log("result", result)
        if (result < 2 || result > 12) return
        setShowGif(true);
        setDiceValues([null, null]);
        setTimeout(() => {
            let dice1Value, dice2Value;
            if (result === 2) {
                dice1Value = 1
                dice2Value = 1
            } else if (result === 3) {
                dice1Value = 2
                dice2Value = 1
            } else if (result === 4) {
                dice1Value = 2
                dice2Value = 2
            } else if (result === 5) {
                dice1Value = 1
                dice2Value = 4
            } else if (result === 6) {
                dice1Value = 3
                dice2Value = 3
            } else if (result === 7) {
                dice1Value = 5
                dice2Value = 2
            } else if (result === 8) {
                dice1Value = 4
                dice2Value = 4
            } else if (result === 9) {
                dice1Value = 5
                dice2Value = 4
            } else if (result === 10) {
                dice1Value = 5
                dice2Value = 5
            } else if (result === 11) {
                dice1Value = 5
                dice2Value = 6
            } else if (result === 12) {
                dice1Value = 6
                dice2Value = 6
            }
            setDiceValues([dice1Value, dice2Value]);
            setShowGif(false);
        }, 2000);
    };

    const diceMap = {
        1: dice1,
        2: dice2,
        3: dice3,
        4: dice4,
        5: dice5,
        6: dice6,
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
            game_id: 15,
            json: bets
        }
        // console.log("object", payload)
        try {
            const response = await axios.post(apis?.sevenUpDown_bet, payload)
            // console.log("bet resoinse", response)
            if (response?.data?.status === 200) {
                setProfileRefresher(true)
                localStorage.setItem("sevenUpDown_bet", "true");
                toast.success(response?.data?.message)
            } else {
                toast.error("Bet failed!");
            }
        } catch (err) {
            // console.log("error hisotry", err);
            if (err?.response?.data?.status === 500) {
                console.log("error hisotry", err);
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    }

    // period number and last some results
    const gameResult = async () => {
        try {
            const res = await axios.get(
                `${apis?.sevenUpDown_Results}?game_id=15&limit=20`
            );
            console.log("game res", res)
            if (res?.data?.status === 200) {
                setGameResultData(res?.data?.data)
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("error hisotry", err);
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    };
    const gameResultShuffle = async () => {
        try {
            const res = await axios.get(
                `${apis?.sevenUpDown_Results}?game_id=15&limit=20`
            );
            console.log("game res", res)
            if (res?.data?.status === 200) {
                const aa=res?.data?.data[0]
                handleDiceShow(aa?.number)
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("error hisotry", err);
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    };

    const gameResultAnnouncement = async () => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        const sr = Number(gameResultData[0]?.games_no) 
        try {
            const response = await axios.get(`${apis?.sevenUpDown_win_amount}/`, {
                params: {
                    userid: Number(userId),
                    game_id: 15,
                    games_no: sr
                }
            });
            // console.log("gameresult responsere", response)
            if (response?.data?.status === 200) {
                setGameResultDataAnnouncemnt(response?.data)
                setIsResultModal(true)
            }
        } catch (err) {
            // console.log("server erro ", err)
            if (err?.response?.data?.status === 500) {
                console.log("server erro ", err)
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    }

    const gameBetHistory = async () => {
        const payload = {
            userid: userId,
            game_id: 15,
            limit: 10,
            offset: 0
        }
        try {
            const res = await axios.post(
                `${apis?.sevenUpDown_Bet_history}`, payload
            );
            // console.log("hisotry", res)
            if (res?.data?.status === 200) {
                setGameResultHistory(res?.data?.data)
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("error hisotry", err);
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    };
    // console.log("response", gameResultData)
    return (

        <div
            className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
            style={{ background: "linear-gradient(to bottom, #66CCFF, #3399FF, #0066CC, #003366)" }}
        >
            <div className="w-full">
                <SevenUpHeader profileRefresher={profileRefresher} gameResultHistory={gameResultHistory} setProfileRefresher={setProfileRefresher} />

                <div className="flex justify-between m-2">
                    <div className="h-8 w-24 bg-[#0066CC] opacity-90 rounded-lg text-center text-[10px] font-roboto" style={{ textShadow: "1px 1px 3px black" }}>
                        S.no:-  <p className="font-bold">{Number(gameResultData[0]?.games_no) + 1}</p>
                    </div>
                    <div className="h-8 w-24 bg-[#0066CC] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono" style={{ textShadow: "1px 1px 3px black" }}>
                        {timeLeft}
                    </div>
                </div>

                <div className="flex overflow-x-auto hide-scrollbar space-x-2 items-center h-17 bg-[#0066CC] opacity-90 rounded-lg text-white text-[14px] font-bold font-mono m-2 p-2" style={{ textShadow: "1px 1px 3px black" }}>
                    {gameResultData?.length > 0 ? gameResultData.map((da, index) => {
                        // console.log("da?.number",da?.number,data)
                        const matchingResults = data.filter(item => item.number === da?.number);
                        // console.log("matchingResults", da?.number, matchingResults);

                        return (
                            <div key={index} className="flex flex-col items-center min-w-[14px] justify-center">
                                <div className={`w-4 h-4 rounded-sm text-[10px] flex items-center justify-center bg-gradient-to-b ${pickGradient(da?.number)}`}>
                                    {da?.number}
                                </div>
                                <div className='flex flex-col gap-1 mt-1'>
                                    {matchingResults.length > 0 ? (
                                        matchingResults[0].images.map((img, i) => (
                                            <img key={i} src={img} alt={`num-${da?.number}-img-${i}`} className='w-4 h-4' />
                                        ))
                                    ) : (
                                        <span className="text-[8px] text-gray-400">No image</span>
                                    )}
                                </div>
                            </div>
                        )
                    }) : (
                        <p className="w-full text-center">no data</p>
                    )}
                </div>

                {/* Dice Animation + Result */}
                <div className="flex flex-col items-center justify-center mt-4 mb-2">
                    <div className="h-40 w-48 flex items-center justify-center">
                        {showGif ? (
                            <img src={Ludo_dice} alt="Rolling Dice" className="h-full" />
                        ) : (
                            diceValues[0] && diceValues[1] ? (
                                <div className="flex gap-2">
                                    <img src={diceMap[diceValues[0]]} alt="dice1" className="h-20 w-20" />
                                    <img src={diceMap[diceValues[1]]} alt="dice2" className="h-20 w-20" />
                                </div>
                            ) : (
                                <img src={dice_two} alt="dice_placeholder" className="h-full" />
                            )
                        )}
                    </div>
                </div>
                {/* Top 3 Bet Buttons */}
                <div className="flex gap-1 m-3 justify-center items-center">
                    {betNo.slice(0, 3).map((betNo, index) => {
                        const realIndex = index + 1;
                        const bgColor =
                            index === 0 ? 'from-[#66FF99] to-[#33CC66]' :
                                index === 1 ? 'from-[#66CCFF] to-[#3399FF]' :
                                    'from-[#FF9999] to-[#FF4D4D]';

                        const bgwidth =
                            index === 0 ? '36' :
                                index === 1 ? '32' :
                                    "36";

                        return (
                            <div
                                key={realIndex}
                                onClick={() => handleNumberClick(realIndex)}
                                className={`relative bg-gradient-to-b ${bgColor} rounded-sm text-center font-bold shadow-md cursor-pointer pt-2 h-24 w-${bgwidth} text-[25px]  text-[#FFD700]`}
                                style={{ textShadow: "1px 1px 2px black" }}
                            >
                                {betNo.tir}
                                <div className="absolute bottom-0 w-full flex items-center justify-center">
                                    <div className="bg-[#777777] text-xs rounded-b-sm shadow-md cursor-pointer h-6  wflex items-center justify-center text-white w-full">
                                        {Number(numberAmounts[realIndex]).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grid Bet Buttons */}
                <div className="grid grid-cols-5 gap-1 m-3">
                    {betNo.slice(3).map((betNo, index) => {
                        // console.log("firs ffffffft", index)
                        const realIndex = index + 4;

                        return (
                            <div
                                key={realIndex}
                                onClick={() => handleNumberClick(realIndex)}
                                className="relative bg-gradient-to-b from-[#66FF99] to-[#33CC66] rounded-sm text-center text-white font-bold shadow-md cursor-pointer pt-2 h-16 w-18"
                                style={{ textShadow: "1px 1px 2px black" }}
                            >
                                {betNo.tir}
                                <div className="absolute bottom-0 w-full items-center justify-center">
                                    <div className="bg-[#777777] text-xs rounded-b-sm shadow-md cursor-pointer h-6 items-center justify-center pt-1 text-white">
                                        {Number(numberAmounts[realIndex]).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full">
                <SevenUpDownFooter betAmount={betAmount} setBetAmount={setBetAmount} onPlaceBet={placeBetHandler} timeLeft={timeLeft} />
            </div>
            {isResultModal && (
                <ResultModal onClose={() => setIsResultModal(false)} announcementData={gameResultDataAnnouncemnt} />
            )}
        </div>
    );
}

export default SevenUpDownHome;
