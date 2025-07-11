import React, { useEffect, useState } from "react";
import RedBlackHeader from './RedBlackHeader'
import "./FlipAnimation.css";
import RedBlackFooter from "./RedBlackFooter";
import CLUBS from "../../assets/RedBlack/CLUBS.png";
import DIAMONDS from "../../assets/RedBlack/DIAMONDS.png";
import HEARTS from "../../assets/RedBlack/HEARTS.png";
import KING from "../../assets/RedBlack/KING-C.png";
import SPADES from "../../assets/RedBlack/SPADES.png";
import SPADESCLUBS from "../../assets/RedBlack/SPADESCLUBS.png";
import HEARTSDI from "../../assets/RedBlack/HEARTS-DIA.png";
import fire_card from "../../assets/RedBlack/fire_card.gif";
import one from "../../assets/cards/1.png";
import two from "../../assets/cards/2.png";
import three from "../../assets/cards/3.png";
import four from "../../assets/cards/4.png";
import five from "../../assets/cards/5.png";
import six from "../../assets/cards/6.png";
import seven from "../../assets/cards/7.png";
import eight from "../../assets/cards/8.png";
import nine from "../../assets/cards/9.png";
import ten from "../../assets/cards/10.png";
import eleven from "../../assets/cards/11.png";
import twelve from "../../assets/cards/12.png";
import thirteen from "../../assets/cards/13.png";
import fourteen from "../../assets/cards/14.png";
import fifteen from "../../assets/cards/15.png";
import sixteen from "../../assets/cards/16.png";
import seventeen from "../../assets/cards/17.png";
import eighteen from "../../assets/cards/18.png";
import nineteen from "../../assets/cards/19.png";
import twenty from "../../assets/cards/20.png";
import twentyOne from "../../assets/cards/21.png";
import twentyTwo from "../../assets/cards/22.png";
import twentyThree from "../../assets/cards/23.png";
import twentyFour from "../../assets/cards/24.png";
import twentyFive from "../../assets/cards/25.png";
import twentySix from "../../assets/cards/26.png";
import twentySeven from "../../assets/cards/27.png";
import twentyEight from "../../assets/cards/28.png";
import twentyNine from "../../assets/cards/29.png";
import thirty from "../../assets/cards/30.png";
import thirtyOne from "../../assets/cards/31.png";
import thirtyTwo from "../../assets/cards/32.png";
import thirtyThree from "../../assets/cards/33.png";
import thirtyFour from "../../assets/cards/34.png";
import thirtyFive from "../../assets/cards/35.png";
import thirtySix from "../../assets/cards/36.png";
import thirtySeven from "../../assets/cards/37.png";
import thirtyEight from "../../assets/cards/38.png";
import thirtyNine from "../../assets/cards/39.png";
import forty from "../../assets/cards/40.png";
import fortyOne from "../../assets/cards/41.png";
import fortyTwo from "../../assets/cards/42.png";
import fortyThree from "../../assets/cards/43.png";
import fortyFour from "../../assets/cards/44.png";
import fortyFive from "../../assets/cards/45.png";
import fortySix from "../../assets/cards/46.png";
import fortySeven from "../../assets/cards/47.png";
import fortyEight from "../../assets/cards/48.png";
import fortyNine from "../../assets/cards/49.png";
import fifty from "../../assets/cards/50.png";
import fiftyOne from "../../assets/cards/51.png";
import fiftyTwo from "../../assets/cards/52.png";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../../utils/apis";
import { useNavigate } from "react-router-dom";
import RednBlackSocket from "./RednBlackSocket";
import ResultModal from "./ResultModal";
import useProfile from "../../reusable_component/gameApi";


