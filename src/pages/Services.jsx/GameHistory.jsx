import { useEffect, useState } from 'react'
// import deco_first from "../../assets/images/deco_first.png"
// import deco_four from "../../assets/images/deco_four.png"
// import DragonTiger from "../../assets/dragontiger/DragonTiger.png"
// import fan_aviator from "../../assets/aviator/fan_aviator.png"
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
// import no_data_available from '../../assets/images/no_data_available.png';
// import plonkoicon from '../../assets/icons/plonkoicon.png';
// import { RxDashboard } from 'react-icons/rx'
import gameStattic from "../../assets/usaAsset/wallet/gameStats.png"
import apis from '../../utils/apis';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function GameHistory() {
  // const [toggleGame, setToggleGame] = useState(1)
  // const [activeIndex, setActiveIndex] = useState(false);
  // const [toggleWingoGame, setToggleWingoGame] = useState(1)
  const [activeModal, setActiveModal] = useState(1);
  const [gameStats, setGameStats] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate()
  const toggleModal = (modalType) => {
    setActiveModal((prev) => (prev === modalType ? modalType : modalType));
  };

  const gameStatsHandler = async (typ) => {
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`${apis.gameStatsHistory}${userId}&type=${typ}`)
      if (res?.data?.status === 200) {
        setGameStats(res?.data)
      }
      console.log(res)
    } catch (err) {
      toast.error(err)
    }
  }

  useEffect(() => {
    if (userId) {
      gameStatsHandler(activeModal)
    }
  }, [userId,activeModal])
  const gameKeys = Object.keys(gameStats).filter(key => key.endsWith('_data'));

  console.log("gameStats", gameStats)
  return (
    <>
      <div className="hide-scrollbar overflow-x-auto py-3 mx-3">
        <div className="flex gap-1.5 text-xs ">
          <div
            className={` py-1.5 flex-shrink-0 flex items-center justify-center shadow-lg rounded-full ${
              activeModal === 1
                ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#8F5206]"
                : "bg-redLight text-[#A8A5A1]"
            }  px-5 cursor-pointer`}
            onClick={() => toggleModal(1)}
          >
            <p className=" text-nowrap">Today</p>
          </div>
          <div
            className={`w- py-1.5 flex-shrink-0 flex items-center justify-center shadow-lg rounded-full ${
              activeModal === 2
                ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#8F5206]"
                : "bg-redLight text-[#A8A5A1]"
            }  px-5 cursor-pointer`}
            onClick={() => toggleModal(2)}
          >
            <p className="  text-nowrap">Yesterday</p>
          </div>

          <div
            className={`w- py-1.5 flex-shrink-0 flex items-center justify-center shadow-lg rounded-full ${
              activeModal === 3
                ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#8F5206]"
                : "bg-redLight text-[#A8A5A1]"
            }  px-5 cursor-pointer`}
            onClick={() => toggleModal(3)}
          >
            <p className=" text-nowrap">This weak</p>
          </div>
          <div
            className={`w- py-1.5 flex-shrink-0 flex items-center justify-center shadow-lg rounded-full ${
              activeModal === 4
                ? "bg-gradient-to-r from-[#EDD188] to-[#C79744] text-[#8F5206]"
                : "bg-redLight text-[#A8A5A1]"
            }  px-5 cursor-pointer`}
            onClick={() => toggleModal(4)}
          >
            <p className=" text-nowrap">This month</p>
          </div>
        </div>
      </div>
      <div className="mt-3 px-3">
        <div className="h-32 rounded-lg flex flex-col items-center justify-center bg-redLight">
          <p className="font-bold text-xl text-yellow">
            <span>₹</span>
            {gameStats?.status === 200
              ? gameStats?.grand_total.toFixed(2) || "0.00"
              : "0.00"}
          </p>
          <p className="mt-3">Total bet</p>
        </div>
      </div>
      <div className="px-3 mt-3 ">
        <div className="rounded-lg p-3  bg-redLight text-white">
          {gameKeys.map((key) => {
            const title = key.replace("_data", "");
            const data = gameStats[key];
            return (
              <div key={key} className="">
                <div className="flex items-center gap-2">
                  <img className="w-8 h-8" src={gameStattic} alt="sd" />
                  <p className="text-white text-sm font-bold capitalize">
                    {title}
                  </p>
                </div>
                <div className="flex ml-10 text-[15px] items-center justify-between mt-2.5 gap-2">
                  <p>Total bet</p>
                  <p className="text-white">
                    <span>
                      <span>₹</span>
                    </span>
                    {data?.total_bet_amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="flex ml-10 text-[15px] items-center justify-between mt-2.5 gap-2">
                  <p>Number of bets</p>
                  <p className="text-amber-400">
                    {data?.total_bet_count || "0"}
                  </p>
                </div>
                <div className="flex ml-10 text-[15px] items-center justify-between mt-2.5 gap-2">
                  <p>Winning amount</p>
                  <p className="text-yellow">
                    <span>₹</span>

                    {data?.total_win_amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="flex items-center gap-4 justify-start mt-3 px-4 w-full sm:w-[540px] md:w-[400px] hide-scrollbar overflow-x-auto">
        {[
          { id: 1, img: deco_first, label: "Wingo" },
          { id: 2, img: deco_four, label: "Trx" },
          { id: 3, img: DragonTiger, label: "Dragon Tiger" },
          { id: 4, img: fan_aviator, label: "Aviator" },
          { id: 5, img: plonkoicon, label: "Plinko" },
        ].map((game, index) => (
          <div
            key={index}
            onClick={() => setToggleGame(game.id)}
            className={`flex items-center justify-between gap-3 ${toggleGame === game?.id ? "bg-bg3 text-white" : "bg-slate-200 text-gray"} rounded-md py-4 px-2 min-w-[140px] shadow-sm hover:shadow-md cursor-pointer`}
          >
            <img src={game.img} className="w-10 h-8" alt={game.label} />
            <p className="text-xs font-bold">{game.label}</p>
          </div>
        ))}
      </div>
      {toggleGame === 1 ? <div className="mt-4 bg-bg2 flex items-center justify-evenly px-2 text-xs font-bold pb-5 pt-2">
        <p onClick={() => setToggleWingoGame(1)} className={`border-bg3 ${toggleWingoGame === 1 ? "border-b-2" : "border-b-0"} pb-2`}>WinGo 1 min</p>
        <p onClick={() => setToggleWingoGame(2)} className={`border-bg3 ${toggleWingoGame === 2 ? "border-b-2" : "border-b-0"} pb-2`}>WinGo 3 min</p>
        <p onClick={() => setToggleWingoGame(3)} className={`border-bg3 ${toggleWingoGame === 3 ? "border-b-2" : "border-b-0"} pb-2`}>WinGo 5 min</p>
        <p onClick={() => setToggleWingoGame(4)} className={`border-bg3 ${toggleWingoGame === 4 ? "border-b-2" : "border-b-0"} pb-2`}>WinGo 10 min</p>
      </div> : toggleGame === 2 ? <div className="mt-4 bg-bg2 flex items-center justify-evenly px-2 text-xs font-bold pb-5 pt-2">
        <p onClick={() => setToggleWingoGame(1)} className={`border-bg3 ${toggleWingoGame === 1 ? "border-b-2" : "border-b-0"} pb-2`}>Trx 1 min</p>
        <p onClick={() => setToggleWingoGame(2)} className={`border-bg3 ${toggleWingoGame === 2 ? "border-b-2" : "border-b-0"} pb-2`}>Trx 3 min</p>
        <p onClick={() => setToggleWingoGame(3)} className={`border-bg3 ${toggleWingoGame === 3 ? "border-b-2" : "border-b-0"} pb-2`}>Trx 5 min</p>
        <p onClick={() => setToggleWingoGame(4)} className={`border-bg3 ${toggleWingoGame === 4 ? "border-b-2" : "border-b-0"} pb-2`}>Trx 10 min</p>
      </div> : ""}
      {toggleGame === 1 && (toggleWingoGame && < div className='mx-3'>
        <div className="px-4 w-full mt-3 text-xs">
          <div
            className="bg-bg2 rounded-md px-4 py-2 grid grid-cols-3"
            onClick={() => setActiveIndex(!activeIndex)}
          >
            <div className="col-span-2 flex gap-2">
              <div className="w-10 h-10 flex flex-col rounded-md font-bold overflow-hidden relative">

                <div
                  className={`flex-1 flex items-center justify-center bg-red`}
                >
                  R
                </div>

                <div className="absolute inset-0 flex items-center justify-center text-white">

                </div>

              </div>
              <div>
                <p>111115655</p>
                <p className="text-gray">02-01-2025 14:20:50</p>
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <div>
                <div
                  className={`font-bold text-green flex items-center justify-center border w-20 h-8 rounded-md`}
                >
                  Success
                </div>
                <div
                  className={`font-bold text-green text-center`}
                >
                  +152
                </div>
              </div>
            </div>
          </div>

          {activeIndex && (
            <div className="w-full gap-2 mt-3 text-sm">
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Order number</p>
                <p>45662623232</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Period</p>
                <p>1 min</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Purchase amount</p>
                <p>1</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Amount after tax</p>
                <p className="text-red">0.55</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Tax</p>
                <p>0.25</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Result</p>
                <p>
                  2,red,small
                </p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Select</p>
                <p>2</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Status</p>
                <p> <span className="text-green">Succeed</span></p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Win/Loss</p>
                <p> <span className="text-green">45</span></p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Order time</p>
                <p>02-01-2025 14:20:50</p>
              </div>
            </div>
          )}
        </div>
      </div >)}
      {toggleGame === 2 && (toggleWingoGame && < div className='mx-3'>
        <div className="px-4 w-full mt-3 text-xs">
          <div
            className="bg-bg2 rounded-md px-4 py-2 grid grid-cols-3"
            onClick={() => setActiveIndex(!activeIndex)}
          >
            <div className="col-span-2 flex gap-2">
              <div className="w-10 h-10 flex flex-col rounded-md font-bold overflow-hidden relative">

                <div
                  className={`flex-1 flex items-center justify-center bg-red`}
                >
                  
                </div>

                <div className="absolute inset-0 flex items-center justify-center text-white">

                </div>

              </div>
              <div>
                <p>111115655</p>
                <p className="text-gray text-xs">02-01-2025 14:20:50</p>
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <div>
                <div
                  className={`font-bold text-green flex items-center justify-center border w-20 h-8 rounded-md`}
                >
                  Success
                </div>
                <div
                  className={`font-bold text-green text-center`}
                >
                  +152
                </div>
              </div>
            </div>
          </div>

          {activeIndex && (
            <div className="w-full gap-2 mt-3 text-sm">
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Order number</p>
                <p>45662623232</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Period</p>
                <p>1 min</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Purchase amount</p>
                <p>1</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Amount after tax</p>
                <p className="text-red">0.55</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Tax</p>
                <p>0.25</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Result</p>
                <p>
                  2,red,small
                </p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Select</p>
                <p>2</p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Status</p>
                <p> <span className="text-green">Succeed</span></p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Win/Loss</p>
                <p> <span className="text-green">45</span></p>
              </div>
              <div className="bg-bg2 w-full mt-1 py-2 flex items-center justify-between px-2 text-white rounded-md">
                <p>Order time</p>
                <p>02-01-2025 14:20:50</p>
              </div>
            </div>
          )}
        </div>
      </div >)}
      {(toggleGame === 3 || toggleGame === 4 || toggleGame === 5) && (
        <div className='mt-10 w-[90%] flex flex-col items-center'>
          <img src={no_data_available} alt="No data available" />
          <p className='mt-10'>No data</p>
        </div>
      )}

      <div className="pagination rounded-md flex bg-bg2 py-2 sm:py-3 md:py-2 items-center justify-center gap-10 mt-5 mb-5 mx-4">
        <button
          className="flex items-center justify-center font-semibold w-10 sm:w-16 md:w-10 text-sm sm:text-lg md:text-sm py-2 sm:py-4 md:py-2 rounded-lg bg-bg4 text-gray-400"
        >
          <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
        </button>
        <p className="text-gray-400">{1}/{5}</p>
        <button
          // onClick={onNextClick}
          className="flex items-center justify-center font-semibold w-10 sm:w-16 md:w-10 text-sm sm:text-lg md:text-sm py-2 sm:py-4 md:py-2 rounded-lg bg-bg3 text-white"
        // disabled={nextDisabled}
        >
          <MdKeyboardArrowRight className="font-extrabold text-4xl text-white" />
        </button>
      </div> */}
    </>
  );
}

export default GameHistory