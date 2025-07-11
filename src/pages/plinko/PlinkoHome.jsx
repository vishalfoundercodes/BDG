import React, { useEffect, useState } from "react";
import PlinkoHeader from "./PlinkoHeader";
import { Link } from "react-router-dom";
import { LuHistory } from "react-icons/lu";
import { MdKeyboardArrowDown } from "react-icons/md";
import PlinkoGrid from "./PlinkoGrid";
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import PlinkoGridMobile from "./PlinkoGridMobile";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../../utils/apis";
import "./index.css";
import useProfile from "../../reusable_component/gameApi";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import ResultAnnouncement from "./ResultAnnouncement";
// import { useProfile } from "../../reusable_component/gameApi";


function PlinkoHome() {
  const userId = localStorage.getItem("userId");
  const { myDetails } = useProfile(userId);
  const [showPopup, setShowPopup] = useState(false); // State to toggle popup
  // Toggle popup visibility
  // const togglePopup = () => setShowPopup(!showPopup);

  const [amount, setAmount] = useState("");
  const [announcement, setAnnoucment] = useState(false);
  const [getNumbersList, setGetNumbersList] = useState({
    data1: null,
    data2: null,
    data3: null,
  });
  const [betAndDrop, setBetAndDrop] = useState({ betStatus: false, id: null });
  const [profileRefresher, setProfileRefresher] = useState({
    first: false,
    second: false,
  });
  const [openHeightListModal, setOpenHeightListModal] = useState(false);
  const [ballDropped, setballDropped] = useState(false);
  const [lastResults, setLastResults] = useState(null);
  const [betId, setBetId] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const betMulitiplierHandler = async (index) => {
    let i;
    if (index < 1) {
      i = 1;
    } else if (index > 0 && index <= 13) {
      i = index;
    } else if (index === 0) {
      i = 1;
    } else {
      i = 13;
    }
    const payload1 = {
      userid: userId,
      index: isMobile ? i : i > 5 ? i - 1 : i,
    };
    // console.log("betMulitiplierHandler payload", payload1)
    try {
      const res1 = await axios.post(`${apis?.plinko_multiplier}`, payload1);
      // console.log("response betMulitiplierHandler", res1)
      if (res1?.data?.status === 200 || res1?.data?.status === "200") {
        setProfileRefresher({ first: false, second: true });
        setAnnoucment(true);
        setTimeout(() => {
          setProfileRefresher({ first: false, second: false });
        }, 500);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("err", err);
      } else {
        toast.success(err?.response?.data?.message, {
          className: "custom-toast custom-toast-success",
        });
      }
    } finally {
      setBetAndDrop({ betStatus: false, id: null });
    }
  };

  const betAndDropBallHandler = async (id) => {
    if (amount > myDetails?.data?.total_wallet) {
      toast.error("Insufficient balance")
    }
    setballDropped(false);
    setBetAndDrop({ betStatus: false, id: null });
    const payload = {
      userid: userId,
      game_id: "11",
      amount,
      type: id,
    };
    // console.log("payload", payload);
    try {
      const res1 = await axios.post(`${apis?.plinko_bet}`, payload);
      // console.log("plinko res",res1)
      if (res1?.data?.status === 200 || res1?.data?.status === "200") {
        setProfileRefresher({ first: true, second: false });
        setTimeout(() => {
          setBetAndDrop({ betStatus: true, id });
          setProfileRefresher({ first: true, second: false });
        }, 500);
      }
      if (res1?.data?.message === "The amount field is required.") {
        toast.success(res1?.data?.message, {
          className: "custom-toast custom-toast-error",
        });
      }
    } catch (err) {
      console.log("error", err);
      if (err?.response?.data?.status === 500) {
        console.log("err", err);
      } else {
        toast.success(err?.response?.data?.message, {
          className: "custom-toast custom-toast-success",
        });
      }
    }
  };
  const getNmberListHnadler = async () => {
    try {
      const res1 = await axios.get(`${apis?.plinko_index_list}1`);
      const res2 = await axios.get(`${apis?.plinko_index_list}2`);
      const res3 = await axios.get(`${apis?.plinko_index_list}3`);

      if (
        res1?.data?.status === 200 &&
        res2?.data?.status === 200 &&
        res3?.data?.status === 200
      ) {
        setGetNumbersList({
          data1: res1?.data?.data,
          data2: res2.data?.data,
          data3: res3?.data?.data,
        });
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("err", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const getLastFiveResults = async () => {
    try {
      const res1 = await axios.get(`${apis?.plinko_result}${userId}`);
      console.log("resresresres", res1);
      if (res1?.data?.status === 200 || res1?.data?.status === "200") {
        setLastResults(res1?.data?.data);
      }
    } catch (err) {
      if (err?.response?.data?.status === 500) {
        console.log("err", err);
      } else {
        setLastResults(null);
        toast.error(err?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    getNmberListHnadler();
    getLastFiveResults();
  }, []);
  useEffect(() => {
    if (profileRefresher?.second) {
      getLastFiveResults();
    }
  }, [profileRefresher?.second]);
  useEffect(() => {
    if (ballDropped && betId !== null) {
      betMulitiplierHandler(betId).then(() => {
        setTimeout(() => setballDropped(false), 500);
      });
    }
  }, [ballDropped, betId]);

  useEffect(() => {
    if (announcement) {
      setTimeout(() => {
        setAnnoucment(false);
      }, 3000);
    }
  }, [announcement]);
  console.log("openHeightListModal", openHeightListModal);
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #0066cc, #009999, #00cc66)",
      }}
      className="h-full overflow-y-scroll hide-scrollbar"
    >
      {announcement && (
        <div className="result-announcement">
          <ResultAnnouncement data={lastResults} />
        </div>
      )}
      <div className="p-1 sm:p-2">
        <PlinkoHeader
          profileRefresher={profileRefresher}
          setProfileRefresher={setProfileRefresher}
        />
        <div className="h-8 w-full rounded-2xl bg-[#0D5574] flex items-center justify-between pl-2 mt-1 sm:mt-2 ">
          <div className=" overflow-x-auto z-50 hide-scrollbar flex items-center">
            {lastResults?.slice(0, 20).map((item, i) => (
              <div
                key={i}
                className={`px-2 min-w-[40px] text-center bg-${
                  item?.type === 1
                    ? "green"
                    : item?.type === 2
                    ? "yellow"
                    : item?.type === 3
                    ? "[#F85050]"
                    : "black"
                } text-white rounded-full mx-1`}
              >
                {item?.multipler}
              </div>
            ))}
          </div>
          <div className="h-8 w-16 z-50 gap-2 bg-[#007C80] rounded-2xl flex items-center justify-between px-1 border-black border-[0.5px] ml-1">
            <button onClick={() => getLastFiveResults()}>
              <LuHistory className="font-extrabold text-[20px] text-white flex items-center justify-center pl-1" />
            </button>
            {openHeightListModal ? (
              <button
                onClick={() => setOpenHeightListModal(false)}
                className="text-[#F85050]"
              >
                <IoCaretDownSharp size={20} />{" "}
              </button>
            ) : (
              <button
                onClick={() => setOpenHeightListModal(true)}
                className="text-white"
              >
                <IoCaretUpSharp size={20} />{" "}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="z-10">
        {isMobile ? (
          <PlinkoGridMobile
            betId={betId}
            setBetId={setBetId}
            ballDropped={ballDropped}
            setballDropped={setballDropped}
            getNumbersList={getNumbersList}
            betAndDropStatus={betAndDrop?.betStatus}
            betAndDropId={betAndDrop?.id}
            setBetAndDrop={setBetAndDrop}
          />
        ) : (
          <PlinkoGrid
            betId={betId}
            setBetId={setBetId}
            ballDropped={ballDropped}
            setballDropped={setballDropped}
            getNumbersList={getNumbersList}
            betAndDropId={betAndDrop?.id}
            betAndDropStatus={betAndDrop?.betStatus}
            setBetAndDrop={setBetAndDrop}
          />
        )}
      </div>

      {/* bet button */}
      <div className=" flex items-center justify-center p-2 mt-0 xsm:mt-2">
        <div className=" sm:h-36 w-full rounded-lg bg-[#0D5574] px-4 py-1 xsm:p-4">
          <div className="h-14 w-full rounded-3xl bg-[#007C80] border-[0.5px]  border-black pt-2">
            <div className="flex justify-between items-center ">
              <div className="pl-4">
                <div className="text-white pl-12 font-serif text-[12px]">
                  BET{" "}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xs">
                    ₹
                  </span>
                  <input
                    inputMode="numeric"
                    placeholder="Enter amount"
                    type="text"
                    value={amount}
                    onBeforeInput={(e) => {
                      if (!/^\d$/.test(e.data)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const numericVal = Number(val);
                      const wallet = Number(myDetails?.data?.total_wallet || 0);

                      if (numericVal <= wallet) {
                        setAmount(val);
                      }
                    }}
                    onBlur={() => {
                      const num = Number(amount);
                      if (!isNaN(num)) {
                        setAmount(num.toString());
                      }
                    }}
                    className="h-6 w-32 pl-6 bg-[#08565A] no-spinner placeholder:text-[10px] border-black border-[0.5px] text-center rounded-3xl text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex pr-6">
                <div className="h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-3">
                  <button
                    onClick={() =>
                      setAmount((prev) => {
                        const value = Number(prev) || 0;
                        return Math.max(0, value - 1);
                      })
                    }
                  >
                    <TiMinus className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
                  </button>
                </div>
                {/* <div className="h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-3">
                  <button onClick={() => setShowPopup(!showPopup)}>
                    <BsDatabase
                      className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1"
                      // disabled={gameStarted}
                      onClick={() => setShowPopup(!showPopup)}
                      // onClick={() => setShowPopup((prev) => !prev)}

                      // onClick={()=>console.log("show modal")}
                    />
                  </button>
                </div> */}
                <div className="h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-full flex items-center justify-center border-black border-[0.5px] ml-3">
                  <button onClick={() => setShowPopup((prev) => !prev)}>
                    <BsDatabase className="text-[24px] text-white" />
                  </button>
                </div>

                <div className="h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-3">
                  <button
                    onClick={() =>
                      setAmount((prev) => {
                        const value = Number(prev) || 0;
                        return Math.max(0, value + 1);
                      })
                    }
                  >
                    <IoMdAdd className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => betAndDropBallHandler(1)}
              className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[12px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9 w-20 bg-white m-2 rounded-2xl flex items-center justify-center"
            >
              GREEN
            </button>
            <button
              onClick={() => betAndDropBallHandler(2)}
              className="relative bg-gradient-to-tr from-[#C47400] to-[#DD9600] text-white text-[12px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9 w-20 bg-white m-2 rounded-2xl flex items-center justify-center"
            >
              YELLOW
            </button>
            <button
              onClick={() => betAndDropBallHandler(3)}
              className="relative bg-gradient-to-tr from-[#F5240C] to-[#CC1C00] text-white text-[12px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-9 w-20 bg-white m-2 rounded-2xl flex items-center justify-center"
            >
              RED
            </button>
          </div>
        </div>
      </div>
      {openHeightListModal && (
        <div className="fixed inset-0 z-50 flex left-0 top-[6rem] justify-center">
          <div className="h-64 w-[350px] bg-black bg-opacity-50 rounded-lg shadow-lg flex flex-col items-start justify-start overflow-y-auto p-2 text-white">
            Game History
            <div className="w-full flex flex-wrap gap-2 items-start justify-start mt-2">
              {lastResults?.slice(0, 30).map((item, i) => (
                <div
                  key={i}
                  className={`px-2 min-w-[40px] text-center bg-${
                    item?.type === 1
                      ? "green"
                      : item?.type === 2
                      ? "yellow"
                      : item?.type === 3
                      ? "[#F85050]"
                      : "black"
                  } text-white rounded-full mx-1`}
                >
                  {item?.multipler}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* {openHeightListModal && (
        <div className="fixed inset-0 z-50 flex left-0 top-[6rem] justify-center">
          <div className="h-64 w-[350px] bg-black bg-opacity-50 rounded-lg shadow-lg flex flex-col items-start justify-start overflow-y-auto p-2 text-white">
            Game History
            <div className="w-full flex flex-wrap gap-2 items-start justify-start mt-2">
              {lastResults?.slice(0, 30).map((item, i) => (
                <div
                  key={i}
                  className={`px-2 min-w-[40px] text-center bg-${
                    item?.type === 1
                      ? "green"
                      : item?.type === 2
                      ? "yellow"
                      : item?.type === 3
                      ? "[#F85050]"
                      : "black"
                  } text-white rounded-full mx-1`}
                >
                  {item?.multipler}
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#007C80] shadow-lg rounded-lg p-2 w-[220px] grid grid-cols-3 gap-2">
          {[10, 20, 50, 100, 200, 500].map((amount) => (
            <div
              key={amount}
              onClick={() => {
                setAmount(amount);
                setShowPopup(!showPopup);
              }}
              className="py-1 text-center bg-[#08565A] border border-black text-white rounded-md hover:bg-gray-600 cursor-pointer text-sm"
            >
              {amount}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlinkoHome;
