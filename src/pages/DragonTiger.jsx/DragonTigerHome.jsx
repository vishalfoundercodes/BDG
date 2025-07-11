import { assets } from "./assets";
import { useEffect, useState } from "react";
import { players } from "./RandomPlayerData";
import ic_arrow_zigzag from "../../assets/dragontiger/ic_arrow_zigzag.png"
import Startbetting from "../../assets/dragontiger/Startbetting.png"
// import bettingplaceds from "../../assets/dragontiger/bettingplaceds.png"
import stopbetting from "../../assets/dragontiger/stopbetting.png"
import ic_dt_d from "../../assets/dragontiger/ic_dt_d.png"
import ic_dt_t from "../../assets/dragontiger/ic_dt_t.png"
import ic_dt_tie from "../../assets/dragontiger/ic_dt_tie.png"
import fire_card from "../../assets/dragontiger/fire_card.gif"
import gif_dragon_animated from "../../assets/dragontiger/gif_dragon_animated.gif"
import gif_tiger_animated from "../../assets/dragontiger/gif_tiger_animated.gif"
import tieWon from "../../assets/dragontiger/tieWon.png"
import dvst from "../../assets/dragontiger/dvst.png"
import { positionsZero, positionsOne, positionsTwo, positionsThree, positionsFour, positionsFive, positionsUser, positionsTieFive, positionsDragonFive, positionsTigerFive, positionsTieTen, positionsDragonTen, positionsTigerTen, positionsTieHundred, positionsDragonHundred, positionsTigerHundred, positionsTieFifty, positionsDragonFifty, positionsTigerFifty, positionsTieFiveHundred, positionsDragonFiveHundred, positionsTigerFiveHundred, positionsTieThousand, positionsDragonThousand, positionsTigerThousand } from './positions';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apis from '../../utils/apis'
import socket from '../../shared/socket/DragonTigerSocket';
const profileApi = apis.profile
// import {api} from "../"
function DragonTigerHome() {
    const [betAmount, setBetAmount] = useState(null);
  const [selectedCoins, setSelectedCoins] = useState(null)
  const [selectedBetBox, setSelectedBetBox] = useState(null)
  const [coinAnimation, setCoinAnimation] = useState(false);

  const [startAnimationUser, setStartAnimationUser] = useState(false);
  const [startAnimationZero, setStartAnimationZero] = useState(false);
  const [startAnimationOne, setStartAnimationOne] = useState(false);
  const [startAnimationTwo, setStartAnimationTwo] = useState(false);
  const [startAnimationThree, setStartAnimationThree] = useState(false);
  const [startAnimationFour, setStartAnimationFour] = useState(false);
  const [startAnimationFive, setStartAnimationFive] = useState(false);
  const [tieBetValue, setTieBetValue] = useState(() => parseInt(localStorage.getItem("tieBetValue") || selectedCoins));
  const [dragonBetValue, setDragonBetValue] = useState(() => parseInt(localStorage.getItem("dragonBetValue") || selectedCoins));
  const [tigerBetValue, setTigerBetValue] = useState(() => parseInt(localStorage.getItem("tigerBetValue") || selectedCoins));

  const [usedPositionsFive, setUsedPositionsFive] = useState(new Set());
  const [translatedIndicesFive, setTranslatedIndicesFive] = useState([]);
  const [randomPositionsFive, setRandomPositionsFive] = useState({});
  const [usedPositionsTen, setUsedPositionsTen] = useState(new Set());
  const [translatedIndicesTen, setTranslatedIndicesTen] = useState([]);
  const [randomPositionsTen, setRandomPositionsTen] = useState({});
  const [usedPositionsFifty, setUsedPositionsFifty] = useState(new Set());
  const [translatedIndicesFifty, setTranslatedIndicesFifty] = useState([]);
  const [randomPositionsFifty, setRandomPositionsFifty] = useState({});
  const [usedPositionsHundred, setUsedPositionsHundred] = useState(new Set());
  const [translatedIndicesHundred, setTranslatedIndicesHundred] = useState([]);
  const [randomPositionsHundred, setRandomPositionsHundred] = useState({});
  const [usedPositionsFiveHundred, setUsedPositionsFiveHundred] = useState(new Set());
  const [translatedIndicesFiveHundred, setTranslatedIndicesFiveHundred] = useState([]);
  const [randomPositionsFiveHundred, setRandomPositionsFiveHundred] = useState({});
  const [usedPositionsThousand, setUsedPositionsThousand] = useState(new Set());
  const [translatedIndicesThousand, setTranslatedIndicesThousand] = useState([]);
  const [randomPositionsThousand, setRandomPositionsThousand] = useState({});

  const [usedPositionsDragonFive, setUsedPositionsDragonFive] = useState(new Set());
  const [translatedIndicesDragonFive, setTranslatedIndicesDragonFive] = useState([]);
  const [randomPositionsDragonFive, setRandomPositionsDragonFive] = useState({});
  const [usedPositionsDragonTen, setUsedPositionsDragonTen] = useState(new Set());
  const [translatedIndicesDragonTen, setTranslatedIndicesDragonTen] = useState([]);
  const [randomPositionsDragonTen, setRandomPositionsDragonTen] = useState({});
  const [usedPositionsDragonFifty, setUsedPositionsDragonFifty] = useState(new Set());
  const [translatedIndicesDragonFifty, setTranslatedIndicesDragonFifty] = useState([]);
  const [randomPositionsDragonFifty, setRandomPositionsDragonFifty] = useState({});
  const [usedPositionsDragonHundred, setUsedPositionsDragonHundred] = useState(new Set());
  const [translatedIndicesDragonHundred, setTranslatedIndicesDragonHundred] = useState([]);
  const [randomPositionsDragonHundred, setRandomPositionsDragonHundred] = useState({});
  const [usedPositionsDragonFiveHundred, setUsedPositionsDragonFiveHundred] = useState(new Set());
  const [translatedIndicesDragonFiveHundred, setTranslatedIndicesDragonFiveHundred] = useState([]);
  const [randomPositionsDragonFiveHundred, setRandomPositionsDragonFiveHundred] = useState({});
  const [usedPositionsDragonThousand, setUsedPositionsDragonThousand] = useState(new Set());
  const [translatedIndicesDragonThousand, setTranslatedIndicesDragonThousand] = useState([]);
  const [randomPositionsDragonThousand, setRandomPositionsDragonThousand] = useState({});

  const [usedPositionsTigerFive, setUsedPositionsTigerFive] = useState(new Set());
  const [translatedIndicesTigerFive, setTranslatedIndicesTigerFive] = useState([]);
  const [randomPositionsTigerFive, setRandomPositionsTigerFive] = useState({});
  const [usedPositionsTigerTen, setUsedPositionsTigerTen] = useState(new Set());
  const [translatedIndicesTigerTen, setTranslatedIndicesTigerTen] = useState([]);
  const [randomPositionsTigerTen, setRandomPositionsTigerTen] = useState({});
  const [usedPositionsTigerFifty, setUsedPositionsTigerFifty] = useState(new Set());
  const [translatedIndicesTigerFifty, setTranslatedIndicesTigerFifty] = useState([]);
  const [randomPositionsTigerFifty, setRandomPositionsTigerFifty] = useState({});
  const [usedPositionsTigerHundred, setUsedPositionsTigerHundred] = useState(new Set());
  const [translatedIndicesTigerHundred, setTranslatedIndicesTigerHundred] = useState([]);
  const [randomPositionsTigerHundred, setRandomPositionsTigerHundred] = useState({});
  const [usedPositionsTigerFiveHundred, setUsedPositionsTigerFiveHundred] = useState(new Set());
  const [translatedIndicesTigerFiveHundred, setTranslatedIndicesTigerFiveHundred] = useState([]);
  const [randomPositionsTigerFiveHundred, setRandomPositionsTigerFiveHundred] = useState({});
  const [usedPositionsTigerThousand, setUsedPositionsTigerThousand] = useState(new Set());
  const [translatedIndicesTigerThousand, setTranslatedIndicesTigerThousand] = useState([]);
  const [randomPositionsTigerThousand, setRandomPositionsTigerThousand] = useState({});
  const [startAnimationCoin, setStartAnimationCoin] = useState(0);
  const [slideImageStart, setSlideImageStart] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [flipCards, setFlipCards] = useState(false);
  const [showFlipCards, setShowFlipCards] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [randomPlayers, setRandomPlayers] = useState([]);
  const [startbetImage, setstartbetImage] = useState(false);
  const [stopbetImage, setStopbetImage] = useState(false);
  const [betResultData, setBetResultData] = useState([]);
  const [showWinner, setShowWinner] = useState(false);
  const [betResultDataAnnouncement, setBetResultDataAnnouncement] = useState([]);
  const [randomNumber, setRandomNumber] = useState(264);
  // const calculateTimeLeft = () => {
  //   const now = new Date();
  //   const secondsInCycle = (now.getMinutes() * 60 + now.getSeconds()) % duration;
  //   const remainingTime = Math.max(duration - secondsInCycle, 0);
  //   setTimeLeft(remainingTime);
  // };
  // const [timers, setTimers] = useState({
  //   type1: 0,
  // });

  useEffect(() => {
    const handleOneMin = (onemin) => {
      const q = JSON.parse(onemin);
      const { timerBetTime } = q;
      setTimeLeft(
        Number(timerBetTime)
      );
    };
    socket.on("demo_DT", handleOneMin);
    return () => {
      socket.off("demo_DT", handleOneMin);
    };
  }, []);
  // console.log("timerstimers",typeof timeLeft)
  const updateRandomPlayers = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    setRandomPlayers(shuffledPlayers.slice(0, 6));
  };
  useEffect(() => {
    const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    setRandomNumber(number)
    setStartAnimationUser(true)
    updateRandomPlayers()
    setIsAnimating(false)

  }, []);

  useEffect(() => {
    let timeoutId;
    let timeoutImgId;
    if (timeLeft === 30) {
      const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      setRandomNumber(number)
      betResult()
      setCoinAnimation(true)
      setIsAnimating(true);
      setSlideImageStart(2)
      timeoutImgId = setTimeout(() => {
        setSlideImageStart(3);
      }, 2000);
      setFlipCards(false);
      setShowFlipCards(false);
    }
    if (timeLeft === 29) {
      setStartAnimationZero(true)
      setStartAnimationFive(true)
      setStartAnimationUser(true)
      setIsAnimating(false);
      updateRandomPlayers();
    }
    if (timeLeft === 28) {
      setStartAnimationZero(false)
      setStartAnimationOne(true)
      setStartAnimationFour(true)
      setStartAnimationFive(false)
      setSlideImageStart(1)
    }
    if (timeLeft === 27) {
      setstartbetImage(true)
    }
    if (timeLeft === 25) {
      setStartAnimationOne(false)
      setStartAnimationTwo(true)
      setStartAnimationThree(true)
      setStartAnimationFour(false)
      setSlideImageStart(1)
      setstartbetImage(false)

    }
    if (timeLeft === 23) {
      setStartAnimationZero(true)
      setStartAnimationTwo(false)
      setStartAnimationThree(false)
      setStartAnimationFive(true)
    }
    if (timeLeft === 20) {
      setStartAnimationOne(true)
      setStartAnimationZero(false)
      setStartAnimationFive(false)
      setStartAnimationFour(true)
    }
    if (timeLeft === 18) {
      setStartAnimationOne(false)
      setStartAnimationTwo(true)
      setStartAnimationThree(true)
      setStartAnimationFour(false)
    }
    if (timeLeft === 15) {
      setStartAnimationTwo(false)
      setStartAnimationZero(true)
      setStartAnimationFive(true)
      setStartAnimationThree(false)
    }
    if (timeLeft === 11) {
      setStopbetImage(true);
    }
    if (timeLeft === 10) {
      setStopbetImage(false)
      setStartAnimationZero(false)
      setStartAnimationFive(false)
      setStartAnimationCoin(0);
      setRandomPositionsFive({});
      setRandomPositionsTen({});
      setRandomPositionsFifty({});
      setRandomPositionsHundred({});
      setRandomPositionsFiveHundred({});
      setRandomPositionsThousand({});
      setRandomPositionsDragonFive({});
      setRandomPositionsDragonTen({});
      setRandomPositionsDragonFifty({});
      setRandomPositionsDragonHundred({});
      setRandomPositionsDragonFiveHundred({});
      setRandomPositionsDragonThousand({});
      setRandomPositionsTigerFive({});
      setRandomPositionsTigerTen({});
      setRandomPositionsTigerFifty({});
      setRandomPositionsTigerHundred({});
      setRandomPositionsTigerFiveHundred({});
      setRandomPositionsTigerThousand({});

      // Clear the displayed values
      updateBetValue("tieBetValue", setTieBetValue);
      updateBetValue("dragonBetValue", setDragonBetValue);
      updateBetValue("tigerBetValue", setTigerBetValue);
      setCoinAnimation(false)
      setStartAnimationUser(false)
      setStartAnimationZero(false)
    }
    if (timeLeft === 7) {
      betResultAnnouncement()
    }
    if (timeLeft === 6) {
      setFlipCards(true);
    }
    if (timeLeft === 2) {
      setShowWinner(true)
      profileDetails(userId)
    }
    if (timeLeft === 1) {
      setShowWinner(false)
      setStartAnimationOne(false)
      setStartAnimationCoin(0);
      setRandomPositionsFive({});
      setRandomPositionsTen({});
      setRandomPositionsFifty({});
      setRandomPositionsHundred({});
      setRandomPositionsFiveHundred({});
      setRandomPositionsThousand({});
      setRandomPositionsDragonFive({});
      setRandomPositionsDragonTen({});
      setRandomPositionsDragonFifty({});
      setRandomPositionsDragonHundred({});
      setRandomPositionsDragonFiveHundred({});
      setRandomPositionsDragonThousand({});
      setRandomPositionsTigerFive({});
      setRandomPositionsTigerTen({});
      setRandomPositionsTigerFifty({});
      setRandomPositionsTigerHundred({});
      setRandomPositionsTigerFiveHundred({});
      setRandomPositionsTigerThousand({});
       setBetAmount(null)
      localStorage.removeItem("tieBetValue");
      localStorage.removeItem("dragonBetValue");
      localStorage.removeItem("tigerBetValue");
      // Clear the displayed values
      updateBetValue("tieBetValue", setTieBetValue);
      updateBetValue("dragonBetValue", setDragonBetValue);
      updateBetValue("tigerBetValue", setTigerBetValue);
    }
   
    if (flipCards) {
      timeoutId = setTimeout(() => {
        setShowFlipCards(true);
      }, 500);
    }
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutImgId);
    };

  }, [timeLeft, flipCards, isAnimating, slideImageStart]);
  const leftPlayers = randomPlayers.slice(0, 3)
  const rightPlayers = randomPlayers.slice(3)
  const allUserImages = [
    assets.icons.ic_online_user, assets.chips.tenL, assets.chips.fiveL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.fiftyL,
    assets.chips.tenL, assets.chips.hundredL, assets.chips.fiveL, assets.chips.fiveHundredL, assets.chips.fiftyL,
    assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL,
    assets.chips.thousandL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.tenL, assets.chips.fiveHundredL,
    assets.chips.hundredL, assets.chips.fiveL, assets.chips.thousandL, assets.chips.tenL, assets.chips.fiftyL,
    assets.chips.hundredL, assets.chips.tenL, assets.chips.fiveL, assets.chips.fiveHundredL, assets.chips.fiftyL,
    assets.chips.tenL, assets.chips.hundredL, assets.chips.fiftyL, assets.chips.thousandL, assets.chips.fiveHundredL,
    assets.chips.hundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.fiveHundredL, assets.chips.tenL,
    assets.chips.fiveHundredL, assets.chips.hundredL, assets.chips.thousandL, assets.chips.tenL, assets.chips.fiftyL,
    assets.chips.fiveHundredL, assets.chips.hundredL, assets.chips.fiveL, assets.chips.tenL, assets.chips.fiftyL,
    assets.chips.fiveHundredL, assets.chips.tenL, assets.chips.thousandL, assets.chips.hundredL, assets.chips.fiveL,
    assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.tenL, assets.chips.fiveHundredL,
    assets.chips.fiftyL, assets.chips.thousandL, assets.chips.hundredL, assets.chips.tenL, assets.chips.fiftyL,
    assets.chips.fiveL, assets.chips.fiveHundredL, assets.chips.tenL, assets.chips.hundredL, assets.chips.fiftyL,
    assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.fiftyL, assets.chips.hundredL,
    assets.chips.fiveHundredL, assets.chips.tenL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.hundredL,
    assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.tenL,
    assets.chips.thousandL, assets.chips.fiftyL, assets.chips.tenL, assets.chips.hundredL, assets.chips.fiveHundredL,
    assets.chips.hundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveL,
    assets.chips.fiftyL, assets.chips.tenL, assets.chips.fiveHundredL, assets.chips.hundredL, assets.chips.fiftyL,
    assets.chips.tenL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.fiveL, assets.chips.fiftyL,
    assets.chips.tenL, assets.chips.fiveHundredL, assets.chips.hundredL, assets.chips.tenL, assets.chips.thousandL,
    assets.chips.fiftyL, assets.chips.tenL, assets.chips.hundredL, assets.chips.fiveL, assets.chips.fiveHundredL,
    assets.chips.thousandL, assets.chips.hundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL,
    assets.chips.tenL, assets.chips.fiveL, assets.chips.thousandL, assets.chips.fiftyL, assets.chips.hundredL,
    assets.chips.fiveHundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL,
    assets.chips.fiveL, assets.chips.hundredL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.fiveHundredL,
    assets.chips.tenL, assets.chips.thousandL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.tenL,
    assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.icons.ic_online_user
  ];
  const imageZeroPlayer = [assets.chips.tenL, assets.chips.fiveL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.fiftyL,
  assets.chips.tenL, assets.chips.hundredL, assets.chips.fiveL, assets.chips.fiveHundredL, assets.chips.fiftyL,
  assets.chips.hundredL, assets.chips.fiveHundredL,]
  const imageListOfFive = Array(100).fill(assets.chips.fiveL);
  const imageListOfTen = Array(100).fill(assets.chips.tenL);
  const imageListOfFifty = Array(100).fill(assets.chips.fiftyL);
  const imageListOfHundred = Array(100).fill(assets.chips.hundredL);
  const imageListOfFiveHundred = Array(100).fill(assets.chips.fiveHundredL);
  const imageListOfThousand = Array(100).fill(assets.chips.thousandL);

  // Update the state whenever the component mounts or localStorage changes
  // Generalized function to update the bet values
  const updateBetValue = (betType, setBetValue) => {
    const storedValue = parseInt(localStorage.getItem(betType) || 0);
    setBetValue(storedValue);
  };

  useEffect(() => {
    updateBetValue("tieBetValue", setTieBetValue);
    updateBetValue("dragonBetValue", setDragonBetValue);
    updateBetValue("TigerBetValue", setTigerBetValue);
  }, []);
  const tieCoinConfigs = {
    5: {
      indices: translatedIndicesFive,
      positions: positionsTieFive,
      usedPositions: usedPositionsFive,
      setIndices: setTranslatedIndicesFive,
      setRandomPositions: setRandomPositionsFive,
      setUsedPositions: setUsedPositionsFive,
      animation: 1,
    },
    10: {
      indices: translatedIndicesTen,
      positions: positionsTieTen,
      usedPositions: usedPositionsTen,
      setIndices: setTranslatedIndicesTen,
      setRandomPositions: setRandomPositionsTen,
      setUsedPositions: setUsedPositionsTen,
      animation: 2,
    },
    50: {
      indices: translatedIndicesFifty,
      positions: positionsTieFifty,
      usedPositions: usedPositionsFifty,
      setIndices: setTranslatedIndicesFifty,
      setRandomPositions: setRandomPositionsFifty,
      setUsedPositions: setUsedPositionsFifty,
      animation: 3,
    },
    100: {
      indices: translatedIndicesHundred,
      positions: positionsTieHundred,
      usedPositions: usedPositionsHundred,
      setIndices: setTranslatedIndicesHundred,
      setRandomPositions: setRandomPositionsHundred,
      setUsedPositions: setUsedPositionsHundred,
      animation: 4,
    },
    500: {
      indices: translatedIndicesFiveHundred,
      positions: positionsTieFiveHundred,
      usedPositions: usedPositionsFiveHundred,
      setIndices: setTranslatedIndicesFiveHundred,
      setRandomPositions: setRandomPositionsFiveHundred,
      setUsedPositions: setUsedPositionsFiveHundred,
      animation: 5,
    },
    1000: {
      indices: translatedIndicesThousand,
      positions: positionsTieThousand,
      usedPositions: usedPositionsThousand,
      setIndices: setTranslatedIndicesThousand,
      setRandomPositions: setRandomPositionsThousand,
      setUsedPositions: setUsedPositionsThousand,
      animation: 6,
    },
  };
  const dragonCoinConfigs = {
    5: {
      indices: translatedIndicesDragonFive,
      positions: positionsDragonFive,
      usedPositions: usedPositionsDragonFive,
      setIndices: setTranslatedIndicesDragonFive,
      setRandomPositions: setRandomPositionsDragonFive,
      setUsedPositions: setUsedPositionsDragonFive,
      animation: 1,
    },
    10: {
      indices: translatedIndicesDragonTen,
      positions: positionsDragonTen,
      usedPositions: usedPositionsDragonTen,
      setIndices: setTranslatedIndicesDragonTen,
      setRandomPositions: setRandomPositionsDragonTen,
      setUsedPositions: setUsedPositionsDragonTen,
      animation: 2,
    },
    50: {
      indices: translatedIndicesDragonFifty,
      positions: positionsDragonFifty,
      usedPositions: usedPositionsDragonFifty,
      setIndices: setTranslatedIndicesDragonFifty,
      setRandomPositions: setRandomPositionsDragonFifty,
      setUsedPositions: setUsedPositionsDragonFifty,
      animation: 3,
    },
    100: {
      indices: translatedIndicesDragonHundred,
      positions: positionsDragonHundred,
      usedPositions: usedPositionsDragonHundred,
      setIndices: setTranslatedIndicesDragonHundred,
      setRandomPositions: setRandomPositionsDragonHundred,
      setUsedPositions: setUsedPositionsDragonHundred,
      animation: 4,
    },
    500: {
      indices: translatedIndicesDragonFiveHundred,
      positions: positionsDragonFiveHundred,
      usedPositions: usedPositionsDragonFiveHundred,
      setIndices: setTranslatedIndicesDragonFiveHundred,
      setRandomPositions: setRandomPositionsDragonFiveHundred,
      setUsedPositions: setUsedPositionsDragonFiveHundred,
      animation: 5,
    },
    1000: {
      indices: translatedIndicesDragonThousand,
      positions: positionsDragonThousand,
      usedPositions: usedPositionsDragonThousand,
      setIndices: setTranslatedIndicesDragonThousand,
      setRandomPositions: setRandomPositionsDragonThousand,
      setUsedPositions: setUsedPositionsDragonThousand,
      animation: 6,
    },
  };
  const tigerCoinConfigs = {
    5: {
      indices: translatedIndicesTigerFive,
      positions: positionsTigerFive,
      usedPositions: usedPositionsTigerFive,
      setIndices: setTranslatedIndicesTigerFive,
      setRandomPositions: setRandomPositionsTigerFive,
      setUsedPositions: setUsedPositionsTigerFive,
      animation: 1,
    },
    10: {
      indices: translatedIndicesTigerTen,
      positions: positionsTigerTen,
      usedPositions: usedPositionsTigerTen,
      setIndices: setTranslatedIndicesTigerTen,
      setRandomPositions: setRandomPositionsTigerTen,
      setUsedPositions: setUsedPositionsTigerTen,
      animation: 2,
    },
    50: {
      indices: translatedIndicesTigerFifty,
      positions: positionsTigerFifty,
      usedPositions: usedPositionsTigerFifty,
      setIndices: setTranslatedIndicesTigerFifty,
      setRandomPositions: setRandomPositionsTigerFifty,
      setUsedPositions: setUsedPositionsTigerFifty,
      animation: 3,
    },
    100: {
      indices: translatedIndicesTigerHundred,
      positions: positionsTigerHundred,
      usedPositions: usedPositionsTigerHundred,
      setIndices: setTranslatedIndicesTigerHundred,
      setRandomPositions: setRandomPositionsTigerHundred,
      setUsedPositions: setUsedPositionsTigerHundred,
      animation: 4,
    },
    500: {
      indices: translatedIndicesTigerFiveHundred,
      positions: positionsTigerFiveHundred,
      usedPositions: usedPositionsTigerFiveHundred,
      setIndices: setTranslatedIndicesTigerFiveHundred,
      setRandomPositions: setRandomPositionsTigerFiveHundred,
      setUsedPositions: setUsedPositionsTigerFiveHundred,
      animation: 5,
    },
    1000: {
      indices: translatedIndicesTigerThousand,
      positions: positionsTigerThousand,
      usedPositions: usedPositionsTigerThousand,
      setIndices: setTranslatedIndicesTigerThousand,
      setRandomPositions: setRandomPositionsTigerThousand,
      setUsedPositions: setUsedPositionsTigerThousand,
      animation: 6,
    },
  };

  // Generalized function to handle bet updates in the bet box components
  const handleBetUpdate = (betType, selectedValue, betAmount, setBetValue, coinConfig) => {
    // Update bet value in both state and localStorage
    setBetValue((prev) => {
      const newBetValue = prev + (selectedValue + Number(betAmount));
      localStorage.setItem(betType, newBetValue);
      return newBetValue;
    });
 if (selectedCoins) {
    // Animation and position updates (generic for all bets)
    setStartAnimationCoin(coinConfig.animation);

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * coinConfig.positions.length);
    } while (coinConfig.usedPositions.has(randomIndex));

    coinConfig.setIndices((prev) => [...prev, coinConfig.indices.length]);
    coinConfig.setRandomPositions((prev) => ({
      ...prev,
      [coinConfig.indices.length]: randomIndex,
    }));
    coinConfig.setUsedPositions((prev) => new Set(prev).add(randomIndex));
  }};

  // Example of updating the tieBetBox, dragonBetBox, and tigerBetBox
  const TieBetBox = () => {
    setSelectedBetBox(3);
    betHandler(userId, 3)
    // console.log("userId, 3userId, 3", userId, 3)
    const selectedConfig = tieCoinConfigs[selectedCoins];
    handleBetUpdate("tieBetValue", selectedCoins, betAmount, setTieBetValue, selectedConfig);
  };

  const DragonBetBox = () => {
    setSelectedBetBox(1);
    betHandler(userId, 1)
    const selectedConfig = dragonCoinConfigs[selectedCoins];
    handleBetUpdate("dragonBetValue", selectedCoins, betAmount, setDragonBetValue, selectedConfig);
  };

  const TigerBetBox = () => {
    setSelectedBetBox(2);
    betHandler(userId, 2)
    const selectedConfig = tigerCoinConfigs[selectedCoins];
    handleBetUpdate("tigerBetValue", selectedCoins, betAmount, setTigerBetValue, selectedConfig);
  };
  // console.log("selectedCoins", selectedCoins)
  // const reset = () => {
  //   setStartAnimationOne(false)
  //   setStartAnimationCoin(0);
  //   setRandomPositionsFive({});
  //   setRandomPositionsTen({});
  //   setRandomPositionsFifty({});
  //   setRandomPositionsHundred({});
  //   setRandomPositionsFiveHundred({});
  //   setRandomPositionsThousand({});
  //   setRandomPositionsDragonFive({});
  //   setRandomPositionsDragonTen({});
  //   setRandomPositionsDragonFifty({});
  //   setRandomPositionsDragonHundred({});
  //   setRandomPositionsDragonFiveHundred({});
  //   setRandomPositionsDragonThousand({});
  //   setRandomPositionsTigerFive({});
  //   setRandomPositionsTigerTen({});
  //   setRandomPositionsTigerFifty({});
  //   setRandomPositionsTigerHundred({});
  //   setRandomPositionsTigerFiveHundred({});
  //   setRandomPositionsTigerThousand({});
  //   localStorage.removeItem("tieBetValue");
  //   localStorage.removeItem("dragonBetValue");
  //   localStorage.removeItem("tigerBetValue");

  //   // Clear the displayed values
  //   updateBetValue("tieBetValue", setTieBetValue);
  //   updateBetValue("dragonBetValue", setDragonBetValue);
  //   updateBetValue("tigerBetValue", setTigerBetValue);
  // };
  const tieCoinValues = [
    { value: 5, imageList: imageListOfFive, translatedIndices: translatedIndicesFive, positions: positionsTieFive, randomPositions: randomPositionsFive, startAnimationCoin: 1, chipL: assets.chips.fiveL, chipD: assets.chips.fiveD },
    { value: 10, imageList: imageListOfTen, translatedIndices: translatedIndicesTen, positions: positionsTieTen, randomPositions: randomPositionsTen, startAnimationCoin: 2, chipL: assets.chips.tenL, chipD: assets.chips.tenD },
    { value: 50, imageList: imageListOfFifty, translatedIndices: translatedIndicesFifty, positions: positionsTieFifty, randomPositions: randomPositionsFifty, startAnimationCoin: 3, chipL: assets.chips.fiftyL, chipD: assets.chips.fiftyD },
    { value: 100, imageList: imageListOfHundred, translatedIndices: translatedIndicesHundred, positions: positionsTieHundred, randomPositions: randomPositionsHundred, startAnimationCoin: 4, chipL: assets.chips.hundredL, chipD: assets.chips.hundredD },
    { value: 500, imageList: imageListOfFiveHundred, translatedIndices: translatedIndicesFiveHundred, positions: positionsTieFiveHundred, randomPositions: randomPositionsFiveHundred, startAnimationCoin: 5, chipL: assets.chips.fiveHundredL, chipD: assets.chips.fiveHundredD },
    { value: 1000, imageList: imageListOfThousand, translatedIndices: translatedIndicesThousand, positions: positionsTieThousand, randomPositions: randomPositionsThousand, startAnimationCoin: 6, chipL: assets.chips.thousandL, chipD: assets.chips.thousandD }
  ];

  const dragonCoinValues = [
    { value: 5, imageList: imageListOfFive, translatedIndices: translatedIndicesDragonFive, positions: positionsDragonFive, randomPositions: randomPositionsDragonFive, startAnimationCoin: 1, chipL: assets.chips.fiveL, chipD: assets.chips.fiveD },
    { value: 10, imageList: imageListOfTen, translatedIndices: translatedIndicesDragonTen, positions: positionsDragonTen, randomPositions: randomPositionsDragonTen, startAnimationCoin: 2, chipL: assets.chips.tenL, chipD: assets.chips.tenD },
    { value: 50, imageList: imageListOfFifty, translatedIndices: translatedIndicesDragonFifty, positions: positionsDragonFifty, randomPositions: randomPositionsDragonFifty, startAnimationCoin: 3, chipL: assets.chips.fiftyL, chipD: assets.chips.fiftyD },
    { value: 100, imageList: imageListOfHundred, translatedIndices: translatedIndicesDragonHundred, positions: positionsDragonHundred, randomPositions: randomPositionsDragonHundred, startAnimationCoin: 4, chipL: assets.chips.hundredL, chipD: assets.chips.hundredD },
    { value: 500, imageList: imageListOfFiveHundred, translatedIndices: translatedIndicesDragonFiveHundred, positions: positionsDragonFiveHundred, randomPositions: randomPositionsDragonFiveHundred, startAnimationCoin: 5, chipL: assets.chips.fiveHundredL, chipD: assets.chips.fiveHundredD },
    { value: 1000, imageList: imageListOfThousand, translatedIndices: translatedIndicesDragonThousand, positions: positionsDragonThousand, randomPositions: randomPositionsDragonThousand, startAnimationCoin: 6, chipL: assets.chips.thousandL, chipD: assets.chips.thousandD }
  ];
  const tigerCoinValues = [
    { value: 5, imageList: imageListOfFive, translatedIndices: translatedIndicesTigerFive, positions: positionsTigerFive, randomPositions: randomPositionsTigerFive, startAnimationCoin: 1, chipL: assets.chips.fiveL, chipD: assets.chips.fiveD },
    { value: 10, imageList: imageListOfTen, translatedIndices: translatedIndicesTigerTen, positions: positionsTigerTen, randomPositions: randomPositionsTigerTen, startAnimationCoin: 2, chipL: assets.chips.tenL, chipD: assets.chips.tenD },
    { value: 50, imageList: imageListOfFifty, translatedIndices: translatedIndicesTigerFifty, positions: positionsTigerFifty, randomPositions: randomPositionsTigerFifty, startAnimationCoin: 3, chipL: assets.chips.fiftyL, chipD: assets.chips.fiftyD },
    { value: 100, imageList: imageListOfHundred, translatedIndices: translatedIndicesTigerHundred, positions: positionsTigerHundred, randomPositions: randomPositionsTigerHundred, startAnimationCoin: 4, chipL: assets.chips.hundredL, chipD: assets.chips.hundredD },
    { value: 500, imageList: imageListOfFiveHundred, translatedIndices: translatedIndicesTigerFiveHundred, positions: positionsTigerFiveHundred, randomPositions: randomPositionsTigerFiveHundred, startAnimationCoin: 5, chipL: assets.chips.fiveHundredL, chipD: assets.chips.fiveHundredD },
    { value: 1000, imageList: imageListOfThousand, translatedIndices: translatedIndicesTigerThousand, positions: positionsTigerThousand, randomPositions: randomPositionsTigerThousand, startAnimationCoin: 6, chipL: assets.chips.thousandL, chipD: assets.chips.thousandD }
  ];

  let coinData;
  if (selectedBetBox === 2) {
    coinData = dragonCoinValues
  } else if (selectedBetBox === 3) {
    coinData = tigerCoinValues
  } else {
    coinData = tieCoinValues
  }

  //  profile api start
  const navigate = useNavigate()
  const [myDetails, setMyDetails] = useState(null)
  const userId = localStorage.getItem("userId");
  // console.log("userId kyu",typeof userId)
  const profileDetails = async (userId) => {
    // if (!userId) {
    //   toast.error("User not logged in");
    //   navigate("/login");
    //   return;
    // }
    try {
      const res = await axios.get(`${profileApi}${userId}`);
      // console.log("resrereresr",res)
      if (res?.data?.success === 200) {
        setMyDetails(res?.data?.data)
        // dispatch(setProfileDetails({ total_wallet: res.data.total_wallet }))
      }
    } catch (err) {
      toast.error(err);
    }
  };
  // console.log("myDetails",myDetails)
  useEffect(() => {
    if (userId) {
      profileDetails(userId);
    }
  }, [userId]);
  // profile ended

  // bet api started
  const betHandler = async (userId, number) => {
       const amount = selectedCoins ? selectedCoins : betAmount;

    const payload = {
      userid: userId,
      game_id: 10,
      json: [
        { number, amount },
      ]
    }
    try {
      const response = await axios.post(apis?.dragon_bet, payload)
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message)
        profileDetails(userId);
         const currentSno =
          betResultData.length > 0 &&Number( betResultData[0]?.games_no) + 1;
        const va = localStorage.getItem("gameon_DT");
        if (va !== currentSno) {
          localStorage.setItem("gameon_DT", `${currentSno}`);
        }
      }
    } catch (err) {
      console.log("error bet bete ", err)
    }
  }

  // winner gif list
  const winnerImages = {
    1: gif_dragon_animated,
    2: gif_tiger_animated,
    3: tieWon,
  };
  // list images
  const images = {
    1: ic_dt_d,
    2: ic_dt_t,
    3: ic_dt_tie,
  };

  const betResult = async () => {

    try {
      const response = await axios.get(`${apis?.dragonResults}?game_id=10&limit=11`)
      // console.log("response result", response)
      if (response?.data?.status === 200) {
        profileDetails()
        setBetResultData(response?.data?.data)
      }
    } catch (err) {
      console.log("error bet bete ", err)
    }
  }
  const betResultChecker = async () => {
   
    try {
      const response = await axios.get(`${apis?.dragonResults}?game_id=10&limit=11`)
      // console.log("response result", response)
      if (response?.data?.status === 200) {
        profileDetails()
         const sr = Number(
          response?.data?.data[0] && response?.data?.data[0]?.games_no
        );
        const localSr = localStorage.getItem("gameon_DT");
        // console.log("srsrsrsrsr",sr,localSr)
        if (Number(sr) !== Number(localSr-1)) {
          // alert("hey")
          updateBetValue("tieBetValue", setTieBetValue);
          updateBetValue("dragonBetValue", setDragonBetValue);
          updateBetValue("tigerBetValue", setTigerBetValue);
          localStorage.removeItem("tieBetValue");
          localStorage.removeItem("dragonBetValue");
          localStorage.removeItem("tigerBetValue");
        }
      }
    } catch (err) {
      console.log("error bet bete ", err)
    }
  }
  const betResultAnnouncement = async () => {
  
    try {
      const response = await axios.get(`${apis?.dragonResults}?game_id=10&limit=1`)
      if (response?.data?.status === 200) {
        setBetResultDataAnnouncement(response?.data?.data[0])
      }
    } catch (err) {
      console.log("error bet bete ", err)
    }
  }
  useEffect(() => {
    betResult()
    betResultChecker()
  }, [])


  return (
    <>
      <div
        className="bg-cover w-full text-xs font-bold bg-center h-[94.5vh] relative"
        style={{
          backgroundImage: `url(${assets.mainbg})`,
        }}
      >
        {/* <button onClick={() => betHandler(userId)} >reset</button> */}
        {/* card div */}
        <div
          className={`w-full z-40 flex items-center justify-between relative`}
        >
          {/* <div className={`w-full z-40 flex items-center justify-between relative  ${isAnimating && "overflow-hidden"}`}> */}
          <div
            className={`transition-transform absolute top-0 left-0 duration-1000 ${
              isAnimating
                ? "-translate-x-[100%]"
                : "translate-x-[30vw] xsm:translate-x-[8rem]"
            }`}
          >
            <img
              className={`${
                showFlipCards
                  ? "w-14 h-[4rem] 2xl:h-[4.5rem]"
                  : "w-16 h-[4.5rem] 2xl:h-[5rem]"
              } transition-transform duration-1000 ${
                flipCards ? "transform rotate-y-360" : ""
              }`}
              src={
                showFlipCards
                  ? assets.cards[
                      betResultDataAnnouncement?.json?.length > 0
                        ? JSON.parse(betResultDataAnnouncement?.json)[0] - 1
                        : ""
                    ]
                  : fire_card
              }
              alt="Fire Card Left"
            />
          </div>
          <div
            className={`transition-transform absolute top-0 right-0 duration-1000 ${
              isAnimating
                ? "translate-x-[100%] overflow-hidden"
                : "-translate-x-[28.5vw] xsm:-translate-x-[7.5rem]"
            }`}
          >
            <img
              className={`${isAnimating && "overflow-hidden"} ${
                showFlipCards
                  ? "w-14 h-[4rem] 2xl:h-[4.5rem]"
                  : "w-16 h-[4.5rem] 2xl:h-[5rem]"
              } transition-transform duration-1000 ${
                flipCards ? "transform rotate-y-360" : ""
              }`}
              src={
                showFlipCards && betResultDataAnnouncement?.json?.length > 0
                  ? assets.cards[
                      JSON.parse(betResultDataAnnouncement?.json)[1] - 1
                    ]
                  : fire_card
              }
              alt="Fire Card Right"
            />
          </div>
        </div>
        {/* Period and Timer */}
        <div className="grid grid-cols-2 absolute w-full top-[19.5vh] 2xl:top-[19.7vh] px-8 font-bold ">
          <div className="col-span-1 text-nowrap flex items-center justify-start ">
            <p className="text-gray">Period :</p>
            <p className="text-xs text-center">
              &nbsp;
              {betResultData.length > 0
                ? Number(betResultData[0]?.games_no) + 1
                : ""}
            </p>
          </div>
          <div className="col-span-1 text-gold text-sm flex items-center justify-end ">
            <p>{timeLeft <= 10 ? "Showdown..." : "Bet Time..."}&nbsp;&nbsp;</p>
            <p>{timeLeft}</p>
          </div>
        </div>
        {/* slider images */}
        <div
          className={`z-50 absolute top-[35vh] w-full transition-transform duration-1000 
        ${
          slideImageStart === 2
            ? "translate-x-0"
            : slideImageStart === 3
            ? "translate-x-[100%]"
            : "-translate-x-[100%]"
        }`}
        >
          <img className="w-full h-[7rem]" src={dvst} alt="slider" />
        </div>
        {/* start bet image */}
        {startbetImage && (
          <div className="w-full z-50 absolute top-[30vh] flex items-center justify-center">
            <img src={Startbetting} alt="sd" />
          </div>
        )}
        {/* stop bet image */}
        {stopbetImage && (
          <div className="w-full z-50 absolute top-[30vh] flex items-center justify-center">
            <img src={stopbetting} alt="sd" />
          </div>
        )}
        {showWinner && (
          <div className="w-full z-50 absolute top-[30vh] flex items-center justify-center">
            {betResultDataAnnouncement?.number && (
              <img
                src={
                  winnerImages[JSON.parse(betResultDataAnnouncement?.number)]
                }
                alt="sd"
              />
            )}
          </div>
        )}
        {/* list images div */}
        <div className="px-1 xsm:px-3 flex items-center justify-end w-full absolute top-[23.6vh] 2xl:top-[23.8vh]">
          <div className="flex mr-2">
            {betResultData?.map((item, i) => {
              return (
                <img
                  key={i}
                  className="w-7 h-7"
                  src={images[item?.number]}
                  alt="sd"
                />
              );
            })}
          </div>
          <img className="w-7 h-7 " src={ic_arrow_zigzag} alt="sd" />
        </div>
        {/* tie betting box */}
        <div className="z-50 w-full flex justify-center absolute top-[31vh]">
          <button
            disabled={timeLeft <= 10}
            onClick={TieBetBox}
            className="w-[87%] xsm:w-[97%] h-20 xsm:h-24"
          ></button>
        </div>
        {/* tie box bet amount */}
        <div className="absolute w-full top-[42vh] flex justify-center">
          <p className="text-center text-gold text-sm font-bold">
            {Number(tieBetValue).toFixed(2)}
          </p>
        </div>
        {/* dragon betting box */}
        <div className="w-full flex justify-center absolute top-[46.5vh]">
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              disabled={timeLeft <= 10}
              onClick={DragonBetBox}
              className=" z-50 ml-3 xsm:ml-0 col-span-1 w-[90%] xsm:w-[97%] h-44 xsm:h-56"
            ></button>
            <button
              disabled={timeLeft <= 10}
              onClick={TigerBetBox}
              className="z-50 col-span-1 w-[87%] xsm:w-[97%] h-44 xsm:h-56 "
            ></button>
          </div>
        </div>
        {/* dragon box bet amount */}
        <div className="grid grid-cols-2 w-full absolute top-[72vh]">
          <div className="col-span-1 w-full flex justify-center">
            <p className="text-center text-gold text-sm font-bold">
              {Number(dragonBetValue).toFixed(2)}
            </p>
          </div>
          {/* tiger box bet amount */}
          <div className="col-span-1 w-full flex justify-center">
            <p className="text-center text-gold text-sm font-bold">
              {Number(tigerBetValue).toFixed(2)}
            </p>
          </div>
        </div>
        {/* Random Players */}
        <div className="z-40 absolute top-[32vh] w-full flex items-center justify-between px-1 ">
          <div className="">
            <div>
              <div
                className={`bg-center flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${leftPlayers[0]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={leftPlayers[0]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationZero
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsZero[index].x}vh`,
                        "--y": `${positionsZero[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {leftPlayers[0]?.name}...
              </p>
            </div>
            <div>
              <div
                className={`bg-center mt-10 flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${leftPlayers[1]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={leftPlayers[1]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationOne
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsOne[index].x}vh`,
                        "--y": `${positionsOne[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {leftPlayers[1]?.name}...
              </p>
            </div>
            <div>
              <div
                className={`bg-center mt-10 flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${leftPlayers[2]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={leftPlayers[2]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationTwo
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsTwo[index].x}vh`,
                        "--y": `${positionsTwo[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {leftPlayers[2]?.name}...
              </p>
            </div>
          </div>
          <div className="">
            <div>
              <div
                className={`bg-center flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${rightPlayers[0]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={rightPlayers[0]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationThree
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsThree[index].x}vh`,
                        "--y": `${positionsThree[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {rightPlayers[0]?.name}...
              </p>
            </div>

            <div>
              <div
                className={`bg-center mt-10 flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${rightPlayers[1]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={rightPlayers[1]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationFour
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsFour[index].x}vh`,
                        "--y": `${positionsFour[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {rightPlayers[1]?.name}...
              </p>
            </div>
            <div>
              <div
                className={`bg-center mt-10 flex items-center justify-center bg-cover w-16 h-16`}
                style={{
                  backgroundImage: `url(${rightPlayers[2]?.bgImage})`,
                }}
              >
                <img
                  className="w-12 z-50 h-12 rounded-full"
                  src={rightPlayers[2]?.img}
                  alt="ds"
                />
                {imageZeroPlayer?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute z-10 w-8 h-8 rounded-full"
                      style={{
                        animation: startAnimationFive
                          ? `translate-animation 500ms ease-in-out ${
                              Math.floor(index / 1) * 0.1
                            }s forwards`
                          : "none",
                        transform:
                          index === imageZeroPlayer.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `${positionsFive[index].x}vh`,
                        "--y": `${positionsFive[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="bg-black opacity-60 text-center rounded-xl">
                {rightPlayers[2]?.name}...
              </p>
            </div>
          </div>
        </div>
        {/* wallet div */}
        <div className="w-full absolute bottom-[10.7vh] xsm:bottom-[11vh] 2xl:bottom-[6.2rem] flex flex-col items-center">
          <div className="grid grid-cols-3 w-full">
            <div className="col-span-1"></div>
            <div className="text-gold mr-2 flex items-center justify-center col-span-1 mt-2 -mb-3">
              {myDetails?.total_wallet}
            </div>
            <div className="col-span-1 mt-2">
              <div className="flex justify-end px-1 items-center">
                {allUserImages?.map((color, index) => {
                  return (
                    <img
                      src={color}
                      alt={`Chip ${index}`}
                      key={index}
                      className="absolute w-8 h-8 rounded-full"
                      style={{
                        animation:
                          startAnimationUser &&
                          index !== 0 &&
                          index !== allUserImages.length - 1
                            ? `translate-animation 500ms ease-in-out ${
                                Math.floor(index / 1) * 0.1
                              }s forwards`
                            : "none",
                        transform:
                          index === allUserImages.length - 1
                            ? "none"
                            : "translate(0, 0)",
                        "--x": `-${positionsUser[index].x}vh`,
                        "--y": `-${positionsUser[index].y}vh`,
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-gold absolute right-16">{randomNumber}</p>
            </div>
          </div>
        </div>
        <div className=" flex items-center h-6 z-50 left-[14vh] w-[135px] bottom-[7vh] xsm:bottom-[9vh] bg-[#666666] absolute xsm:left-[0vh] border-black border-[0.5px] rounded-3xl px-2">
          <span className="text-white text-xs pr-1">₹</span>
          <input
            inputMode="numeric"
            placeholder="Enter amount"
            type="text"
            value={betAmount}
            onClick={(e) => {
              const val = e.target.value;
              setSelectedCoins(null);

              const wallet = Number(myDetails?.total_wallet || 0);
              const num = Number(val);
              if (/^\d*$/.test(val) && (val === "" || num <= wallet)) {
                setBetAmount(val);
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCoins(null);

              const wallet = Number(myDetails?.total_wallet || 0);
              const num = Number(val);
              if (/^\d*$/.test(val) && (val === "" || num <= wallet)) {
                setBetAmount(val);
              }
            }}
            onBlur={() => {
              const wallet = Number(myDetails?.total_wallet || 0);
              if (betAmount !== "") {
                const num = parseInt(betAmount, 10);
                if (!isNaN(num)) {
                  const clamped = Math.min(num, wallet);
                  setBetAmount(clamped.toString());
                }
              }
            }}
            className="flex-1 bg-transparent no-spinner placeholder:text-[10px] text-white text-xs text-left outline-none"
          />
        </div>

        {/* coins */}
        <div className="absolute bottom-2 w-full flex justify-center gap-2">
          {coinData?.map((coin) => (
            <button
              key={coin.value}
              className={`${
                selectedCoins === coin.value ? "bg-green -mt-2" : ""
              } flex items-center justify-center rounded-full h-12 w-12`}
              onClick={() => {
                // console.log("betamont coin", betAmount);
                setBetAmount(null);
                setSelectedCoins(coin.value);
                setBetAmount(coin.value.toString());
              }}
            >
              <img
                onClick={() => setStartAnimationCoin(coin.startAnimationCoin)}
                className={`w-10 h-10 z-50 transition-all duration-300 ${
                  selectedCoins === coin.value ? "animate-zoom" : ""
                }`}
                src={selectedCoins === coin.value ? coin.chipL : coin.chipD}
                alt={`${coin.value}D`}
              />
              {coin.imageList?.map((color, index) => (
                <img
                  key={index}
                  src={color}
                  alt={`Chip ${index}`}
                  className="absolute z-10 w-8 h-8 rounded-full"
                  style={{
                    animation:
                      coin.translatedIndices.includes(index) && coinAnimation
                        ? `translate-animation 500ms ease-in-out forwards`
                        : "none",
                    transform:
                      coin.translatedIndices.includes(index) && coinAnimation
                        ? `translate(${
                            coin.positions[coin.randomPositions[index]]?.x
                          }vh, ${
                            coin.positions[coin.randomPositions[index]]?.y
                          }vh)`
                        : "translate(0, 0)",
                    "--x": `${
                      coin.positions[coin.randomPositions[index]]?.x
                    }vh`,
                    "--y": ` ${
                      coin.positions[coin.randomPositions[index]]?.y
                    }vh`,
                  }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default DragonTigerHome;
