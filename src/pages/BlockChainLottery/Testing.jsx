import { useState } from "react";
import BCLHeader from "./BCLHeader";
import { FaMinus, FaPlus } from "react-icons/fa";
import { TiArrowShuffle } from "react-icons/ti";
import { HiOutlineTicket } from "react-icons/hi2";
import ball1 from "../../assets/BCLAssets/ball1.svg";
import ball2 from "../../assets/BCLAssets/ball2.svg";
import ball3 from "../../assets/BCLAssets/ball3.svg";
import ball4 from "../../assets/BCLAssets/ball4.svg";
import ball5 from "../../assets/BCLAssets/ball5.svg";
import ball6 from "../../assets/BCLAssets/ball6.svg";
import ball7 from "../../assets/BCLAssets/ball7.svg";
import ball8 from "../../assets/BCLAssets/ball8.svg";
import ball9 from "../../assets/BCLAssets/ball9.svg";
import ball10 from "../../assets/BCLAssets/ball10.svg";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoChevronBack } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
function Testing() {
  const userId = localStorage.getItem("userId");
  const [profileRefresher, setProfileRefresher] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [betAmount, setBetAmount] = useState(0.1);
  const [gameResultData, setGameResultData] = useState([]);
  const [gameResultHistory, setGameResultHistory] = useState([]);
  const [isResultModal, setIsResultModal] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [numbers, setNumbers] = useState(
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
  );
  const [tickets, setTickets] = useState([]);
  const [multipleQuantity, setMultipleQuantity] = useState(10);

  // State for editing tickets
  const [editIndex, setEditIndex] = useState(null);
  const [editNumbers, setEditNumbers] = useState(
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
  );

  const increaseNumber = (index) => {
    setNumbers((prev) => {
      const updated = [...prev];
      updated[index] = (updated[index] + 1) % 10;
      return updated;
    });
  };

  const decreaseNumber = (index) => {
    setNumbers((prev) => {
      const updated = [...prev];
      updated[index] = (updated[index] - 1 + 10) % 10;
      return updated;
    });
  };

  const handleLuckyDip = () => {
    const randomNumbers = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    );
    setNumbers(randomNumbers);
  };

  const handleAddTicket = () => {
    if (!isMultiple) {
      setTickets((prev) => [...prev, [...numbers]]);
      setNumbers(
        Array(6)
          .fill(0)
          .map(() => Math.floor(Math.random() * 9) + 1)
      );
    } else {
      const qty = Number(multipleQuantity);
      if (qty <= 0 || isNaN(qty)) return;

      const newTickets = [];
      for (let i = 0; i < qty; i++) {
        const randomTicket = Array.from({ length: 6 }, () =>
          Math.floor(Math.random() * 10)
        );
        newTickets.push(randomTicket);
      }
      setTickets((prev) => [...prev, ...newTickets]);
    }
  };
