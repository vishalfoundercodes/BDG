import { useEffect, useState } from "react";
import { assets } from "./assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../../utils/apis";
import AnimatedCardDisplay from "./AnimatedCardDisplay";
import { positionsUser } from "./positions";
import Startbetting from "../../assets/dragontiger/Startbetting.png";
import stopbetting from "../../assets/dragontiger/stopbetting.png";
const allUserImages = [
  assets.profile,
  assets.chips.tenL,
  assets.chips.fiveL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.thousandL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.fiveHundredL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.thousandL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiveL,
  assets.chips.fiveHundredL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.hundredL,
  assets.chips.fiftyL,
  assets.chips.thousandL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.thousandL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.thousandL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.fiftyL,
  assets.chips.thousandL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.fiveL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.hundredL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.thousandL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.thousandL,
  assets.chips.fiveL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.fiveHundredL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.tenL,
  assets.chips.hundredL,
  assets.chips.fiveL,
  assets.chips.fiveHundredL,
  assets.chips.thousandL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiveL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.chips.fiveL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.fiveHundredL,
  assets.chips.tenL,
  assets.chips.thousandL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.tenL,
  assets.chips.fiftyL,
  assets.chips.hundredL,
  assets.chips.fiveHundredL,
  assets.profile,
];
import {
  positionsAndarFive,
  positionsBaharFive,
  positionsAndarTen,
  positionsBaharTen,
  positionsAndarHundred,
  positionsBaharHundred,
  positionsAndarFifty,
  positionsBaharFifty,
  positionsAndarFiveHundred,
  positionsBaharFiveHundred,
  positionsAndarThousand,
  positionsBaharThousand,
} from "./positions";
import socket from "../../shared/socket/DragonTigerSocket";
const profileApi = apis.profile;

