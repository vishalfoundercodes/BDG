
import React, { useState } from 'react';
import { TiMinus } from "react-icons/ti";
import { BsDatabase } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { IoIosRefresh } from "react-icons/io";


function BCLFooter({ betAmount, setBetAmount }) {
    const [showPopup, setShowPopup] = useState(false);
  
    const decreaseBet = () => setBetAmount(prev => Math.max(1, prev - 1));
    const increaseBet = () => setBetAmount(prev => prev + 1);
    const togglePopup = () => setShowPopup(prev => !prev);
    const selectBetAmount = (amount) => {
      setBetAmount(amount);
      setShowPopup(false);
    };
  
    return (
      <div className="relative">
        <div className='flex items-center justify-center p-2 mt-0 xsm:mt-2'>
          <div className='sm:h-36 w-full rounded-lg bg-[#0D3A63] px-4 py-1 xsm:p-4'>
            <div className='h-14 w-full rounded-3xl bg-[#2C69D0] border-[0.5px] border-black pt-2'>
              <div className='flex justify-between items-center'>
                <div className='pl-4'>
                  <div className='text-white pl-12 font-serif text-[12px]'>BET</div>
                  <div className='h-6 w-32 bg-[#2654B4] border-black border-[0.5px] text-center rounded-3xl text-white'>
                    {betAmount}
                  </div>
                </div>
                <div className='flex pr-6 space-x-3'>
                  <div className='h-7 w-7 bg-[#2654B4] rounded-full flex items-center justify-center border-black border-[0.5px]'>
                    <button onClick={decreaseBet}>
                      <TiMinus className="text-[24px] text-white" />
                    </button>
                  </div>
                  <div className='h-7 w-7 bg-[#2654B4] rounded-full flex items-center justify-center border-black border-[0.5px]'>
                    <button onClick={togglePopup}>
                      <BsDatabase className="text-[20px] text-white" />
                    </button>
                  </div>
                  <div className='h-7 w-7 bg-[#2654B4] rounded-full flex items-center justify-center border-black border-[0.5px]'>
                    <button onClick={increaseBet}>
                      <IoMdAdd className="text-[24px] text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div className='flex items-center justify-between'>
              <button
                className="relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] h-11 w-full font-serif font-bold text-[14px] m-2 rounded-2xl flex items-center justify-center">
                BET
              </button>
            </div>
  
            {showPopup && (
              <div className='absolute -top-32 right-12 bg-[#] z-50 shadow-lg rounded-lg p-2 w-72 grid grid-cols-3 gap-2 border-black border-[0.5px]'>
                {[10, 20, 50, 100, 200, 500].map((amount) => (
                  <div
                    key={amount}
                    onClick={() => selectBetAmount(amount)}
                    className='p-2 text-center bg-[#444444] border-black border-[0.5px] text-white rounded-lg hover:bg-gray-600 cursor-pointer'>
                    {amount}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  

export default BCLFooter;
