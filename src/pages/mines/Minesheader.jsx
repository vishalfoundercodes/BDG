/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { MdHistory, MdKeyboardArrowLeft } from "react-icons/md"
import { Link } from 'react-router-dom'
import { PiQuestionBold } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import useProfile from '../../reusable_component/gameApi';
import axios from 'axios';
import apis from '../../utils/apis';
import { toast } from 'react-toastify';

function Minesheader({ profileRefresher, setProfileRefresher }) {
    const [minesandResult, setMinesandResult] = useState(null);
    const [modal, setModal] = useState(false);
    const modalRef = useRef(null);

    const userId = localStorage.getItem("userId")
    const { myDetails, loading, error, fetchProfileDetails } = useProfile(userId);
    // console.log("myDetails", myDetails)
    const MInesResuilt = async () => {
        try {
            const res = await axios.get(`${apis?.mines_result}${userId}`)
            console.log("res", res)
            if (res?.data?.status === 200 || res?.data?.status === "200") {
                setMinesandResult(res?.data?.data)
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("Server error", err)
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    }

    useEffect(() => {
        if (profileRefresher?.first) {
            fetchProfileDetails()
            MInesResuilt()
            setProfileRefresher({ first: false, second: false })
        }
    }, [profileRefresher?.first])

    useEffect(() => {
        MInesResuilt()
    }, [])

    // Close modal on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModal(false);
            }
        }
        if (modal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modal]);

    return (
      <div>
        <div className="h-10 w-full rounded-lg bg-[#0D5574] flex items-center justify-between px-2">
          <div className="flex items-start justify-start">
            <div className="h-7 w-24 bg-[#007C80] rounded-xl flex items-center justify-between pr-4 border-black border-[0.5px] mr-1">
              <Link to={-1}>
                <MdKeyboardArrowLeft className="font-extrabold text-4xl text-white" />
              </Link>
              <p className="text-white font-serif font-semibold text-[12px]">
                Mines
              </p>
            </div>
            <div className="h-7 w-7 bg-gradient-to-l from-[#F48711] to-[#F79816] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px]">
              <Link to={-1}>
                <PiQuestionBold className="font-extrabold text-[24px] text-black flex items-center justify-center pl-1" />
              </Link>
            </div>
          </div>
          <div className="flex items-start justify-start">
            <div className="text-white">
              {Number(myDetails?.data?.wallet).toFixed(2)}{" "}
            </div>
            <div className="h-7 w-7 bg-gradient-to-l bg-[#007C80] rounded-[100%] flex items-center justify-between pr-4 border-black border-[0.5px] ml-1">
              <button onClick={() => setModal(true)} className="">
                <GiHamburgerMenu className="font-extrabold text-[24px] text-white flex items-center justify-center pl-1" />
              </button>
            </div>
          </div>
        </div>

        {/* {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center pt-10">
            <div
              ref={modalRef}
              className="bg-[#2C2D30] rounded-xl w-[360px] h-72 shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-2 p-2 flex items-center text-white">
                Bet History
                <MdHistory />
              </h2>

              
              <div className="overflow-y-auto max-h-[400px] hide-scrollbar">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-[#007C80] text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 border-b">Time</th>
                      <th className="px-1 py-2 border-b">Bet</th>
                      <th className="px-1 py-2 border-b">Cashout</th>
                      <th className="px-1 py-2 border-b">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {minesandResult && minesandResult.length > 0 ? (
                      minesandResult.map((item, i) => (
                        <tr key={i} className="bg-gray mt-1 text-xsm ">
                          <td className="px-2 py-2 border-b text-nowrap">
                            {item?.created_at?.slice(0, 10)}&nbsp;
                            {item?.created_at?.slice(11, 19)}
                          </td>
                          <td className="px-1 py-2 border-b">{item?.amount}</td>
                          <td className="px-1 py-2 border-b">
                            {item?.win_amount}
                          </td>
                          <td className="px-1 py-2 border-b">
                            {item?.multipler}x
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-2">
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )} */}

        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center pt-10">
            <div
              ref={modalRef}
              className="bg-[#2C2D30] rounded-xl w-[360px] h-72 shadow-lg relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setModal(false)}
                className="absolute top-2 right-3 text-white text-lg font-bold hover:text-red-400 cursor-pointer"
              >
                ×
              </button>

              <h2 className="text-lg font-semibold mb-2 p-2 flex items-center text-white">
                Bet History
                {/* <MdHistory className="ml-2" /> */}
              </h2>

              <div className="overflow-y-auto max-h-[400px] hide-scrollbar">
                <table className="min-w-full text-sm text-left">
                  <thead className=" text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 border-b">Time</th>
                      <th className="px-1 py-2 border-b">Bet</th>
                      <th className="px-1 py-2 border-b">Cashout</th>
                      <th className="px-1 py-2 border-b">Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {minesandResult && minesandResult.length > 0 ? (
                      minesandResult.map((item, i) => (
                        <tr key={i} className=" mt-1 text-xsm">
                          <td className="px-2 py-2 border-b text-nowrap">
                            {item?.created_at?.slice(0, 10)}&nbsp;
                            {item?.created_at?.slice(11, 19)}
                          </td>
                          <td className="px-1 py-2 border-b">{item?.amount}</td>
                          <td className="px-1 py-2 border-b">
                            {item?.win_amount}
                          </td>
                          <td className="px-1 py-2 border-b">
                            {item?.multipler}x
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-2">
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Minesheader;
