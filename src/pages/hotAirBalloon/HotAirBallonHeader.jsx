/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from "../../reusable_component/gameApi";
import HotAirBallonSocket from "./HotAirBallonSocket";
import backgroundMusic from "../../assets/music/backgroundMusic.mp3";
import crashmusic from "../../assets/music/blast.mp3";
import { motion } from "framer-motion";
import { AiTwotoneSound } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoToggleSharp } from "react-icons/io5";
import { PiToggleLeftFill } from "react-icons/pi";
import bg from "../../assets/ballon/bg.png";
import balloon_bg from "../../assets/ballon/balloon_bg.png";
import { GoHistory } from "react-icons/go";

const bgImages = [bg, balloon_bg];

function HotAirBallonHeader({
  betApiHitted,
  changeBg,
  setChangeBg,
  isSoundOn,
  setIsSoundOn,
  setIsHistoryModal,
}) {
  const userId = localStorage.getItem("userId");
  const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
  const [timeLeft, setTimeLeft] = useState(0);
  const modalRef = useRef(null);
  const audioRef = useRef(null);
  const audioRefCrash = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setTimeLeft(q);
    };
    HotAirBallonSocket.on("demo_hotair", handleSocket);
    return () => HotAirBallonSocket.off("demo_hotair", handleSocket);
  }, []);

  // const [isSoundOn, setIsSoundOn] = useState(true);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [
    betApiHitted?.cancel1,
    betApiHitted?.cancel2,
    betApiHitted?.bet1,
    betApiHitted?.bet2,
    betApiHitted?.cashout1,
    betApiHitted?.cashout2,
  ]);

  const [bgMusicStatus, setBgMusicStatus] = useState(
    localStorage.getItem("hotairballon_bg_music") === "true"
  );
  const BackgroundMusicHandler = (status) => {
    setBgMusicStatus(status);
    localStorage.setItem("hotairballon_bg_music", status.toString());
  };

  useEffect(() => {
    const status = localStorage.getItem("hotairballon_bg_music");
    setBgMusicStatus(status === "true");
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play();
    };

    audio.addEventListener("ended", handleEnded);

    if (bgMusicStatus === true) {
      audio.play().catch((error) => console.error("Audio play error:", error));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [bgMusicStatus]);
  // ballon blast music
  useEffect(() => {
    if (audioRefCrash.current) {
      if (timeLeft?.status === 2) {
        audioRefCrash.current
          .play()
          .catch((error) => console.error("Audio play error:", error));
      } else {
        audioRefCrash.current.pause();
        audioRefCrash.current.currentTime = 0;
      }
    }
  }, [timeLeft?.status]);

  const bgHandler = (item, i) => {
    setIsOpen(false);
    setChangeBg({ modal: !changeBg?.modal, selectBg: true, image: item });
    localStorage.setItem("hotAirBallonBg", JSON.stringify(i));
  };
  const im = localStorage.getItem("hotAirBallonBg");
  
  return (
    <div>
      <audio ref={audioRefCrash} src={crashmusic} preload="auto" />
      <audio ref={audioRef} src={backgroundMusic} preload="auto" />
      <div className="h-10 w-full rounded-b-lg bg-[#9b9393] bg-opacity-60 flex items-center justify-between px-2">
        <div className="flex items-start justify-start">
          <div className="h-7 w-36 bg-[#444444] rounded-xl flex items-center justify-between pr-4 border-black border-[0.5px] mr-1">
            <Link to={-1}>
              <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
            </Link>
            <p className="text-white font-serif font-semibold text-[12px]">
              Hot air ballon
            </p>
          </div>
          <div className="h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]">
            <div>
              <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
            </div>
          </div>
        </div>
        <div className="flex items-start justify-start">
          <div>{myDetails ? Number(myDetails?.data?.wallet) : 0} </div>
          <div className="h-7 w-7 bg-gradient-to-l bg-[#444444] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1">
            <button onClick={() => toggleModal(true)}>
              <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute pointer-events-auto top-10 z-[60] right-10 xsm:right-52 lg:right-[38%] text-white w-[250px] xsm:w-[310px] border-gray border-[1px] bg-blackAviator1 shadow-lg rounded-lg "
        >
          <div className="text-sm border-blackAviator4 border-b-[1px] p-2  flex items-center justify-between bg-blackAviator4 rounded-t-lg"></div>
          <div className="flex items-center border-blackAviator4 border-b-[1px] px-1 justify-between">
            <div className="flex items-center gap-3">
              <p>
                <AiTwotoneSound className="text-gray" size={20} />{" "}
              </p>
              <p className="text-[13px]">Sound</p>
            </div>
            {bgMusicStatus ? (
              <button onClick={() => BackgroundMusicHandler(false)}>
                <IoToggleSharp className="text-green" size={35} />{" "}
              </button>
            ) : (
              <button onClick={() => BackgroundMusicHandler(true)}>
                <PiToggleLeftFill className="text-gray" size={35} />{" "}
              </button>
            )}
          </div>
          <div className="flex items-center border-blackAviator4 border-b-[1px] p-1 justify-between">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsHistoryModal(true);
              }}
              className="flex items-center gap-3"
            >
              <p>
                {" "}
                <GoHistory
                  className="font-bold text-gray font-mono"
                  size={20}
                />{" "}
              </p>
              <p className="text-[13px]">Bet history </p>
            </button>
            <div></div>
          </div>
          <div className="flex items-center border-blackAviator4 border-b-[1px] p-1 justify-between">
            <button
              onClick={() =>
                setChangeBg({
                  modal: !changeBg?.modal,
                  selectBg: false,
                  image: im,
                })
              }
              className="flex items-center gap-3"
            >
              <p>
                <FaEdit className="text-gray" size={20} />{" "}
              </p>
              <p className="text-[13px]">Change Backgound </p>
            </button>
            <div></div>
          </div>

          {changeBg?.modal && (
            <div className="grid grid-cols-2 gap-1 p-2">
              {bgImages?.map((item, i) => (
                <img
                  key={i}
                  onClick={() => bgHandler(item, i)}
                  className="w-full bg-blackLight h-28 object-fill rounded-xl col-span-1"
                  src={item}
                  alt="df"
                />
              ))}
            </div>
          )}
          <button
            onClick={toggleModal}
            className="mt-2 w-full font-bold text-center bg-red-500 text-white py-1 rounded-md text-xs"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default HotAirBallonHeader;
