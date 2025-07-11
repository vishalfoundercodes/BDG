/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Link } from 'react-router-dom'
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../reusable_component/gameApi';

function PlinkoHeader({ profileRefresher }) {
    const userId = localStorage.getItem("userId")

    const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
    useEffect(() => {
        if (profileRefresher?.first|| profileRefresher?.second) {
            fetchProfileDetails()
        }
    }, [profileRefresher])
    return (
        <div>
            <div className='h-10 w-full rounded-lg bg-[#0D5574]  flex items-center justify-between px-2'>
                <div className='flex items-start justify-start'>
                    <div className='h-7 w-24 bg-[#007C80] rounded-xl flex items-center justify-between pr-4 border-black border-[0.5px] mr-1'>
                        <Link to={-1} >
                            <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
                        </Link>
                        <p className='text-white font-serif font-semibold text-[12px]'>PLINKO</p>
                    </div>
                    <div className='h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]'>
                        <div >
                            <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
                        </div>
                    </div>
                </div>
                <div className='flex items-start justify-start'>
                    <div>{myDetails ? myDetails?.data?.wallet : 0.00} </div>
                    {/* <div>{myDetails ? myDetails?.data?.winning_wallet : 0.00} </div> */}
                    {/* <div className='h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1'>
                        <Link to="#" >
                            <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
                        </Link>
                    </div> */}
                </div>





            </div>


        </div>
    )
}

export default PlinkoHeader