const diceImages = [HEARTS, CLUBS, SPADES, DIAMONDS, HEARTSDI, SPADESCLUBS];
const cardList = [
    one, two, three, four, five, six, seven, eight, nine, ten,
    eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty,
    twentyOne, twentyTwo, twentyThree, twentyFour, twentyFive, twentySix, twentySeven, twentyEight, twentyNine, thirty,
    thirtyOne, thirtyTwo, thirtyThree, thirtyFour, thirtyFive, thirtySix, thirtySeven, thirtyEight, thirtyNine, forty,
    fortyOne, fortyTwo, fortyThree, fortyFour, fortyFive, fortySix, fortySeven, fortyEight, fortyNine, fifty,
    fiftyOne, fiftyTwo
]

function RedAndBlackhome() {
    const userId = localStorage.getItem("userId");
    const [profileRefresher, setProfileRefresher] = useState(false)
    const [shuffling, setShuffling] = useState(false);
    const [currentDice, setCurrentDice] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isResultModal, setIsResultModal] = useState(false);
    const [gameResultHistory, setGameResultHistory] = useState([]);
    const [gameResultDataAnnouncemnt, setGameResultDataAnnouncemnt] = useState([]);
    const [gameResultData, setGameResultData] = useState([]);
    const [betAmount, setBetAmount] = useState(1);
    const [flipped, setFlipped] = useState(false);
    const [numberAmounts, setNumberAmounts] = useState(Array(7).fill(0));
       const { myDetails } = useProfile(userId);
    



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

    const navigate = useNavigate()
    useEffect(() => {
        const handleSocket = (hotair) => {
            const q = JSON.parse(hotair);
            setTimeLeft(q?.timerBetTime);
        };
        RednBlackSocket.on("demo_RB", handleSocket);
        return () => RednBlackSocket.off("demo_RB", handleSocket);
    }, []);

    useEffect(() => {
        // gameResultAnnouncement()
        gameResult()
        gameBetHistory()
    }, [])
    useEffect(() => {
        const betStatus = localStorage.getItem("rednblack_bet")
        if (timeLeft === 5) {
            gameResult()
        }
        if (timeLeft === 4 && !shuffling) {
            setFlipped(true)
        }
        if (timeLeft === 3) {
             if (betStatus === "true") {
                gameResultAnnouncement()
                localStorage.setItem("rednblack_bet", "false")
            }
            gameBetHistory()
        }
        if (timeLeft === 30) {
            setIsResultModal(false)
            setCurrentDice(0);
            setFlipped(false)
            setNumberAmounts(Array(7).fill(0))
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
            game_id: 16,
            json: bets
        }
        // console.log("object", payload)
        try {
            const response = await axios.post(apis?.rednblack_bet, payload)
            // console.log("bet resoinse", response)
            if (response?.data?.status === 200) {
                setProfileRefresher(true)
                localStorage.setItem("rednblack_bet", "true");
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
                `${apis?.rednblack_Results}?game_id=16&limit=15`
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

    const gameResultAnnouncement = async () => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        const sr = gameResultData?.length > 0 && (timeLeft > 11 ? (Number(gameResultData[0]?.games_no) + 1) : gameResultData[0]?.games_no)
        try {
            const response = await axios.get(`${apis?.rednblack_win_amount}/`, {
                params: {
                    userid: Number(userId),
                    game_id: 16,
                    games_no: sr
                }
            });
            console.log("gameresult responsere", response)
            if (response?.data?.status === 200) {
                setGameResultDataAnnouncemnt(response?.data)
                setIsResultModal(true)
            }
        } catch (err) {
            console.log("server erro ", err)
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
            game_id: 16,
            limit: 10,
            offset: 0
        }
        try {
            const res = await axios.post(
                `${apis?.rednblack_Bet_history}`, payload
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

    return (
        <div
            className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
            style={{
                background:
                    "linear-gradient(to bottom, #FF4D4D, #CC0000, #990000, #660000)",
            }}
        >
            <div className="w-full">
                <RedBlackHeader profileRefresher={profileRefresher} gameResultHistory={gameResultHistory} setProfileRefresher={setProfileRefresher} />
                {/* Serial + Timer */}
                <div className="flex justify-between m-4">
                    <div
                        className="h-8 w-24 bg-[#990000] opacity-90 rounded-lg text-center text-[10px] font-roboto"
                        style={{ textShadow: "1px 1px 3px black" }}
                    >
                        S.no:-  <p className="font-bold">{gameResultData?.length > 0 && (Number(gameResultData[0]?.games_no) + 1) }</p>
                    </div>
                    <div
                        className="h-8 w-24 bg-[#990000] opacity-90 rounded-lg text-center text-[20px] font-bold font-mono"
                        style={{ textShadow: "1px 1px 3px black" }}
                    >
                        {timeLeft}
                    </div>
                </div>

                {/* result Display */}
                <div
                    className="flex overflow-x-auto space-x-2 hide-scrollbar  items-center h-12 bg-[#990000] opacity-90 rounded-sm text-center text-[20px] font-bold font-mono m-2 p-2"
                    style={{ textShadow: "1px 1px 3px black" }}
                >
                    {gameResultData?.length > 0 ? (
                        gameResultData?.map((item, i) => {
                                const url = cardList[item?.number - 1]
                                return (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`Dice ${i}`}
                                        className="w-8 h-8 object-fill shadow-md rounded"
                                    />
                                )
                            })
                    ) : (
                        <p>no data</p>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center ">
                    <div className="card-container">
                        <div className={`card ${flipped ? "flipped" : ""}`}>

                            <div
                                className="card-front text-white relative"
                                style={{
                                    backgroundImage: `url(${fire_card})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                            </div>

                            <div
                                className="card-back bg-black text-white relative"
                                style={{
                                    backgroundImage: `url(${cardList[gameResultData && (gameResultData[0]?.number - 1)]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dice Grid */}
                <div className="flex items-center justify-center w-full px-4 mt-3 xs1:mt-6">
                    <div className="flex items-center justify-center w-full gap-2 ">
                        {diceImages.slice(0, 4).map((image, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleNumberClick(index)}
                                    className={`relative rounded-lg text-center  text-white font-bold shadow-md cursor-pointer pt-2 "
                                }`}
                                    style={{ textShadow: "1px 1px 2px black" }}
                                >
                                    <img
                                        src={image}
                                        alt={`Dice ${index + 1}`}
                                        className={`mx-auto w-12 xs1:w-16 h-12 xs1:h-16 mb-1`}
                                    />
                                    <div
                                        className={`bg-[#333333] text-xs p-1 "
                                    } mt-1 rounded-lg shadow-md cursor-pointer`}
                                    >
                                        {/* {Number(numberAmounts[index]).toFixed(2)} */}
                                        {Number(numberAmounts[index])}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
                <div className="flex items-center gap-4 mx-5 mb-14 justify-center">
                    {diceImages.slice(4).map((image, index) => {
                        const actualIndex = index + 4;
                        return (
                            <div
                                key={actualIndex}
                                onClick={() => handleNumberClick(actualIndex)}
                                className="w-24 h-24 relative  rounded-xl text-center text-white font-bold shadow-md cursor-pointer pt-4"
                                style={{ textShadow: "1px 1px 2px black" }}
                            >
                                <img
                                    src={image}
                                    alt={`Dice ${actualIndex + 1}`}
                                    className="mx-auto w-20 xs1:w-24 h-16 xs1:h-24 mb-2"
                                />
                                <div className="bg-[#333333]   mt-2 rounded-lg shadow-md cursor-pointer">
                                    {/* {Number(numberAmounts[actualIndex]).toFixed(2)} */}
                                    {Number(numberAmounts[actualIndex])}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full mt-3 xs1:mt-0">
                <RedBlackFooter betAmount={betAmount} setBetAmount={setBetAmount} onPlaceBet={placeBetHandler} timeLeft={timeLeft} />
            </div>
            {isResultModal && (
                <ResultModal onClose={() => setIsResultModal(false)} announcementData={gameResultDataAnnouncemnt} />
            )}
        </div>
    )
}

export default RedAndBlackhome