function AndarBaharHome() {
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(null);
  const [randomNumber, setRandomNumber] = useState(279);
  const [startbetImage, setstartbetImage] = useState(false);
  const [stopbetImage, setStopbetImage] = useState(false);
  const [startWinnerCardImage, setStartWinnerCardImage] = useState(false);
  const [myDetails, setMyDetails] = useState(null);
  const [betResultData, setBetResultData] = useState([]);
  const [betResultDataAnnouncement, setBetResultDataAnnouncement] =
    useState(null);
  const [startAnimationUser, setStartAnimationUser] = useState(false);
  const [startAnimationFireCard, setStartAnimationFireCard] = useState(false);
  const [flipCards, setFlipCards] = useState(false);
  const [showFlipCards, setShowFlipCards] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedCoins, setSelectedCoins] = useState(null);
  const [selectedBetBox, setSelectedBetBox] = useState(null);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [andarBetValue, setAndarBetValue] = useState(() =>
    parseInt(localStorage.getItem("andarBetValue") || selectedCoins)
  );
  const [baharBetValue, setBaharBetValue] = useState(() =>
    parseInt(localStorage.getItem("baharBetValue") || selectedCoins)
  );

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
  const [usedPositionsFiveHundred, setUsedPositionsFiveHundred] = useState(
    new Set()
  );
  const [translatedIndicesFiveHundred, setTranslatedIndicesFiveHundred] =
    useState([]);
  const [randomPositionsFiveHundred, setRandomPositionsFiveHundred] = useState(
    {}
  );
  const [usedPositionsThousand, setUsedPositionsThousand] = useState(new Set());
  const [translatedIndicesThousand, setTranslatedIndicesThousand] = useState(
    []
  );
  const [randomPositionsThousand, setRandomPositionsThousand] = useState({});

  const [usedPositionsBaharFive, setUsedPositionsBaharFive] = useState(
    new Set()
  );
  const [translatedIndicesBaharFive, setTranslatedIndicesBaharFive] = useState(
    []
  );
  const [randomPositionsBaharFive, setRandomPositionsBaharFive] = useState({});
  const [usedPositionsBaharTen, setUsedPositionsBaharTen] = useState(new Set());
  const [translatedIndicesBaharTen, setTranslatedIndicesBaharTen] = useState(
    []
  );
  const [randomPositionsBaharTen, setRandomPositionsBaharTen] = useState({});
  const [usedPositionsBaharFifty, setUsedPositionsBaharFifty] = useState(
    new Set()
  );
  const [translatedIndicesBaharFifty, setTranslatedIndicesBaharFifty] =
    useState([]);
  const [randomPositionsBaharFifty, setRandomPositionsBaharFifty] = useState(
    {}
  );
  const [usedPositionsBaharHundred, setUsedPositionsBaharHundred] = useState(
    new Set()
  );
  const [translatedIndicesBaharHundred, setTranslatedIndicesBaharHundred] =
    useState([]);
  const [randomPositionsBaharHundred, setRandomPositionsBaharHundred] =
    useState({});
  const [usedPositionsBaharFiveHundred, setUsedPositionsBaharFiveHundred] =
    useState(new Set());
  const [
    translatedIndicesBaharFiveHundred,
    setTranslatedIndicesBaharFiveHundred,
  ] = useState([]);
  const [randomPositionsBaharFiveHundred, setRandomPositionsBaharFiveHundred] =
    useState({});
  const [usedPositionsBaharThousand, setUsedPositionsBaharThousand] = useState(
    new Set()
  );
  const [translatedIndicesBaharThousand, setTranslatedIndicesBaharThousand] =
    useState([]);
  const [randomPositionsBaharThousand, setRandomPositionsBaharThousand] =
    useState({});
  const [startAnimationCoin, setStartAnimationCoin] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const handleOneMin = (onemin) => {
      const q = JSON.parse(onemin);

      const { timerBetTime } = q;

      setTimeLeft(Number(timerBetTime));
    };

    socket.on("demo_AB", handleOneMin);

    return () => {
      socket.off("demo_AB", handleOneMin);
    };
  }, []);
  const profileDetails = async (userId) => {
    try {
      const res = await axios.get(`${profileApi}${userId}`);
      //   console.log("rprprrprprprrpprprpr",res)
      if (res?.data?.success === 200) {
        setMyDetails(res?.data?.data);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      profileDetails(userId);
    }
  }, [userId]);

  // list images
  const images = {
    1: assets?.a,
    2: assets?.b,
  };
  const betResult = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${apis?.dragonResults}?game_id=13&limit=9`
      );
      // console.log("response result", response)
      if (response?.data?.status === 200) {
        setBetResultData(response?.data?.data);
      }
    } catch (err) {
      console.log("error bet bete ", err);
    }
  };
  const betResultBetChecker = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${apis?.dragonResults}?game_id=13&limit=9`
      );
    //   console.log("response result", response);
      if (response?.data?.status === 200) {
        const sr = Number(
          response?.data?.data[0] && response?.data?.data[0]?.games_no
        );
        const localSr = localStorage.getItem("gameon_AB");
        console.log("srsrsrsrsrsr",sr,localSr)
        if (Number(sr) !== Number(localSr)) {
          updateBetValue("andarBetValue", setAndarBetValue);
          updateBetValue("baharBetValue", setBaharBetValue);
          localStorage.removeItem("andarBetValue");
          localStorage.removeItem("baharBetValue");
        }
      }
    } catch (err) {
      console.log("error bet bete ", err);
    }
  };

  const betResultAnnouncement = async () => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${apis?.dragonResults}?game_id=13&limit=1`
      );
      //   console.log("announcement", response?.data?.data[0]);
      if (response?.data?.status === 200) {
        setBetResultDataAnnouncement(response?.data?.data[0]);
        profileDetails(userId);
      }
    } catch (err) {
      console.log("error bet bete ", err);
    }
  };

  useEffect(() => {
    let timeoutId;
    let timeoutImgId;
    if (timeLeft === 30) {
      const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      setRandomNumber(number);
      setCoinAnimation(true);
      betResult();
      setBetResultDataAnnouncement(null);
      setStartAnimationUser(true);
      setStartAnimationFireCard(true);
      setFlipCards(false);
      setShowFlipCards(false);
    }
    if (timeLeft === 29) {
      setstartbetImage(true);
      setFlipCards(true);
    }
    if (timeLeft === 27) {
      setstartbetImage(false);
    }
    if (timeLeft === 10) {
      setStartAnimationUser(false);
      setCoinAnimation(false);
      setStopbetImage(true);
      setRandomPositionsFive({});
      setRandomPositionsTen({});
      setRandomPositionsFifty({});
      setRandomPositionsHundred({});
     
    }
    if(timeLeft===9){
       setRandomPositionsFiveHundred({});
      setRandomPositionsThousand({});
      setRandomPositionsBaharFive({});
      setRandomPositionsBaharTen({});
      setRandomPositionsBaharFifty({});
      setRandomPositionsBaharHundred({});
      setRandomPositionsBaharFiveHundred({});
      setRandomPositionsBaharThousand({});
    }
    if (timeLeft == 7) {
      // setStopbetImage(false);
      setStopbetImage(!stopbetImage);
      betResultAnnouncement();
    }
    if (timeLeft === 5) {
      setStartWinnerCardImage(true);
    }
    if (timeLeft === 3) {
      setStartWinnerCardImage(false);
      // if (userId) {
      //     profileDetails(userId);
      // }
    }
    if (timeLeft === 1) {
      setStartAnimationFireCard(false);
      setBetAmount(null);
      setRandomPositionsFive({});
      setRandomPositionsTen({});
      setRandomPositionsFifty({});
      setRandomPositionsHundred({});
      setRandomPositionsFiveHundred({});
      setRandomPositionsThousand({});
      setRandomPositionsBaharFive({});
      setRandomPositionsBaharTen({});
      setRandomPositionsBaharFifty({});
      setRandomPositionsBaharHundred({});
      setRandomPositionsBaharFiveHundred({});
      setRandomPositionsBaharThousand({});
   
    }
    if (timeLeft === 30) {
      // Clear the displayed values
      updateBetValue("andarBetValue", setAndarBetValue);
      updateBetValue("baharBetValue", setBaharBetValue);
      localStorage.removeItem("andarBetValue");
      localStorage.removeItem("baharBetValue");
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
  }, [timeLeft]);
  useEffect(() => {
    const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    setRandomNumber(number);
    setFlipCards(true);
    setShowFlipCards(true);
    setStartAnimationFireCard(true);
    setStartAnimationUser(true);
    betResult();
    // Clear the displayed values
    betResultBetChecker();
  }, []);
  let lastValueMinusOne = null;

  try {
    // Ensure `json` exists and is valid
    if (betResultDataAnnouncement) {
      const jsonArray = JSON.parse(betResultDataAnnouncement?.json);
      lastValueMinusOne = jsonArray[jsonArray?.length - 1] - 1; // Deduct 1 from the last value
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error);
  }
  // console.log("betResultData", betResultData)
  // console.log("betResultDataAnnouncement", betResultDataAnnouncement)
  // console.log("betResultData", betResultData[0]?.json.length - 1)
  // console.log("image name ", assets?.cards[betResultData[0]?.json.length - 2])
  // console.log("StartWinnerCardImage", startWinnerCardImage)

  // bet handler
  const imageListOfFive = Array(100).fill(assets.chips.fiveL);
  const imageListOfTen = Array(100).fill(assets.chips.tenL);
  const imageListOfFifty = Array(100).fill(assets.chips.fiftyL);
  const imageListOfHundred = Array(100).fill(assets.chips.hundredL);
  const imageListOfFiveHundred = Array(100).fill(assets.chips.fiveHundredL);
  const imageListOfThousand = Array(100).fill(assets.chips.thousandL);

  const updateBetValue = (betType, setBetValue) => {
    const storedValue = parseInt(localStorage.getItem(betType) || 0);
    setBetValue(storedValue);
  };

  const andarCoinConfigs = {
    5: {
      indices: translatedIndicesFive,
      positions: positionsAndarFive,
      usedPositions: usedPositionsFive,
      setIndices: setTranslatedIndicesFive,
      setRandomPositions: setRandomPositionsFive,
      setUsedPositions: setUsedPositionsFive,
      animation: 1,
    },
    10: {
      indices: translatedIndicesTen,
      positions: positionsAndarTen,
      usedPositions: usedPositionsTen,
      setIndices: setTranslatedIndicesTen,
      setRandomPositions: setRandomPositionsTen,
      setUsedPositions: setUsedPositionsTen,
      animation: 2,
    },
    50: {
      indices: translatedIndicesFifty,
      positions: positionsAndarFifty,
      usedPositions: usedPositionsFifty,
      setIndices: setTranslatedIndicesFifty,
      setRandomPositions: setRandomPositionsFifty,
      setUsedPositions: setUsedPositionsFifty,
      animation: 3,
    },
    100: {
      indices: translatedIndicesHundred,
      positions: positionsAndarHundred,
      usedPositions: usedPositionsHundred,
      setIndices: setTranslatedIndicesHundred,
      setRandomPositions: setRandomPositionsHundred,
      setUsedPositions: setUsedPositionsHundred,
      animation: 4,
    },
    500: {
      indices: translatedIndicesFiveHundred,
      positions: positionsAndarFiveHundred,
      usedPositions: usedPositionsFiveHundred,
      setIndices: setTranslatedIndicesFiveHundred,
      setRandomPositions: setRandomPositionsFiveHundred,
      setUsedPositions: setUsedPositionsFiveHundred,
      animation: 5,
    },
    1000: {
      indices: translatedIndicesThousand,
      positions: positionsAndarThousand,
      usedPositions: usedPositionsThousand,
      setIndices: setTranslatedIndicesThousand,
      setRandomPositions: setRandomPositionsThousand,
      setUsedPositions: setUsedPositionsThousand,
      animation: 6,
    },
  };
  const baharCoinConfigs = {
    5: {
      indices: translatedIndicesBaharFive,
      positions: positionsBaharFive,
      usedPositions: usedPositionsBaharFive,
      setIndices: setTranslatedIndicesBaharFive,
      setRandomPositions: setRandomPositionsBaharFive,
      setUsedPositions: setUsedPositionsBaharFive,
      animation: 1,
    },
    10: {
      indices: translatedIndicesBaharTen,
      positions: positionsBaharTen,
      usedPositions: usedPositionsBaharTen,
      setIndices: setTranslatedIndicesBaharTen,
      setRandomPositions: setRandomPositionsBaharTen,
      setUsedPositions: setUsedPositionsBaharTen,
      animation: 2,
    },
    50: {
      indices: translatedIndicesBaharFifty,
      positions: positionsBaharFifty,
      usedPositions: usedPositionsBaharFifty,
      setIndices: setTranslatedIndicesBaharFifty,
      setRandomPositions: setRandomPositionsBaharFifty,
      setUsedPositions: setUsedPositionsBaharFifty,
      animation: 3,
    },
    100: {
      indices: translatedIndicesBaharHundred,
      positions: positionsBaharHundred,
      usedPositions: usedPositionsBaharHundred,
      setIndices: setTranslatedIndicesBaharHundred,
      setRandomPositions: setRandomPositionsBaharHundred,
      setUsedPositions: setUsedPositionsBaharHundred,
      animation: 4,
    },
    500: {
      indices: translatedIndicesBaharFiveHundred,
      positions: positionsBaharFiveHundred,
      usedPositions: usedPositionsBaharFiveHundred,
      setIndices: setTranslatedIndicesBaharFiveHundred,
      setRandomPositions: setRandomPositionsBaharFiveHundred,
      setUsedPositions: setUsedPositionsBaharFiveHundred,
      animation: 5,
    },
    1000: {
      indices: translatedIndicesBaharThousand,
      positions: positionsBaharThousand,
      usedPositions: usedPositionsBaharThousand,
      setIndices: setTranslatedIndicesBaharThousand,
      setRandomPositions: setRandomPositionsBaharThousand,
      setUsedPositions: setUsedPositionsBaharThousand,
      animation: 6,
    },
  };

  const andarCoinValues = [
    {
      value: 5,
      imageList: imageListOfFive,
      translatedIndices: translatedIndicesFive,
      positions: positionsAndarFive,
      randomPositions: randomPositionsFive,
      startAnimationCoin: 1,
      chipL: assets.chips.fiveL,
      chipD: assets.chips.fiveD,
    },
    {
      value: 10,
      imageList: imageListOfTen,
      translatedIndices: translatedIndicesTen,
      positions: positionsAndarTen,
      randomPositions: randomPositionsTen,
      startAnimationCoin: 2,
      chipL: assets.chips.tenL,
      chipD: assets.chips.tenD,
    },
    {
      value: 50,
      imageList: imageListOfFifty,
      translatedIndices: translatedIndicesFifty,
      positions: positionsAndarFifty,
      randomPositions: randomPositionsFifty,
      startAnimationCoin: 3,
      chipL: assets.chips.fiftyL,
      chipD: assets.chips.fiftyD,
    },
    {
      value: 100,
      imageList: imageListOfHundred,
      translatedIndices: translatedIndicesHundred,
      positions: positionsAndarHundred,
      randomPositions: randomPositionsHundred,
      startAnimationCoin: 4,
      chipL: assets.chips.hundredL,
      chipD: assets.chips.hundredD,
    },
    {
      value: 500,
      imageList: imageListOfFiveHundred,
      translatedIndices: translatedIndicesFiveHundred,
      positions: positionsAndarFiveHundred,
      randomPositions: randomPositionsFiveHundred,
      startAnimationCoin: 5,
      chipL: assets.chips.fiveHundredL,
      chipD: assets.chips.fiveHundredD,
    },
    {
      value: 1000,
      imageList: imageListOfThousand,
      translatedIndices: translatedIndicesThousand,
      positions: positionsAndarThousand,
      randomPositions: randomPositionsThousand,
      startAnimationCoin: 6,
      chipL: assets.chips.thousandL,
      chipD: assets.chips.thousandD,
    },
  ];

  const baharCoinValues = [
    {
      value: 5,
      imageList: imageListOfFive,
      translatedIndices: translatedIndicesBaharFive,
      positions: positionsBaharFive,
      randomPositions: randomPositionsBaharFive,
      startAnimationCoin: 1,
      chipL: assets.chips.fiveL,
      chipD: assets.chips.fiveD,
    },
    {
      value: 10,
      imageList: imageListOfTen,
      translatedIndices: translatedIndicesBaharTen,
      positions: positionsBaharTen,
      randomPositions: randomPositionsBaharTen,
      startAnimationCoin: 2,
      chipL: assets.chips.tenL,
      chipD: assets.chips.tenD,
    },
    {
      value: 50,
      imageList: imageListOfFifty,
      translatedIndices: translatedIndicesBaharFifty,
      positions: positionsBaharFifty,
      randomPositions: randomPositionsBaharFifty,
      startAnimationCoin: 3,
      chipL: assets.chips.fiftyL,
      chipD: assets.chips.fiftyD,
    },
    {
      value: 100,
      imageList: imageListOfHundred,
      translatedIndices: translatedIndicesBaharHundred,
      positions: positionsBaharHundred,
      randomPositions: randomPositionsBaharHundred,
      startAnimationCoin: 4,
      chipL: assets.chips.hundredL,
      chipD: assets.chips.hundredD,
    },
    {
      value: 500,
      imageList: imageListOfFiveHundred,
      translatedIndices: translatedIndicesBaharFiveHundred,
      positions: positionsBaharFiveHundred,
      randomPositions: randomPositionsBaharFiveHundred,
      startAnimationCoin: 5,
      chipL: assets.chips.fiveHundredL,
      chipD: assets.chips.fiveHundredD,
    },
    {
      value: 1000,
      imageList: imageListOfThousand,
      translatedIndices: translatedIndicesBaharThousand,
      positions: positionsBaharThousand,
      randomPositions: randomPositionsBaharThousand,
      startAnimationCoin: 6,
      chipL: assets.chips.thousandL,
      chipD: assets.chips.thousandD,
    },
  ];
  // console.log("andarCoinValuesandarCoinValues",andarCoinValues)
  // console.log("bahar coin value",baharCoinValues)
  // console.log("betResultData",betResultData)
  let coinData;
  if (selectedBetBox === 1) {
    coinData = andarCoinValues;
  } else {
    coinData = baharCoinValues;
  }
  const betHandler = async (userId, number) => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    const amount = selectedCoins ? selectedCoins : betAmount;
    const payload = {
      userid: userId,
      game_id: 13,
      json: [{ number, amount }],
    };
    // console.log("payload", payload);
    try {
      const response = await axios.post(apis?.dragon_bet, payload);
      if (response?.data?.status === 200) {
            const currentSno =
          betResultData.length > 0 && betResultData[0]?.games_no + 1;
         const va = localStorage.getItem("gameon_AB");
        if (Number(va) !== Number(currentSno)) {
          localStorage.setItem("gameon_AB", `${currentSno}`);
        }
        toast.success(response?.data?.message);
        profileDetails(userId);
      }
    } catch (err) {
      console.log("error bet bete ", err);
    }
  };

  const handleBetUpdate = (
    betType,
    selectedValue,
    betAmount,
    setBetValue,
    coinConfig
  ) => {
    // Update bet value in both state and localStorage
    setBetValue((prev) => {
      const newBetValue = prev + (selectedValue + Number(betAmount));
      localStorage.setItem(betType, newBetValue);
      return newBetValue;
    });

    // Animation and position updates (generic for all bets)
    if (selectedCoins) {
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
    }
  };

  // andar bet  started

  const AndarBetBox = () => {
    setSelectedBetBox(1);
    betHandler(userId, 1);
    // console.log("userId, 1userId, 1", userId, 1);
    const selectedConfig = andarCoinConfigs[selectedCoins];
    handleBetUpdate(
      "andarBetValue",
      selectedCoins,
      betAmount,
      setAndarBetValue,
      selectedConfig
    );
  };
  const BaharBetBox = () => {
    setSelectedBetBox(2);
    betHandler(userId, 2);
    // console.log("userId, 2userId, 2", userId, 2);
    const selectedConfig = baharCoinConfigs[selectedCoins];
    handleBetUpdate(
      "baharBetValue",
      selectedCoins,
      betAmount,
      setBaharBetValue,
      selectedConfig
    );
  };
  // console.log("betamont input",betAmount)

  return (
    <>
      <div
        className="bg-cover w-full text-xs font-bold bg-center h-[94.5vh] relative"
        style={{
          backgroundImage: `url(${assets.mainBg})`,
        }}
      >
        {/* result image started */}
        <div className="absolute w-full flex justify-end px-2 top-[3.6vh] z-50">
          <div className="flex gap-1 mr-2">
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
          <img className="w-7 h-7 " src={assets?.ic_arrow_zigzag} alt="sd" />
        </div>
        <div className="opacity-60 h-10 bg-black absolute flex items-center justify-end w-full  top-[3vh]"></div>
        {/* start bet image */}
        {startbetImage && (
          <div className="w-full z-50 absolute top-[20vh] flex items-center justify-center">
            <img src={Startbetting} alt="sd" />
          </div>
        )}
        {/* stop bet image */}
        {stopbetImage && (
          <div className="w-full z-50 absolute top-[20vh] flex items-center justify-center">
            <img src={stopbetting} alt="sd" />
          </div>
        )}
        {/* show winner card */}
        {betResultDataAnnouncement && startWinnerCardImage && (
          <div className="w-full gap-5 h-32 rounded-lg bg-black z-50 opacity-70 absolute top-[22vh] flex items-center justify-center">
            <img
              className="w-16 h-30"
              src={assets?.cards[lastValueMinusOne]}
              alt="sd"
            />
            <p className="text-2xl font-extrabold text-gold">
              {betResultDataAnnouncement?.number === 1 ? "Andar " : "Bahar "}Win
            </p>
          </div>
        )}
        {/* result image ended */}
        {/* result cards list of andar and bahar */}
        <AnimatedCardDisplay
          betResultDataAnnouncement={betResultDataAnnouncement}
        />
        {/* timer and cards and calender */}
        <div className="absolute h- w-full font-bold grid grid-cols-3 px-2 bottom-[50vh] xsm:bottom-[45vh]">
          <div className="col-span-1 w-full flex items-center justify-start">
            <div
              className="w-[25%] p-2 rounded-lg h-24 flex flex-col justify-between bg-cover bg-center absolute "
              style={{
                backgroundImage: `url(${assets.wallet})`,
              }}
            >
              <p className="text-[10px] text-center">
                &nbsp;
                {betResultData.length > 0
                  ? Number(betResultData[0]?.games_no) + 1
                  : ""}
              </p>
              <div className="w-full flex items-center justify-between px-3">
                <img className="w-6 h-6" src={assets?.a} alt="ds" />
                <p>{Number(andarBetValue).toFixed(2)}</p>
              </div>
              <div className="w-full flex items-center justify-between px-3">
                <img className="w-6 h-6" src={assets?.b} alt="ds" />
                <p>{Number(baharBetValue).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 w-full flex items-center justify-center">
            <div
              className={`w-12 h-16 relative transform transition-all duration-1000 ${
                startAnimationFireCard
                  ? "rotate-y-360 translate-y-0"
                  : "translate-y-[35vh]"
              }`}
            >
              {!flipCards ? (
                <img
                  className={`w-full h-full absolute backface-hidden `}
                  src={assets?.fire_card}
                  alt="another_card"
                />
              ) : (
                <img
                  className={`transition-transform duration-1000 ${
                    flipCards ? "transform rotate-y-360" : ""
                  } w-full h-full absolute`}
                  src={
                    showFlipCards
                      ? assets.cards[betResultData[0]?.random_card - 1]
                      : assets.fire_card
                  }
                  alt="fire_card"
                />
              )}
            </div>
          </div>
          <div className="w-full col-span-1 flex items-center justify-center">
            <div
              className="bg-cover w-20 h-24 flex items-center justify-center text-black font-bold text-sm"
              style={{
                backgroundImage: `url(${assets?.watch})`,
              }}
            >
              {timeLeft}
            </div>
          </div>
        </div>
        {/* andar bahar button  */}
        <div className="w-full flex items-center justify-between absolute bottom-[41.5vh] lg:bottom-[37vh] xl:bottom-[37vh] 2xl:bottom-[39vh] 3xl:bottom-[34.5vh]">
          <div className="w-full flex items-center justify-center">
            <img className="w-20 h-8" src={assets?.andar} alt="df" />
          </div>
          <div className="w-full flex items-center justify-center">
            <img className="w-20 h-8" src={assets?.bahar} alt="df" />
          </div>
        </div>
        {/* bet box  */}
        <div className="w-full px-10 absolute z-40 bottom-[21vh] ">
          <div className="grid grid-cols-2">
            <button
              disabled={timeLeft <= 10}
              onClick={AndarBetBox}
              className="col-span-1 h-[6.5rem]"
            ></button>
            <button
              disabled={timeLeft <= 10}
              onClick={BaharBetBox}
              className="col-span-1 h-[6.5rem]"
            ></button>
          </div>
        </div>
        {/* bet table div  */}
        <div
          className="w-full h-72 bg-contain bg-no-repeat bg-center absolute bottom-[7.5vh]"
          style={{
            backgroundImage: `url(${assets?.betTable})`,
          }}
        >
          <div className="flex justify-center w-full mt-3 xsm:-mt-3">
            <img
              className="w-16 xsm:w-20 h-16 xsm:h-20"
              src={assets?.gameQueen}
              alt="sd"
            />
          </div>
          <div className="w-full flex justify-center mt-2">
            <div className=" bg-bg3 w-[0.5px] h-24 xsm:h-28"></div>
          </div>
        </div>
        {/* all user throw coins div */}
        <p className="text-sm absolute bottom-[8vh] right-12">{randomNumber}</p>
        <div className="absolute gap-1 flex items-center right-2 bottom-[8vh]">
          <p className="text-sm">262</p>
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

        {/* wallet section  */}
        <div className="flex justify-center h-full relative">
          <div
            className="w-[95%] h-20 bg-cover bg-center absolute bottom-0"
            style={{
              backgroundImage: `url(${assets.bottom_strip})`,
            }}
          >
            <div className="flex w-full justify-center items-center h-full relative">
              <div className=" flex items-center h-6 w-[80px] bg-[#666666] rounded-3xl border-black border-[0.5px] absolute left-1 bottom-[3vh]">
                <span className="text-white text-[8px] pl-1 pr-[2px]">₹</span>
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
                  className="flex-1 bg-transparent text-white text-[8px] text-left outline-none placeholder:text-[10px] no-spinner pr-2"
                />
              </div>

              {/* Profile Icon */}
              {/* <div className="absolute bottom-[0.5vh] left-1 flex items-center justify-center text-white text-sm font-medium">
                                <div
                                    className='bg-cover z-50 flex items-center justify-center bg-center rounded-full h-12 w-12'
                                    style={{
                                        backgroundImage: `url(${assets.profileIcons})`,
                                    }}
                                >
                                    <img
                                        className='w-9 h-9 rounded-full'
                                        src={myDetails?.userimage ? myDetails?.userimage : assets?.person}
                                        alt="Profile"
                                    />
                                </div>
                            </div> */}

              {/* Wallet Icon */}
              <div className="absolute z-40 bottom-[2.5vh] xl:bottom-[2.5vh] left-[86px] flex items-center justify-center text-white text-xs font-medium">
                <div
                  className="bg-cover flex items-center justify-center bg-no-repeat bg-center h-7 rounded-full w-16"
                  style={{
                    backgroundImage: `url(${assets.wallet})`,
                  }}
                >
                  <p className="">{myDetails?.total_wallet}</p>
                </div>
              </div>
              {/* coins chips Icon */}
              <div className="absolute gap-0.5 xsm:gap-0.5 z-40 bottom-[1.5vh] left-40 xsm:left-[152px] flex items-center justify-center text-white text-xs font-medium">
                {coinData?.map((coin) => (
                  <button
                    key={coin.value}
                    className={`${
                      selectedCoins === coin.value ? "bg-green -mt-2" : ""
                    } flex items-center justify-center rounded-full w-8 h-8 xsm:h-9 xsm:w-9`}
                    onClick={() => {
                      // console.log("betamont coin", betAmount);
                      setBetAmount(null);
                      setSelectedCoins(coin.value);
                    }}
                  >
                    <img
                      onClick={() =>
                        setStartAnimationCoin(coin.startAnimationCoin)
                      }
                      className={`w-6 h-6 xsm:w-7 xsm:h-7 z-50 transition-all duration-300 ${
                        selectedCoins === coin.value ? "animate-zoom" : ""
                      }`}
                      src={
                        selectedCoins === coin.value ? coin.chipL : coin.chipD
                      }
                      alt={`${coin.value}D`}
                    />
                    {coin.imageList?.map((color, index) => (
                      <img
                        key={index}
                        src={color}
                        alt={`Chip ${index}`}
                        className="absolute z-10  w-6 h-6 xsm:w-7 xsm:h-7 rounded-full"
                        style={{
                          animation:
                            coin.translatedIndices.includes(index) &&
                            coinAnimation
                              ? `translate-animation 500ms ease-in-out forwards`
                              : "none",
                          transform:
                            coin.translatedIndices.includes(index) &&
                            coinAnimation
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
          </div>
        </div>
      </div>
    </>
  );
}

export default AndarBaharHome;
