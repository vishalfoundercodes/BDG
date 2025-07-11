import React, { useEffect, useState } from 'react';
import Minesheader from './Minesheader';
import Minesgrid from './Minesgrid';
import Minesbetfunction from './Minesbetfunction';
import { MdKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';
import  apis  from '../../utils/apis';
import { toast } from 'react-toastify';


function Mineshome() {
    // const userId = localStorage.getItem("userId")
    const [selectedOption, setSelectedOption] = useState(3);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [MultiplierIndex, setMultiplierIndex] = useState(new Set());
    const [minesandmulti, setMinesandmulti] = useState(null);
    const [restartGame, setRestartGame] = useState(false);
    const [isRevealStarted, setIsRevealStarted] = useState(false);
    const [profileRefresher, setProfileRefresher] = useState({ first: false, second: false });


    const MInesList = async () => {
        try {
            const res = await axios.get(`${apis?.mines_multiplier}`)
            // console.log("hey", res)
            if (res?.data?.status === 200 || res?.data?.status === "200") {
                setMinesandmulti(res?.data?.data)
            }
        } catch (err) {
            if (err?.response?.data?.status === 500) {
                console.log("er", err)
            } else {
                toast.error(err?.response?.data?.message)
            }
        }
    }
    const options = minesandmulti?.map((item) => item.name) || [];
    const minesMultiplierMap = new Map();
    minesandmulti?.forEach(item => {
        const numMines = parseInt(item.name.split(":")[1]);
        minesMultiplierMap.set(numMines, item.multiplier);
    });

    useEffect(() => {
        MInesList()
    }, [])
    const handleBetPlaced = () => {
        setGameStarted(true);  
    };

    const handleGameReset = () => {
        setGameStarted(false);
        setIsRevealStarted(false)
        setRestartGame(true)
        setSelectedOption(3)
    };
    return (
            <div style={{ background: "linear-gradient(to bottom, #0033cc, #0066ff, #0099ff)" }} className='h-screen overflow-y-scroll hide-scrollbar p-2'>
                <Minesheader profileRefresher={profileRefresher} setProfileRefresher={setProfileRefresher} />
                <div>
                    <div className='h-8 w-full rounded-2xl bg-[#0D5574] flex items-center justify-between mt-2 mb-2'>
                        <div className='relative'>
                            <div
                                className={`h-6 w-28 ${gameStarted ? 'bg-gray' : 'bg-[#007C80]'} rounded-2xl flex items-center justify-between border-black border-[0.5px] ml-1 cursor-pointer p-2`}
                                onClick={() => {
                                    if (!gameStarted) setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <span className='text-white text-xs pl-2'>{selectedOption} Mines</span>
                                <MdKeyboardArrowDown className='text-[20px] text-white' />
                            </div>
                            {isDropdownOpen && !gameStarted && (
                                <div className='absolute top-8 z-50 left-0 w-28 bg-slate-500 border border-black rounded-lg shadow-lg max-h-40 overflow-y-auto'>
                                    {options.map((option, index) => {
                                        const numMines = parseInt(option.split(":")[1]);
                                        return (
                                            <div
                                                key={index}
                                                className='p-2 text-white text-[10px] hover:bg-gray-200 cursor-pointer'
                                                onClick={() => {
                                                    setSelectedOption(numMines);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {option}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {/* Yellow Div showing multiplier */}
                        <div className='h-6 w-28 bg-yellow border border-black rounded-2xl mr-1 flex items-center justify-center text-xs'>
                            {Number(minesMultiplierMap.get(selectedOption)).toFixed(2) || "N/A"}x
                        </div>
                    </div>

                </div>

                <div className='h-2 w-full rounded-2xl bg-[#025596] mt-2 mb-2'></div>

                {/* Game Grid */}
                <div className='flex flex-col h-[calc(100%-100px)] lg:justify-between'>
                    <div>
                        <Minesgrid restartGame={restartGame} setRestartGame={setRestartGame} setMultiplierIndex={setMultiplierIndex} setIsRevealStarted={setIsRevealStarted} selectedMines={selectedOption} gameStarted={gameStarted} onGameOver={handleGameReset} />
                    </div>

                    {/* Bet Function Component */}
                    <Minesbetfunction
                        setProfileRefresher={setProfileRefresher}
                        multi={Number(minesMultiplierMap.get(selectedOption)).toFixed(2)}
                        minesMultiplier={minesMultiplierMap}
                        MultiplierIndex={MultiplierIndex}
                        isRevealStarted={isRevealStarted}
                        setIsRevealStarted={setIsRevealStarted}
                        onBetPlaced={handleBetPlaced}
                        gameStarted={gameStarted}
                        minesmultiplyer={minesMultiplierMap.get(selectedOption)}
                        setRestartGame={setRestartGame}
                        handleGameReset={handleGameReset}
                    />
                </div>
            </div>
        // </Layout>
    );
}

export default Mineshome;
