/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from "../../reusable_component/gameApi";
import FunTargetSocket from "./FunTargetSocket";
import MenuModal from "./MenuModal";
function FunTargetHeader({
  profileRefresher,
  gameResultHistory,
  setProfileRefresher,
  timeLeft,
}) {
  const userId = localStorage.getItem("userId");
  const [toggleMenu, setToggleMenu] = useState(false);
  const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
  const toggleMenuModal = (value) => {
    setToggleMenu(value);
  };

  useEffect(() => {
    if (profileRefresher) {
      fetchProfileDetails();
      setProfileRefresher(false);
    }
  }, [profileRefresher, userId]);

  useEffect(() => {
    if (timeLeft?.timerBetTime === 3 && timeLeft?.timerStatus === 2) {
      fetchProfileDetails();
    }
  }, [timeLeft]);
  return (
    <div>
      <div className="h-10 w-full rounded-b-lg  border-l-2 border-r-2 border-b-2 border-[#c6a120] bg-yellow flex items-center justify-between px-2">
        <div className="flex items-start justify-start">
          <div className="h-7 w-36  bg-gradient-to-l from-[#F48711] to-[#F79816]   rounded-xl flex items-center justify-between pr-4 border-black border-[1px] mr-1">
            <Link to={-1}>
              <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
            </Link>
            <p className="text-white font-serif font-semibold text-[12px]">
              FUN TARGET
            </p>
          </div>
          <div className="h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]">
            <div>
              <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
            </div>
          </div>
        </div>
        <div className="flex items-start justify-start">
          <div>
            {myDetails ? Number(myDetails?.data?.wallet).toFixed(2) : 0.0}{" "}
          </div>
          <div className="h-7 w-7 bg-gradient-to-l bg-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1">
            <button onClick={() => toggleMenuModal(true)}>
              <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
            </button>
          </div>
        </div>
      </div>
      {toggleMenu && (
        <MenuModal data={gameResultHistory} setToggleMenu={setToggleMenu} />
      )}
    </div>
  );
}

export default FunTargetHeader;
