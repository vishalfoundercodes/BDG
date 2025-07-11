/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Link } from 'react-router-dom'
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../reusable_component/gameApi';
import MenuModal from './MenuModal';

function BCLHeader({balls, profileRefresher, gameResultHistory, setProfileRefresher ,timer}) {
    const userId = localStorage.getItem("userId")
    const [toggleMenu, setToggleMenu] = useState(false)
    const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
  

    const toggleMenuModal = (value) => {
        setToggleMenu(value)
    }

    useEffect(() => {
        if (profileRefresher) {
            fetchProfileDetails();
            setProfileRefresher(false)
        }
    }, [profileRefresher, userId])
// console.log("myDetailsmyDetails",myDetails)
    useEffect(() => {
        if (timer === 25) {
            fetchProfileDetails()
        }
    }, [timer]);
    return (
        <div>
            <div className='h-10 w-full rounded-b-lg bg-[#0D3A63]  flex items-center justify-between px-2'>
                <div className='flex items-start justify-start'>
                    <div className='h-7  bg-[#4f74a7] rounded-xl flex items-center justify-between pr-4 border-black border-[0.5px] mr-1'>
                        <Link to={-1} >
                            <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
                        </Link>
                        <p className='text-white font-serif font-semibold text-[12px]'>Gameon Lottery</p>
                    </div>
                    <div className='h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]'>
                        <div >
                            <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
                        </div>
                    </div>
                </div>
                <div className='flex items-start justify-start'>
                    <div>{myDetails ? Number(myDetails?.data?.wallet).toFixed(2) : 0.00} </div>
                    <div className='h-7 w-7 bg-gradient-to-l bg-[#4f74a7] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1'>
                        <button onClick={() => toggleMenuModal(true)} >
                            <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
                        </button>
                    </div>
                </div>
            </div>
            {toggleMenu && <MenuModal balls={balls} data={gameResultHistory} setToggleMenu={setToggleMenu} />}
        </div>
    )
}

export default BCLHeader

