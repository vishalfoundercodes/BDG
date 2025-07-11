/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import noData from "../../assets/images/images/no_data_available.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets } from "./assets";
import moment from "moment";
import hntSocket from './HeadTailSocket';
import apis from '../../utils/apis';
import { toast } from 'react-toastify';
import { MdArrowBackIos } from "react-icons/md";
const duration = 30;
const PAGE_LIMIT = 910;

const HeadTailHistory = () => {
    // const { timerBetTime } = useSocket("admingameon_hnt");
    // const timeLeft = timerBetTime?.timerBetTime;
    const [timeLeft, setTimeLeft] = useState(0);

    const [activeIndex, setActiveIndex] = useState(null);
    const [myHistoryData, setMyHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        const handleSocket = (hotair) => {
            const q = JSON.parse(hotair);
            setTimeLeft(q?.timerBetTime);
            // console.log("timeleft", q)
        };

        hntSocket.on("demo_HT", handleSocket);
        return () => hntSocket.off("demo_HT", handleSocket);
    }, []);
    const images = {
        1: assets.a,
        2: assets.b,
    };

    const betHistory = async (page = 1) => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }

        const offset = (page - 1) * 10;

        const payload = {
            userid: userId,
            game_id: 14,
            limit: 10,
            offset: offset,
        };

        try {
            setLoading(true);
            const res = await axios.post(`${apis?.headsntails_history}`, payload);
            console.log("resresrse",res)
            if (res?.data?.status === 200) {
                setMyHistoryData(res?.data?.data || []);
                setTotalItems(res?.data?.total_bets || 0); // assuming your API returns total
                setCurrentPage(page);
            }
        } catch (err) {
            console.log("error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        betHistory();
    }, [userId]);

    useEffect(() => {
        if (timeLeft === 8) {
            betHistory(currentPage);
        }
    }, [timeLeft]);

    const totalPages = Math.ceil(totalItems / 10);

    const handleNext = () => {
        if (currentPage < totalPages) {
            betHistory(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            betHistory(currentPage - 1);
        }
    };

    return (
        <>
            <div>

                <div className={`flex items-center justify-between h-[3.22rem] px-2`}>
                    <p className="!text-white flex items-center justify-between "><MdArrowBackIos onClick={() => navigate(-1)} /> </p>
                    <p >
                        Head Tail
                    </p>
                </div>
                <div className="max-h-calc[(100vh - 15px)] overflow-y-auto pb-[30px]" >

                    {myHistoryData?.length > 0 ? (
                        <>
                            {myHistoryData?.map((item, i) => (
                                <div key={i} className="px-4 w-full mt-3">
                                    <div
                                        className=" bg-bg4 text-white rounded-md mt-1  px-2 py-2 grid grid-cols-3"
                                        onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                    >
                                        <div className="col-span-2 flex items-center gap-2">
                                            <div className="w-16 h-16 flex flex-col justify-center rounded-md font-bold overflow-hidden relative">
                                                <div className={`p-1 rounded-lg ${item?.number == 1 ? "bg-bg3" : item?.number == 2 ? "bg-customred" : ""} `}>
                                                    <img className="object-cover w-12 h-12" src={images[item?.number]} alt="sd" />
                                                </div>
                                            </div>
                                            <div>
                                                <p>{item?.games_no}</p>
                                                <p className="text-white text-xsm"> {moment(item?.created_at)?.format("DD-MM-YYYY")}{" "}
                                                    {moment(item?.created_at)
                                                        ?.add(5, "hours")
                                                        .add(30, "minutes")
                                                        ?.format("HH:mm:ss")}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <div>
                                                <div
                                                    className={`font-bold flex items-center justify-center ${item?.win_amount === 0 && item?.status === 0 ? "text-yellow border-yellow" : (item?.win_amount === 0
                                                        ? "text-bg2 border-bg2"
                                                        : "text-green border-green"
                                                    )} border w-20 h-8 rounded-md`}
                                                >
                                                    {item?.win_amount === 0 && item?.status === 0 ? "Pending" : (item?.win_amount === 0 ? "Failed" : "Success")}
                                                </div>
                                                <div
                                                    className={`font-bold text-center ${item?.win_amount === 0 && item?.status === 0 ? "text-gray" : (item?.win_amount === 0 ? "text-bg2" : "text-green")}`}
                                                >
                                                    {item?.win_amount === 0 && item?.status === 0 ? "--" : (item?.win_amount === 0
                                                        ? `- ${item?.amount}`
                                                        : `+ ${item?.win_amount}`)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {activeIndex === i && (
                                        <div className="w-full bg-bg4 gap-2 mt-3 text-sm">
                                            <div className="bg-bg3  w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Order number</p>
                                                <p>{item?.order_id}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Period</p>
                                                <p>{item?.games_no}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Purchase amount</p>
                                                <p>{item?.amount}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Amount after tax</p>
                                                <p className="text-customred">{item?.trade_amount}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Tax</p>
                                                <p>{item?.commission}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Result</p>
                                                {item?.status !== 0 ? <p>
                                                    {item?.win_number === 1 ? (
                                                        <>
                                                            {/* <span className="text-bg4 font-bold">
                                                                {item?.win_number}
                                                            </span>{" "} */}
                                                            <span className="text-bg4"> Head</span>
                                                        </>
                                                    ) : item?.win_number === 2 ? (
                                                        <>
                                                            <span className="text-customred font-bold">
                                                                {item?.win_number}
                                                            </span>{" "}
                                                            <span className="text-customred">, Tail</span>
                                                        </>
                                                    ) : null}
                                                </p> : "--"}
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Select</p>
                                                <p>{item?.number == 1 ? <p className="text-bg4">Head</p> : item?.number == 2 ? <p className="text-customred">Tail</p> : item?.number}</p>
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Status</p>
                                                {item?.status !== 0 ? <p>{item?.status == 2 ? (<>
                                                    <span className="text-customred">Failed</span>
                                                </>) : <span className="text-green">Succeed</span>}</p> : <p>Unpaid</p>}
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Win/Loss</p>
                                                {item?.status !== 0 ? <p>{item?.win_amount == 0 ? (<>
                                                    <span className="text-customred">0.00</span>
                                                </>) : <span className="text-green">{item?.win_amount}</span>}</p> : <p>--</p>}
                                            </div>
                                            <div className="bg-bg3 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                                <p>Order time</p>
                                                <p> {moment(item?.created_at)?.format("DD-MM-YYYY")}{" "}
                                                    {moment(item?.created_at)
                                                        ?.add(5, "hours")
                                                        .add(30, "minutes")
                                                        ?.format("HH:mm:ss")}</p>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Pagination Controls */}
                            <div className="flex justify-between px-4 mt-4 mb-10 text-white">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </button>
                                <span className="my-auto">Page {currentPage} of {totalPages}</span>
                                <button
                                    disabled={myHistoryData.length < 10}
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>

                    ) : (
                        <div className="h-64 sm:h-[22rem] flex flex-col justify-center md:h-64 b mx-4 p-3 mt-3 mb-3 sm:mb-5 md:mb-3">
                            <div className="flex justify-center items-center mt-5">
                                <img
                                    src={noData}
                                    alt="Not Found"
                                    className="w-44 h-28 sm:w-64 sm:h-40 md:w-44 md:h-28"
                                />
                            </div>
                            <p className="text-center mt-5 text-sm sm:text-base md:text-sm font-bold text-white">
                                No data
                            </p>
                        </div>
                    )
                    }


                </div>
            </div>
        </>
    );
};

export default HeadTailHistory;
