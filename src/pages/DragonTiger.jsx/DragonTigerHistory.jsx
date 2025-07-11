/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import noData from "../../assets/images/no_data_available.png"
import axios from "axios";
import apis from "../../utils/apis"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ic_dt_d from "../../assets/dragontiger/ic_dt_d.png"
import ic_dt_t from "../../assets/dragontiger/ic_dt_t.png"
import ic_dt_tie from "../../assets/dragontiger/ic_dt_tie.png"
import socket from '../../shared/socket/DragonTigerSocket';

const duration = 30
const DragonTigerHistory = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [myHistoryData, setMyHistoryData] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId");

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
    useEffect(() => {
        if (timeLeft === 5) {
            betHistory()
        }
    }, [timeLeft])
    const images = {
        1: ic_dt_d,
        2: ic_dt_t,
        3: ic_dt_tie,
    };
    const betHistory = async () => {
        if (!userId) {
            toast.error("User not logged in");
            navigate("/login");
            return;
        }
        const payload = {
            userid: userId,
            game_id: 10,
            limit: 10,
            offset: 0
        }
        try {
            const res = await axios.post(`${apis?.dragonBet_history}`, payload)
            console.log("response", res)
            if (res?.data?.status === 200) {
                setMyHistoryData(res?.data?.data)
            }
        } catch (err) {
            console.log("error", err)
        }
    }

    useEffect(() => {
        betHistory()
    }, [userId])

    // console.log("myHistoryDatamyHistoryData", myHistoryData)
    // 0 = pensding , 1= win, 2= loss
    return (
        <>
            {myHistoryData?.length > 0 ? (
                myHistoryData?.map((item, i) => (
                    <div key={i} className="px-4 w-full mt-3">
                        <div
                            className="bg-redLight rounded-md px-4 py-2 grid grid-cols-3"
                            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                        >
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="w-12 h-12 flex flex-col justify-center rounded-md font-bold overflow-hidden relative">
                                    <div className={`p-1 rounded-lg ${item?.number == 1 ? "bg-bg3" : item?.number == 2 ? "bg-red" : item?.number == 3 ? "bg-green" : ""} `}>
                                        <img src={images[item?.number]} alt="sd" />
                                    </div>
                                </div>
                                <div>
                                    <p>{item?.games_no}</p>
                                    <p className="text-white opacity-65 text-[10px]">{item?.created_at}</p>
                                </div>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <div>
                                    <div
                                        className={`font-bold flex items-center justify-center ${item?.win_amount === 0 && item?.status === 0 ? "text-gray border-gray" : (item?.win_amount === 0
                                            ? "text-rose-500 border-rose-500"
                                            : "text-green border-green"
                                        )} border w-20 h-8 rounded-md`}
                                    >
                                        {item?.win_amount === 0 && item?.status === 0 ? "Pending" : (item?.win_amount === 0 ? "Failed" : "Success")}
                                    </div>
                                    <div
                                        className={`font-bold text-center ${item?.win_amount === 0 && item?.status === 0 ? "text-gray" : (item?.win_amount === 0 ? "text-customred" : "text-green")}`}
                                    >
                                        {item?.win_amount === 0 && item?.status === 0 ? "--" : (item?.win_amount === 0
                                            ? `- ${item?.amount}`
                                            : `+ ${item?.win_amount}`)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {activeIndex === i && (
                            <div className="w-full gap-2 mt-3 text-sm">
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Order number</p>
                                    <p>{item?.order_id}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Period</p>
                                    <p>{item?.games_no}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Purchase amount</p>
                                    <p>{item?.amount}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Amount after tax</p>
                                    <p className="text-customlightBlue">{item?.trade_amount}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Tax</p>
                                    <p>{item?.commission}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Result</p>
                                    {item?.status !== 0 ? <p>
                                        {item?.win_number === 1 ? (
                                            <>
                                                <span className="text-bg3 font-bold">
                                                    {item?.win_number}
                                                </span>{" "}
                                                <span className="text-bg3">, Dragon</span>
                                            </>
                                        ) : item?.win_number === 2 ? (
                                            <>
                                                <span className="text-customlightBlue font-bold">
                                                    {item?.win_number}
                                                </span>{" "}
                                                <span className="text-customlightBlue">, Tiger</span>
                                            </>
                                        ) : item?.win_number === 3 ? (
                                            <>
                                                <span className="text-green font-bold">
                                                    {item?.win_number}
                                                </span>{" "}
                                                <span className="text-green">, Tie</span>
                                            </>
                                        ) : null}
                                    </p> : "--"}
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Select</p>
                                    <p>{item?.number == 1 ? <p className="text-bg3">Dragon</p> : item?.number == 2 ? <p className="text-red">Tiger</p> : item?.number == 3 ? <p className="text-green">Tie</p> : item?.number}</p>
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Status</p>
                                    {item?.status !== 0 ? <p>{item?.status == 2 ? (<>
                                        <span className="text-rose-500">Failed</span>
                                    </>) : <span className="text-green">Succeed</span>}</p> : <p>Unpaid</p>}
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Win/Loss</p>
                                    {item?.status !== 0 ? <p>{item?.win_amount == 0 ? (<>
                                        <span className="text-rose-500">0.00</span>
                                    </>) : <span className="text-green">{item?.win_amount}</span>}</p> : <p>--</p>}
                                </div>
                                <div className="bg-redLight w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                                    <p>Order time</p>
                                    <p>{item?.created_at}</p>
                                </div>

                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="h-64 sm:h-[22rem] flex flex-col justify-center md:h-64  mx-4 p-3 mt-3 mb-3 sm:mb-5 md:mb-3">
                    <div className="flex justify-center items-center mt-5">
                        <img
                            src={noData}
                            alt="Not Found"
                            className="w-44 h-28 sm:w-64 sm:h-40 md:w-44 md:h-28"
                        />
                    </div>
                    <p className="text-center mt-5 text-sm sm:text-base md:text-sm font-bold text-gray">
                        No data
                    </p>
                </div>
            )
            }
        </>
    );
};

export default DragonTigerHistory;
