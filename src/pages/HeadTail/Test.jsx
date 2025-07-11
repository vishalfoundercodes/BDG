import { useEffect, useRef, useState } from 'react'
import { assets } from "./assets";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { positionsUser } from "./positions"
import Startbetting from "../../assets/dragontiger/Startbetting.png"
import stopbetting from "../../assets/dragontiger/stopbetting.png"
import { positionsAndarFive, positionsBaharFive, positionsAndarTen, positionsBaharTen, positionsAndarHundred, positionsBaharHundred, positionsAndarFifty, positionsBaharFifty, positionsAndarFiveHundred, positionsBaharFiveHundred, positionsAndarThousand, positionsBaharThousand } from './positions';
import { endpoint } from '../../services/urls';
import { useQueryClient } from 'react-query';
import { Box, Stack } from '@mui/material';
import { ArrowBackIos, History } from '@mui/icons-material';
import { rgbheader } from '../../assets/components/color';
import Layout from '../../assets/layout/Layout';
import useSocket from '../../shared/wingoSocket/useSocket';
import useProfile from "../../services/useProfile"
import headtailCoin from "../../assets/headntails/headtailCoin.gif"
import { transterToWinningWallet } from '../../services/apiCallings';
import coinThrowingSound from '../../assets/music/coinThrowingSound.mp3';

const allUserImages = [
    assets.profile, assets.chips.tenL, assets.chips.fiveL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.thousandL, assets.chips.tenL, assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.chips.fiftyL,
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
    assets.chips.fiftyL, assets.chips.hundredL, assets.chips.fiveHundredL, assets.profile
];

