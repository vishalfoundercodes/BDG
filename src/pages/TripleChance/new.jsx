import React, { useState } from "react";
import t_chance_bg from "../../assets/TripelChance/t_chance_bg.png";
import t_c_result_bg from "../../assets/TripelChance/t_c_result_bg.png";
import double_slide_bg from "../../assets/TripelChance/double_slide_bg.png";
import s_h_btn_bg from "../../assets/TripelChance/s_h_btn_bg.png";
import s_btn_bg from "../../assets/TripelChance/s_btn_bg.png";
import triple_grid_bg from "../../assets/TripelChance/triple_grid_bg.png";
import circle_bg from "../../assets/TripelChance/circle_bg.png";
import first_wheel from "../../assets/TripelChance/first_wheel.png";
import second_wheel from "../../assets/TripelChance/second_wheel.png";
import third_wheel from "../../assets/TripelChance/third_wheel.png";
import t_center_circle from "../../assets/TripelChance/t_center_circle.png";
import triple_text from "../../assets/TripelChance/triple_text.png";
import select_bg from "../../assets/TripelChance/select_bg.png";
import balance_bg from "../../assets/TripelChance/balance_bg.png";
import t_slide_bg_newH from "../../assets/TripelChance/t_slide_bg_newH.png";
import TripleChanceHeader from "./TripleChanceHeader";
import { IoTriangle } from "react-icons/io5";

function TripleChancehome() {
  const [selectedStart, setSelectedStart] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const toggleModal = (name) => {
    setActiveModal((prev) => (prev === name ? null : name));
  };

  const doublelist = [5, 10, 15, 20, 25, 50, 75];

  return (
    <div
      className="h-full min-h-screen overflow-y-scroll hide-scrollbar bg-center"
      style={{
        backgroundImage: `url(${t_chance_bg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <TripleChanceHeader />
      {/* Serial + Timer */}

      <div className="flex justify-between mx-4 my-2">
        <div
          className="relative h-8 w-36 text-[10px] font-roboto text-center text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={t_c_result_bg}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex items-center justify-center h-full px-2">
            S.no:- 1234567890987
          </div>
        </div>
        <div
          className="relative h-8 w-24 text-center text-[20px] font-bold font-mono text-white overflow-hidden"
          style={{ textShadow: "1px 1px 3px black" }}
        >
          <img
            src={t_c_result_bg}
            alt="Balance"
            className="absolute inset-0 w-full h-full opacity-90"
          />
          <div className="relative flex items-center justify-center h-full px-2">
            00:55
          </div>
        </div>
      </div>

      <div className=" flex w-full flex-col px-4 justify-center items-center relative bg-black z-50">
        {/* WRAPPER to make wheel not shift */}
        <div className="w-full relative z-50">
          {/* SINGLE */}
          <div className="relative w-full z-10">
            <button
              onClick={() => toggleModal("single")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">SINGLE</p>
              <IoTriangle size={20} className="text-green rotate-180 z-10" />
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">PLAY:0</p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">WIN:0</p>
            </button>

            {activeModal === "single" && (
              <div
                className="absolute top-full left-0 w-full z-50"
                style={{
                  backgroundImage: `url(${select_bg})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                }}
              >
                <div className="flex space-x-1 w-full items-center justify-center m-1">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const specialIndexes = [1, 2, 5, 6, 9];
                    const bgColor = specialIndexes.includes(index)
                      ? "bg-[#ffa6ff]"
                      : "bg-[#52f395]";
                    return (
                      <div
                        key={index}
                        className={`h-7 w-8 shadow-md flex items-center justify-center rounded text-black text-[11px] ${bgColor}`}
                      >
                        {index}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* DOUBLE */}
          <div
            className={`relative w-full z-10 ${
              activeModal === "single" ? "mt-[40px]" : ""
            }`}
          >
            <button
              onClick={() => toggleModal("double")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">DOUBLE</p>
              <IoTriangle size={20} className="text-green rotate-180 z-10" />
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">PLAY:0</p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">WIN:0</p>
            </button>

            {activeModal === "double" && (
              <div className="absolute top-full left-0 w-full bg-slate-300 z-50">
                {[...Array(8)].map((_, i) => (
                  <p className="text-center text-xs py-2" key={i}>
                    Double Modal Content
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* TRIPLE */}
          <div
            className={`relative w-full z-10 ${
              activeModal === "double" ? "mt-[16.3rem]" : ""
            }`}
          >
            <button
              onClick={() => toggleModal("triple")}
              className="relative w-full h-7 flex items-center justify-around text-white text-[10px]"
            >
              <img
                src={t_slide_bg_newH}
                className="absolute inset-0 w-full h-7 z-0"
              />
              <p className="z-10">TRIPLE</p>
              <IoTriangle size={20} className="text-green rotate-180 z-10 ml-1.5" />
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">PLAY:0</p>
              <p className="bg-[#741618] px-2 h-4.5 rounded z-10">WIN:0</p>
            </button>

            {activeModal === "triple" && (
              <div className="absolute top-full left-0 w-full bg-black z-50">
                {[...Array(10)].map((_, i) => (
                  <p className="text-center text-xs py-2" key={i}>
                    Triple Modal Content
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* other contetn */}
      <div className="relative h-72 mx-4 my-2 overflow-hidden">
        {/* Background Image */}
        <img
          src={double_slide_bg}
          alt="Double Slide Background"
          className="absolute inset-0 w-full h-full "
        />

        {/* Foreground Elements */}
        <div className="relative z-10 flex justify-between items-center h-full p-2 gap-1">
          {/* <div className="h-40 w-5 bg-lime-300 rounded shadow-md"></div> */}
          <div className="flex flex-col space-y-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-5 w-4 rounded shadow-md mr-1">
                <img src={s_h_btn_bg} alt="" className="h-full w-full" />
              </div>
            ))}
          </div>
          {/* <div className="h-60 w-full bg-lime-300 rounded shadow-md"></div> */}
          <div className="mt-5">
            <div className="h-60 w-full shadow-md overflow-auto">
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 100 }).map((_, index) => {
                  const row = Math.floor(index / 10);
                  const col = index % 10;
                  const bgColor =
                    (row + col) % 2 === 0 ? "bg-[#52f395]" : "bg-[#ffa6ff]";
                  return (
                    <div
                      key={index}
                      className={`w-6 h-5 flex items-center justify-center text-black text-[11px] ${bgColor}`}
                    >
                      {index.toString().padStart(2, "0")}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-10  gap-1 ">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-4 flex items-center justify-center text-white  text-[11px] 
                                                `}
                >
                  <img src={s_btn_bg} alt="" className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="h-60 w-10 rounded shadow-md ml-1 mt-2">
            <div className="flex flex-col space-y-1">
              {doublelist.map((num, index) => (
                <div
                  key={index}
                  className="h-[30px] w-8  bg-[#741618] rounded shadow-md mr-1 flex items-center justify-center font-mono font-bold text-[12px]"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* chakra */}
      <div className="flex items-center justify-center m-4">
        <div className="h-80 w-80 rounded-full relative overflow-hidden">
          {/* Background Circle */}
          <img
            src={circle_bg}
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0"
          />

          {/* First Wheel - Front Layer */}
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={first_wheel}
              alt="First Wheel (Front)"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={second_wheel}
              alt="First Wheel (Front)"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={third_wheel}
              alt="First Wheel (Front)"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={t_center_circle}
              alt="First Wheel (Front)"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-9 h-9 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={triple_text}
              alt="First Wheel (Front)"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripleChancehome;
