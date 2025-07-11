import React from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Link } from 'react-router-dom'
import bethistory from "../../assets/Andarbahar/bethistory.png";



function Headtailheader() {
    return (
        <div className='flex px-4  items-center justify-between bg-gradient-to-l from-red to-redLight h-[3.22rem]'>
            <button className='flex items-center gap-2'>
                <Link to={-1} >
                    <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
                </Link>
            <p className='text-sm'>Head Tail</p>
            </button>
            <Link to=""
                className="col-span-1 bg-gradient-to-l from-red to-redLight" >
                <img className="h-12 w-12" src={bethistory} alt="ds" />
            </Link>
        </div>
    )
}

export default Headtailheader