function Test() {
    const { timerBetTime, timerStatus } = useSocket("betx_HT");
    const navigate = useNavigate()
    const audioRef = useRef(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [randomNumber, setRandomNumber] = useState(279)
    const [startbetImage, setstartbetImage] = useState(false);
    const [stopbetImage, setStopbetImage] = useState(false);
    const [startWinnerCardImage, setStartWinnerCardImage] = useState(false);
    const [betResultData, setBetResultData] = useState([])
    const [betResultDataAnnouncement, setBetResultDataAnnouncement] = useState(null)
    const [startAnimationUser, setStartAnimationUser] = useState(false);
    const [startAnimationFireCard, setStartAnimationFireCard] = useState(false);
    const [flipCards, setFlipCards] = useState(false);
    const [showFlipCards, setShowFlipCards] = useState(false);
    // const [timeLeft, setTimeLeft] = useState(timerBetTime?.timerBetTime)
    const [selectedCoins, setSelectedCoins] = useState(5)
    const [selectedBetBox, setSelectedBetBox] = useState(null)
    const [coinAnimation, setCoinAnimation] = useState(false);
    const [andarBetValue, setAndarBetValue] = useState(() => parseInt(localStorage.getItem("headValue") || 0));
    const [baharBetValue, setBaharBetValue] = useState(() => parseInt(localStorage.getItem("tailValue") || 0));

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

    const [usedPositionsBaharFive, setUsedPositionsBaharFive] = useState(new Set());
    const [translatedIndicesBaharFive, setTranslatedIndicesBaharFive] = useState([]);
    const [randomPositionsBaharFive, setRandomPositionsBaharFive] = useState({});
    const [usedPositionsBaharTen, setUsedPositionsBaharTen] = useState(new Set());
    const [translatedIndicesBaharTen, setTranslatedIndicesBaharTen] = useState([]);
    const [randomPositionsBaharTen, setRandomPositionsBaharTen] = useState({});
    const [usedPositionsBaharFifty, setUsedPositionsBaharFifty] = useState(new Set());
    const [translatedIndicesBaharFifty, setTranslatedIndicesBaharFifty] = useState([]);
    const [randomPositionsBaharFifty, setRandomPositionsBaharFifty] = useState({});
    const [usedPositionsBaharHundred, setUsedPositionsBaharHundred] = useState(new Set());
    const [translatedIndicesBaharHundred, setTranslatedIndicesBaharHundred] = useState([]);
    const [randomPositionsBaharHundred, setRandomPositionsBaharHundred] = useState({});
    const [usedPositionsBaharFiveHundred, setUsedPositionsBaharFiveHundred] = useState(new Set());
    const [translatedIndicesBaharFiveHundred, setTranslatedIndicesBaharFiveHundred] = useState([]);
    const [randomPositionsBaharFiveHundred, setRandomPositionsBaharFiveHundred] = useState({});
    const [usedPositionsBaharThousand, setUsedPositionsBaharThousand] = useState(new Set());
    const [translatedIndicesBaharThousand, setTranslatedIndicesBaharThousand] = useState([]);
    const [randomPositionsBaharThousand, setRandomPositionsBaharThousand] = useState({});
    const [startAnimationCoin, setStartAnimationCoin] = useState(0);
    // const client = useQueryClient()
    const userId = localStorage.getItem("user_id");
    const timeLeft = timerBetTime?.timerBetTime
    const { profileData: data, loading, error, refetch } = useProfile(userId);
    useEffect(() => {
        refetch();
    }, []);

    const result = data?.data?.data || [];
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
            const response = await axios.get(`${endpoint?.headsntails_result}`)
            // console.log("headsntails_result result", response)
            if (response?.data?.status === 200) {
                refetch()
                setBetResultData(response?.data?.data)
            }
        } catch (err) {
            console.log("error bet bete ", err)
        }
    }

    const betResultAnnouncement = async () => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        try {
            const response = await axios.get(`${endpoint?.headsntails_announcement}`)
            // console.log("announcement", response)
            if (response?.data?.status === 200) {
                refetch()
                setBetResultDataAnnouncement(response?.data?.data[0])
            }
        } catch (err) {
            console.log("error bet bete ", err)
        }
    }

    useEffect(() => {
        let timeoutId
        let timeoutImgId
        if (timeLeft === 30) {
            const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
            setRandomNumber(number)
            setCoinAnimation(true)
            betResult()
            setBetResultDataAnnouncement(null)
            setStartAnimationUser(true)
            // setStartAnimationFireCard(true)

        }
        if (timeLeft === 29) {
            setstartbetImage(true)
        }
        if (timeLeft === 27) {
            setstartbetImage(false)
        }
        if (timeLeft === 11) {
            setStartAnimationUser(false)
            setCoinAnimation(false)
            setStopbetImage(true)
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
        if (timeLeft === 8) {
            setStopbetImage(false)
            betResultAnnouncement()
        }
        if (timeLeft === 6) {
            setStartAnimationFireCard(true)
            setFlipCards(true);
        }

        if (timeLeft === 5) {
            setStartAnimationFireCard(false)
            setStartWinnerCardImage(true)
        }
        if (timeLeft === 4) {
            setFlipCards(false);
            setShowFlipCards(false)
        }
        if (timeLeft === 3) {
            setStartWinnerCardImage(false)
        }
        if (timeLeft === 1) {
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
            // Clear the displayed values
            updateBetValue("headValue", setAndarBetValue);
            updateBetValue("tailValue", setBaharBetValue);
            localStorage.removeItem("headValue");
            localStorage.removeItem("tailValue");
        }
        if (flipCards) {
            timeoutId = setTimeout(() => {
                setShowFlipCards(false)
            }, 500);
        }
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutImgId);
        };
    }, [timeLeft])

    useEffect(() => {
        const number = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
        setRandomNumber(number)
        setFlipCards(true);
        setShowFlipCards(true)
        if (timeLeft > 11) {
            setHasInteracted(true)
            setStartAnimationUser(true)
        }
        betResult()
    }, [timeLeft])

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
        { value: 5, imageList: imageListOfFive, translatedIndices: translatedIndicesFive, positions: positionsAndarFive, randomPositions: randomPositionsFive, startAnimationCoin: 1, chipL: assets.chips.fiveL, chipD: assets.chips.fiveD },
        { value: 10, imageList: imageListOfTen, translatedIndices: translatedIndicesTen, positions: positionsAndarTen, randomPositions: randomPositionsTen, startAnimationCoin: 2, chipL: assets.chips.tenL, chipD: assets.chips.tenD },
        { value: 50, imageList: imageListOfFifty, translatedIndices: translatedIndicesFifty, positions: positionsAndarFifty, randomPositions: randomPositionsFifty, startAnimationCoin: 3, chipL: assets.chips.fiftyL, chipD: assets.chips.fiftyD },
        { value: 100, imageList: imageListOfHundred, translatedIndices: translatedIndicesHundred, positions: positionsAndarHundred, randomPositions: randomPositionsHundred, startAnimationCoin: 4, chipL: assets.chips.hundredL, chipD: assets.chips.hundredD },
        { value: 500, imageList: imageListOfFiveHundred, translatedIndices: translatedIndicesFiveHundred, positions: positionsAndarFiveHundred, randomPositions: randomPositionsFiveHundred, startAnimationCoin: 5, chipL: assets.chips.fiveHundredL, chipD: assets.chips.fiveHundredD },
        { value: 1000, imageList: imageListOfThousand, translatedIndices: translatedIndicesThousand, positions: positionsAndarThousand, randomPositions: randomPositionsThousand, startAnimationCoin: 6, chipL: assets.chips.thousandL, chipD: assets.chips.thousandD }
    ];

    const baharCoinValues = [
        { value: 5, imageList: imageListOfFive, translatedIndices: translatedIndicesBaharFive, positions: positionsBaharFive, randomPositions: randomPositionsBaharFive, startAnimationCoin: 1, chipL: assets.chips.fiveL, chipD: assets.chips.fiveD },
        { value: 10, imageList: imageListOfTen, translatedIndices: translatedIndicesBaharTen, positions: positionsBaharTen, randomPositions: randomPositionsBaharTen, startAnimationCoin: 2, chipL: assets.chips.tenL, chipD: assets.chips.tenD },
        { value: 50, imageList: imageListOfFifty, translatedIndices: translatedIndicesBaharFifty, positions: positionsBaharFifty, randomPositions: randomPositionsBaharFifty, startAnimationCoin: 3, chipL: assets.chips.fiftyL, chipD: assets.chips.fiftyD },
        { value: 100, imageList: imageListOfHundred, translatedIndices: translatedIndicesBaharHundred, positions: positionsBaharHundred, randomPositions: randomPositionsBaharHundred, startAnimationCoin: 4, chipL: assets.chips.hundredL, chipD: assets.chips.hundredD },
        { value: 500, imageList: imageListOfFiveHundred, translatedIndices: translatedIndicesBaharFiveHundred, positions: positionsBaharFiveHundred, randomPositions: randomPositionsBaharFiveHundred, startAnimationCoin: 5, chipL: assets.chips.fiveHundredL, chipD: assets.chips.fiveHundredD },
        { value: 1000, imageList: imageListOfThousand, translatedIndices: translatedIndicesBaharThousand, positions: positionsBaharThousand, randomPositions: randomPositionsBaharThousand, startAnimationCoin: 6, chipL: assets.chips.thousandL, chipD: assets.chips.thousandD }
    ]

    let coinData;
    if (selectedBetBox === 1) {
        coinData = andarCoinValues
    } else {
        coinData = baharCoinValues
    }
    const betHandler = async (userId, number) => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        const payload = {
            userid: userId,
            game_id: 14,
            amount: selectedCoins,
            number
        }
        // console.info("paloaDF", payload, endpoint?.headsntails_bet)
        try {
            const response = await axios.post(endpoint?.headsntails_bet, payload)
            if (response?.data?.status === 200) {
                const currentSno = betResultData.length > 0 && (betResultData[0]?.games_no + 1)
                const va = localStorage.getItem("betPlacedHT")
                if (va !== currentSno) {
                    localStorage.setItem("betPlacedHT", `${currentSno}`)
                }
                refetch()
                // toast.success(response?.data?.message)
                // client.refetchQueries("profile_api")
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("err", err)
            } else {
                toast.error(err?.response?.data?.message)
            }
            // console.log("error bet bete ", err)
        }
    }

    const handleBetUpdate = (betType, selectedValue, setBetValue, coinConfig) => {
        // Update bet value in both state and localStorage
        setBetValue((prev) => {
            const newBetValue = prev + selectedValue;
            localStorage.setItem(betType, newBetValue);
            return newBetValue;
        });

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
    };

    // andar bet  started

    const AndarBetBox = () => {
        const walletBalance = result?.winning_wallet || 0;
        if (walletBalance >= selectedCoins) {
            setSelectedBetBox(1);
            betHandler(userId, 1)
            // const selectedConfig = andarCoinConfigs[selectedCoins];
            // handleBetUpdate("headValue", selectedCoins, setAndarBetValue, selectedConfig);

            const currentSno = betResultData.length > 0 && (betResultData[0]?.games_no + 1)
            const va = localStorage.getItem("betPlacedHT")
            if (va !== currentSno) {
                localStorage.setItem("betPlacedHT", `${currentSno}`)
            }
        } else {
            toast.error("Insufficient balance");
        }
    };
    const BaharBetBox = () => {
        // const walletBalance = result?.winning_wallet || 0;
        // if (walletBalance >= selectedCoins) {
            setSelectedBetBox(2);
            // betHandler(userId, 2)
            const selectedConfig = baharCoinConfigs[selectedCoins];
            handleBetUpdate("tailValue", selectedCoins, setBaharBetValue, selectedConfig);
        // } else {
        //     toast.error("Insufficient balance");
        // }
    };

    useEffect(() => {
        refetch();
        const currentSno = Number(betResultData[0]?.games_no) + 1
        const sno = localStorage.getItem("betPlacedHT")
        const tieStatus = localStorage.getItem("headValue")
        const drgaonStatus = localStorage.getItem("tailValue")
        if (betResultData?.length > 0) {
            if (sno == currentSno && currentSno != undefined) {
                if (tieStatus > "0" && timeLeft === 1) {
                    localStorage.removeItem("headValue");
                    updateBetValue("headValue", setAndarBetValue);
                }
                if (drgaonStatus > "0" && timeLeft === 1) {
                    localStorage.removeItem("tailValue");
                    updateBetValue("tailValue", setBaharBetValue);
                }
            }
            if (currentSno != undefined && sno != currentSno) {
                localStorage.removeItem("headValue");
                localStorage.removeItem("tailValue");
                updateBetValue("headValue", setAndarBetValue);
                updateBetValue("tailValue", setBaharBetValue);
            }
        }
    }, [betResultData]);

    const location = useLocation();

    useEffect(() => {
        const transfer = async () => {
            await transterToWinningWallet();
            refetch()
        };
        transfer();
    }, [location.pathname]);

    useEffect(() => {
        if (audioRef.current && hasInteracted) {
            if (timeLeft > 14 && timeLeft <= 30) {
                audioRef.current.play().catch((e) => {
                    console.log("Auto-play blocked:", e);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [timeLeft, hasInteracted]);

    useEffect(() => {
        setHasInteracted(true);
    }, []);
    return (
        <Layout ispdbottom={false} header={false} footer={false}>
             <audio ref={audioRef} src={coinThrowingSound} preload="auto" />
            <Box sx={{ ...styles.header, }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Box className="!text-white"><ArrowBackIos onClick={() => navigate('/')} />  Head Tail</Box>
                    <Stack direction='row'>
                        <NavLink size="small" variant="contained" to='/headsntails/history' className="btn-register"><History /></NavLink>
                    </Stack>
                </Stack>
                <div
                    className="bg-cover w-full text-xs font-bold bg-center h-[85.8vh] xsm:h-[93.5vh] relative"
                    style={{
                        backgroundImage: `url(${assets.mainBg})`,
                    }}
                >
                    <div className="z-50 w-full h-full flex items-center justify-center overflow-hidden relative">
                        {startAnimationFireCard && (
                            <div
                                className={`absolute w-20 bottom-20 `}
                            >
                                <img
                                    className="w-72 h-[90vh] object-contain"
                                    src={headtailCoin}
                                    alt="fire_card"
                                />
                            </div>
                        )}
                    </div>

                    {/* result image started */}
                    <div className='absolute w-full flex justify-end px-2 top-[3.6vh] z-50'>
                        <div className="flex gap-1 mr-2" >
                            {betResultData?.map((item, i) => {
                                return (
                                    <img key={i} className="w-7 h-7 " src={images[item?.number]} alt="sd" />
                                )
                            })}
                        </div>
                        <img className="w-7 h-7 " src={assets?.ic_arrow_zigzag} alt="sd" />
                    </div>
                    <div className="opacity-60 h-10 bg-black absolute flex items-center justify-end w-full  top-[3vh]">
                    </div>
                    {/* start bet image */}
                    {startbetImage && <div className=" z-50 absolute top-[25vh] flex items-center justify-center" >
                        <img src={Startbetting} alt="sd" className="w-full" />
                    </div>}
                    {/* stop bet image */}
                    {stopbetImage && <div className=" z-50 absolute top-[25vh] flex items-center justify-center" >
                        <img src={stopbetting} alt="sd" className="w-full" />
                    </div>}
                    {/* show winner card */}
                    {betResultDataAnnouncement && startWinnerCardImage && (
                        <div className="w-full gap-5 h-32 rounded-lg bg-black z-50 opacity-70 absolute top-[17vh] flex items-center justify-center">
                            <img
                                className="w-16 h-30"
                                src={(betResultDataAnnouncement?.number == 1 ? assets?.a : assets?.b)}
                                // src={assets?.cards[lastValueMinusOne]}
                                alt="sd"
                            />
                            <p className='text-2xl  font-extrabold text-orange-500'>{betResultDataAnnouncement?.number === 1 ? "Head " : "Tail "}</p>
                        </div>
                    )}
                    {/* result image ended */}
                    {/* result cards list of andar and bahar */}
                    {/* <AnimatedCardDisplay betResultDataAnnouncement={betResultDataAnnouncement} /> */}
                    {/* timer and cards and calender */}
                    <div className='absolute w-full font-bold grid grid-cols-3 px-2 bottom-[47vh] xsm:bottom-[45vh]'>
                        <div className='col-span-1 text-white w-full flex items-center justify-start'>
                            <div className="w-[25%] p-2 rounded-lg h-24 flex flex-col justify-between bg-cover bg-center absolute "
                                style={{
                                    backgroundImage: `url(${assets.wallet})`,
                                }}
                            >
                                <p className="text-xs text-center">&nbsp;{betResultData.length > 0 ? betResultData[0]?.games_no + 1 : ""}</p>
                                <div className='w-full flex items-center justify-between px-3'>
                                    <img className='w-6 h-6' src={assets?.a} alt="ds" />
                                    <p>{andarBetValue}</p>
                                </div>
                                <div className='w-full flex items-center justify-between px-3'>
                                    <img className='w-6 h-6' src={assets?.b} alt="ds" />
                                    <p>{baharBetValue}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 w-full flex items-center justify-center">

                        </div>
                        <div className='w-full col-span-1 flex items-center justify-center'>
                            <div className='bg-cover w-20 h-24 flex items-center justify-center text-black font-bold text-sm'
                                style={{
                                    backgroundImage: `url(${assets?.watch})`,
                                }}
                            >
                                <p className="mt-3">  {timeLeft}</p>
                            </div>
                        </div>
                    </div>
                    {/* bet box  */}
                    <div className='w-full px-10 absolute z-50 bottom-[21vh] ' >
                        <div className='grid grid-cols-2'>
                            <button disabled={timeLeft <= 10} onClick={AndarBetBox} className='col-span-1  h-[6.5rem]'></button>
                            <button disabled={timeLeft <= 10} onClick={BaharBetBox} className='col-span-1  h-[6.5rem]'></button>
                        </div>
                    </div>
                    {/* bet table div  */}
                    <div
                        className="w-full h-72 bg-contain bg-no-repeat bg-center absolute  bottom-[7.5vh]"
                        style={{
                            backgroundImage: `url(${assets.betTable})`,
                        }}
                    >
                        <div className='flex justify-center w-full mt-3 xsm:-mt-3'>
                            <div className='w-full flex items-center justify-center'>
                                {/* <img className='w-12 h-12' src={assets?.andar} alt="df" /> */}
                            </div>
                            <img className='w-16 xsm:w-20 h-16 xsm:h-20' src={assets?.gameQueen} alt="sd" />
                            <div className='w-full flex items-center justify-center'>
                                {/* <img className='w-12 h-12' src={assets?.bahar} alt="df" /> */}
                            </div>
                        </div>
                        <div className='w-full h-full flex items-center -mt-1 xs2:-mt-3'>
                            <div className='w-[50%] h-full  '>
                                <div className='w-full flex items-center justify-center '>
                                    <img className='w-[100%] h-32 lg:h-36 -mr-10' src={assets?.headbg} alt="df" />
                                </div>
                            </div>

                            <div className='w-[50%] h-full '>
                                <div className='w-full flex items-center justify-center'>
                                    <img className='w-[100%] h-32 lg:h-36 -ml-10' src={assets?.tailbg} alt="df" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* all user throw coins div */}
                    <p className='text-sm absolute bottom-[9vh] text-white xsm:bottom-[8vh] right-12'>{randomNumber}</p>
                    <div className='absolute gap-1 flex items-center right-2 bottom-[9vh] xsm:bottom-[8vh]'>
                        <p className='text-sm'>262</p>
                        {allUserImages?.map((color, index) => {
                            return (
                                <img
                                    src={color}
                                    alt={`Chip ${index}`}
                                    key={index}
                                    className="absolute w-8 h-8 rounded-full"
                                    style={{
                                        animation:
                                            startAnimationUser && index !== 0 && index !== allUserImages.length - 1
                                                ? `translate-animation 500ms ease-in-out ${Math.floor(index / 1) * 0.1}s forwards`
                                                : "none",
                                        transform: index === allUserImages.length - 1 ? "none" : "translate(0, 0)",
                                        "--x": `-${positionsUser[index].x}vh`,
                                        "--y": `-${positionsUser[index].y}vh`,
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* wallet section  */}
                    {/* <div className="flex justify-center h- relative"> */}
                    <div
                        className="w-[100%] h-20 bg-cover bg-center absolute bottom-0"
                        style={{
                            backgroundImage: `url(${assets.bottom_strip})`,
                        }}
                    >
                        <div className='flex w-full justify-center items-center h-full relative'>
                            {/* Profile Icon */}
                            <div className="absolute bottom-[0.5vh] left-1 flex items-center justify-center text-white text-sm font-medium">
                                <div
                                    className='bg-cover z-50 flex items-center justify-center bg-center rounded-full h-12 w-12'
                                    style={{
                                        backgroundImage: `url(${assets.profileIcons})`,
                                    }}
                                >
                                    <img
                                        className='w-9 h-9 rounded-full'
                                        src={result?.image ? result?.image : assets?.person}
                                        alt="Profile"
                                    />
                                </div>
                            </div>

                            {/* Wallet Icon */}
                            <div className="absolute z-40 bottom-[1.5vh] left-11 flex items-center justify-center text-white text-xs font-medium">
                                <div
                                    className='bg-cover flex items-center justify-center bg-no-repeat bg-center h-7 rounded-full w-20'
                                    style={{
                                        backgroundImage: `url(${assets.wallet})`,
                                    }}
                                >
                                    <p className=''>   {(
                                        Number(
                                            Number(result?.winning_wallet)
                                        ) || 0
                                    )?.toFixed(2)}</p>
                                </div>
                            </div>
                            {/* coins chips Icon */}
                            <div className="absolute bottom-0.5 xsm:bottom-2 left-32 xsm:left-36 w- flex justify-center gap-0.5">
                                {coinData?.map((coin) => (
                                    <button
                                        key={coin.value}
                                        className={`${selectedCoins === coin.value ? "bg-green -mt-2" : ""} flex items-center justify-center rounded-full w-8 h-8 xsm:h-9 xsm:w-9`}
                                        onClick={() => setSelectedCoins(coin.value)}
                                    >
                                        <img
                                            onClick={() => setStartAnimationCoin(coin.startAnimationCoin)}
                                            className={`w-6 h-6 xsm:w-7 xsm:h-7 z-50 transition-all duration-300 ${selectedCoins === coin.value ? "animate-zoom" : ""}`}
                                            src={selectedCoins === coin.value ? coin.chipL : coin.chipD}
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
                                                        coin.translatedIndices.includes(index) && coinAnimation
                                                            ? `translate-animation 200ms ease-in-out forwards`
                                                            : "none",
                                                    transform:
                                                        coin.translatedIndices.includes(index) && coinAnimation
                                                            ? `translate(${coin.positions[coin.randomPositions[index]]?.x}vh, ${coin.positions[coin.randomPositions[index]]?.y}vh)`
                                                            : "translate(0, 0)",
                                                    "--x": `${coin.positions[coin.randomPositions[index]]?.x}vh`,
                                                    "--y": ` ${coin.positions[coin.randomPositions[index]]?.y}vh`,
                                                }}
                                            />
                                        ))}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </Box>
        </Layout>
        // </>
    );
}

export default Test;
const styles = {
    header: {
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "450px",
        width: "100%",
        background: rgbheader,
        padding: '8px 0px',
        boxSizing: "border-box",
        borderBottom: '1px solid #343434',
        zIndex: 1000,
    },

};