console.log(tickets, "tickets");
  // Edit handlers
  const startEditing = (index) => {
    setEditIndex(index);
    setEditNumbers(tickets[index]);
  };

  const saveEditing = () => {
    setTickets((prev) => {
      const updated = [...prev];
      updated[editIndex] = [...editNumbers];
      return updated;
    });
    setEditIndex(null);
  };

  const cancelEditing = () => {
    setEditIndex(null);
  };

  const handlePreviousTicket = () => {
    if (editIndex > 0) {
      const newIndex = editIndex - 1;
      setEditIndex(newIndex);
      setEditNumbers([...tickets[newIndex]]);
    }
  };

  const handleNextTicket = () => {
    if (editIndex < tickets.length - 1) {
      const newIndex = editIndex + 1;
      setEditIndex(newIndex);
      setEditNumbers([...tickets[newIndex]]);
    }
  };

  // apis
  const betHandler = async () => {
    const payload = {
      userid: userId,
      game_id: 19,
      selected_numbers: JSON.stringify(tickets),
    };
    try {
      // console.log("payload",payload);
      const response = await axios.post(`${apis?.gameon_lottery_bet}`, payload);
      // console.log("response", response);
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      }
    } catch (err) {
      // console.log("err", err);
      if (err?.response?.data?.status === 500) {
        console.log("err0", err);
      } else {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  // console.log("ticketstickets",tickets)
  return (
    <div
      className="h-full w-full overflow-y-scroll justify-between flex flex-col items-center hide-scrollbar"
      style={{ background: "#0D1B2A" }}
    >
      <div className="w-full">
        <BCLHeader
          profileRefresher={profileRefresher}
          gameResultHistory={gameResultHistory}
          setProfileRefresher={setProfileRefresher}
        />
        <div
          className="mt-3 font-sans font-extrabold text-xl text-white flex items-center justify-center"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          TOTAL JACKPOT
        </div>

        <div className="mt-2 flex items-center justify-center ">
          <div className="h-[60px] w-[247px] rounded-3xl border-[2px] border-white flex items-center justify-center shadow-lg">
            <div className="h-[52px] w-60 rounded-3xl bg-gradient-to-r from-yellow to-orange-500 text-black text-xl font-extrabold flex items-center justify-center shadow-lg">
              GUC 1,00,000
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2 px-2  w-full">
          <div className="flex justify-between bg-[#9FE0FE] rounded py-0.5 w-full shadow-lg">
          {[1, 3, 24].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-0.5 rounded w-full flex items-center justify-center border transition-all duration-300 text-xsm font-sans font-bold ${
                activeTab === tab
                  ? "bg-[#0D3A63] text-white"
                  : "hover:text-gray bg-lightGray"
              }`}
            >
              {tab} Hour
            </button>
          ))}
          </div>
        </div>
        {/* toggle game type */}
        <div>
          <div className="mt-4 flex items-center justify-center ">
            <div className="h-10 w-72 bg-[#0D3A63] items-center justify-center text-white text-[8px] pt-2 rounded-lg">
              <div className="flex items-center justify-center text-white text-[8px]">
                Draw everyday 3:00 PM (GMT)
              </div>
              <div className="flex items-center justify-center text-white text-[12px] font-extrabold gap-2">
                NEXT DRAW ON
                <div className="text-orange-500 text-[12px] font-bold">
                  WED 28 MAY
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="mt-3 flex items-center justify-center">
            <div className="flex overflow-hidden w-72 bg-[#0D3A63] rounded-full">
              <button
                className={`w-1/2 py-2 text-[14px] font-bold transition-all duration-300 rounded-l-full ${
                  !isMultiple
                    ? "bg-[#AAFCB8] text-[#0D3A63]"
                    : "text-[#AAFCB8] bg-transparent"
                }`}
                onClick={() => setIsMultiple(false)}
              >
                Single Ticket
              </button>
              <button
                className={`w-1/2 py-2 text-[14px] font-bold transition-all duration-300 rounded-r-full ${
                  isMultiple
                    ? "bg-[#AAFCB8] text-[#0E50B3]"
                    : "text-[#AAFCB8] bg-transparent"
                }`}
                onClick={() => setIsMultiple(true)}
              >
                Multiple Ticket
              </button>
            </div>
          </div>

          {!isMultiple ? (
            <div>
              {/* Number Selectors */}
              <div className="mt-4 flex justify-center gap-3">
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(to top, #9FE0FE, #9FE0FE, #D6F2FE, #F0FAFE)",
                    }}
                  >
                    <button
                      className="text-[#0E50B3] font-bold p-1"
                      onClick={() => increaseNumber(index)}
                    >
                      <FaPlus />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center text-black text-xl font-bold shadow-inner">
                      {num}
                    </div>
                    <button
                      className="text-[#0E50B3] font-bold p-1"
                      onClick={() => decreaseNumber(index)}
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
              </div>

              {/* Lucky Dip & Add Ticket */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="h-10 w-32 border-2 border-[#AAFCB8] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                  onClick={handleLuckyDip}
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#AAFCB8] text-[20px] text-black">
                    <TiArrowShuffle />
                  </div>
                  <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]">
                    Lucky Dip
                  </div>
                </div>

                <div
                  className="h-10 w-32 border-2 border-[#2C69D0] bg-[#2C69D0] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                  onClick={handleAddTicket}
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#2654B4] text-[20px] text-[#AAFCB8]">
                    <HiOutlineTicket />
                  </div>
                  <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]">
                    Add ticket
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="m-6 text-[12px] font-mono font-bold">
                Quantity of tickets
              </div>
              <div className="flex items-center justify-center">
                <div className="h-14 w-80 rounded-xl border border-[#AAFCB8] flex items-center justify-center px-4">
                  <input
                    type="number"
                    value={multipleQuantity}
                    onChange={(e) => setMultipleQuantity(e.target.value)}
                    className="w-full h-full bg-transparent text-[#AAFCB8] text-center text-3xl font-roboto font-bold outline-none placeholder-[#AAFCB8]"
                    min={1}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div
                  className="h-10 w-40 border-2 border-[#2C69D0] bg-[#2C69D0] rounded-3xl flex items-start justify-start mt-3 cursor-pointer"
                  onClick={handleAddTicket}
                >
                  <div className="flex items-center justify-center h-9 w-9 rounded-3xl bg-[#2654B4] text-[20px] text-[#AAFCB8]">
                    <HiOutlineTicket />
                  </div>
                  <div className="flex items-center justify-center pl-1 pt-[7px] text-[14px]">
                    Add {multipleQuantity} ticket
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ticket List */}
          <div className="mt-6 mx-6 h-56 rounded-2xl border border-[#1f4fa4] overflow-hidden">
            <div
              className="text-white text-lg font-bold  h-14 rounded-t-2xl flex items-center justify-between px-4 shadow-lg"
              style={{
                background: "linear-gradient(145deg, #3c75da, #1f4fa4)",
              }}
            >
              <div className="flex flex-col justify-center">
                <div className="text-gray-300 text-sm font-bold">
                  Draw #8912
                </div>
                <div className="text-gray-300 text-xs font-bold">
                  May 28 20:30
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-gray-300 text-xs font-bold">
                  Last winning number
                </div>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="relative h-4 w-4">
                      <img
                        src={
                          index + 1 === 1
                            ? ball1
                            : index + 1 === 2
                            ? ball2
                            : index + 1 === 3
                            ? ball3
                            : index + 1 === 4
                            ? ball4
                            : index + 1 === 5
                            ? ball5
                            : ball6
                        }
                        alt=""
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {tickets.length > 0 ? (
              <div className="flex items-center justify-between  m-2">
                <div className="text-slate-100 text-[12px] p-2">
                  {tickets.length} ticket
                </div>
                <div
                  className="font-mono text-[12px] text-[#AAFCB8] cursor-pointer"
                  onClick={() => setTickets([])}
                >
                  clear
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center -mt-10">
                <p>
                  {" "}
                  <HiOutlineTicket
                    size={40}
                    className="text-redAviator "
                  />{" "}
                </p>
                <p>No ticket found , please add ticket</p>
              </div>
            )}

            {/* 👇 Scrollable ticket list only */}
            <div className=" max-h-32 overflow-y-auto pr-1 flex flex-col items-center ">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="mb-3 flex gap-2 flex-wrap rounded-lg p-3 w-80 items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #3c75da, #1f4fa4)",
                  }}
                >
                  <span className="text-white text-xs font-roboto font-extrabold mr-2">
                    #{index + 1}
                  </span>
                  {ticket.map((num, idx) => (
                    <div key={idx} className="relative h-6 w-6">
                      <img
                        src={
                          num === 0
                            ? ball1
                            : num === 1
                            ? ball2
                            : num === 2
                            ? ball3
                            : num === 3
                            ? ball4
                            : num === 4
                            ? ball5
                            : num === 5
                            ? ball6
                            : num === 6
                            ? ball7
                            : num === 7
                            ? ball8
                            : num === 8
                            ? ball9
                            : ball10
                        }
                        alt=""
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                        {num}
                      </div>
                    </div>
                  ))}
                  <div className=" flex justify-center gap-1">
                    <button
                      className="group h-5 w-5 rounded-full text-[12px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                      onClick={() => startEditing(index)}
                    >
                      {" "}
                      <MdOutlineModeEdit className="text-white group-hover:text-black" />
                    </button>

                    <button
                      className="group h-5 w-5 rounded-full text-[12px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                      onClick={() => {
                        setTickets(tickets.filter((_, i) => index !== i));
                      }}
                    >
                      <RxCross2 className="text-white group-hover:text-black" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal/UI */}
            {editIndex !== null && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
                onClick={cancelEditing}
              >
                <div
                  className="bg-[#0D1B2A] rounded-2xl  flex flex-col items-center gap-4 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="text-white font-bold">
                      Edit Ticket #{editIndex + 1}
                    </div>

                    <button
                      className="group h-8 w-8 rounded-full text-[15px] flex items-center justify-center bg-blue-950 hover:bg-[#AAFCB8]"
                      onClick={cancelEditing}
                    >
                      <RxCross2 className="text-white group-hover:text-black" />
                    </button>
                  </div>

                  <div className="h-[1px] w-full bg-gray"></div>

                  <div className="flex gap-5">
                    {editNumbers.map((num, i) => (
                      <div key={i} className="relative h-10 w-10">
                        <img
                          src={
                            num === 0
                              ? ball1
                              : num === 1
                              ? ball2
                              : num === 2
                              ? ball3
                              : num === 3
                              ? ball4
                              : num === 4
                              ? ball5
                              : num === 5
                              ? ball6
                              : num === 6
                              ? ball7
                              : num === 7
                              ? ball8
                              : num === 8
                              ? ball9
                              : ball10
                          }
                          alt=""
                          className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-black text-[10px] font-bold">
                          {num}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {editNumbers.map((num, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center rounded-lg"
                        style={{
                          background:
                            "linear-gradient(to top, #9FE0FE, #9FE0FE, #D6F2FE, #F0FAFE)",
                        }}
                      >
                        <button
                          className="text-[#0E50B3] font-bold p-1"
                          onClick={() =>
                            setEditNumbers((prev) => {
                              const copy = [...prev];
                              copy[i] = (copy[i] + 1) % 10;
                              return copy;
                            })
                          }
                        >
                          <FaPlus />
                        </button>
                        <div className="w-12 h-10 flex items-center justify-center text-black text-xl font-bold shadow-inner">
                          {editNumbers[i]}
                        </div>
                        <button
                          className="text-[#0E50B3] font-bold p-1"
                          onClick={() =>
                            setEditNumbers((prev) => {
                              const copy = [...prev];
                              copy[i] = (copy[i] - 1 + 10) % 10;
                              return copy;
                            })
                          }
                        >
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      className=" text-white font-normal px-4 py-2 rounded-full text-[10px] flex items-center gap-2"
                      onClick={handlePreviousTicket}
                      disabled={editIndex === 0}
                    >
                      <IoChevronBack /> Privious ticket
                    </button>
                    <button
                      className=" text-white font-normal text-[10px] px-4 py-2 rounded-full"
                      onClick={saveEditing}
                      style={{
                        background: "linear-gradient(145deg, #3c75da, #1f4fa4)",
                      }}
                    >
                      Save changes
                    </button>
                    <button
                      className=" text-white font-normal px-4 py-2 rounded-full text-[10px] flex items-center gap-2"
                      onClick={handleNextTicket}
                      disabled={editIndex === tickets.length - 1}
                    >
                      Next ticket <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mt-3 px-2 flex items-center justify-between xs1:mt-0">
        <button
          onClick={() => betHandler()}
          className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-11 w-full font-serif font-bold text-[14px] m-2 rounded-2xl flex items-center justify-center"
        >
          BET
        </button>
      </div>
      {/* {isResultModal && (
        <ResultModal
          onClose={() => setIsResultModal(false)}
          announcementData={gameResultDataAnnouncemnt}
        />
      )} */}
    </div>
  );
}

export default Testing;
