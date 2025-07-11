
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Link } from 'react-router-dom'
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../reusable_component/gameApi';
import MenuModal from './MenuModal';
import SevenUpDownSocket from './SevenUpDownSocket';

function SevenUpHeader({ profileRefresher, gameResultHistory, setProfileRefresher  }) {
       const userId = localStorage.getItem("userId")
    const [toggleMenu, setToggleMenu] = useState(false)
    const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const handleSocket = (hotair) => {
            const q = JSON.parse(hotair);
            setTimeLeft(q?.timerBetTime);
        };
        SevenUpDownSocket.on("demo_7up", handleSocket);
        return () => SevenUpDownSocket.off("demo_7up", handleSocket);
    }, []);

    const toggleMenuModal = (value) => {
        setToggleMenu(value)
    }

    useEffect(() => {
        if (profileRefresher) {
            fetchProfileDetails();
            setProfileRefresher(false)
        }
    }, [profileRefresher, userId])

    useEffect(() => {
        if (timeLeft === 3) {
            fetchProfileDetails()
        }
    }, [timeLeft]);
    return (
        <div>
            <div className='h-10 w-full rounded-lg bg-[#0066CC]  flex items-center justify-between px-2'>
                <div className='flex items-start justify-start'>
                    <div className='h-7 w-32 bg-[#3399FF] rounded-xl flex items-center justify-between pr-4 border-black border-[0.5px] mr-1'>
                        <Link to={-1} >
                            <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
                        </Link>
                        <p className='text-white font-serif font-semibold text-[12px]'>7 Up Down</p>
                    </div>
                    <div className='h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]'>
                        <div >
                            <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
                        </div>
                    </div>
                </div>
                <div className='flex items-start justify-start'>
                    <div>{myDetails ? Number(myDetails?.data?.wallet) : 0} </div>
                    <div className='h-7 w-7 bg-gradient-to-l bg-[#FF4D4D] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1'>
                        <button onClick={() => toggleMenuModal(true)} >
                            <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
                        </button>
                    </div>
                </div>
            </div>
            {toggleMenu && <MenuModal data={gameResultHistory} setToggleMenu={setToggleMenu} />}

        </div>
    )
}

export default SevenUpHeader
