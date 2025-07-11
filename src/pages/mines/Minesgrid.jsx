/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import './grid.css';
import minesgridImg from "../../assets/Mines/mine_grid.png";
import mineIcon from "../../assets/Mines/mine.png";
import giftIcon from "../../assets/Mines/vault.png";
import explosionSound from '../../assets/Mines/blastSound.mp3';

function Minesgrid({ restartGame,setRestartGame, setMultiplierIndex, setIsRevealStarted, selectedMines, gameStarted, onGameOver }) {
    const gridSize = 30; // Total grid size
    const [minePositions, setMinePositions] = useState([]);
    const [revealedCells, setRevealedCells] = useState(new Set());
    const [gameOver, setGameOver] = useState(false);

    const generateMines = () => {
        const newMines = new Set();
        while (newMines.size < selectedMines) {
            newMines.add(Math.floor(Math.random() * gridSize));
        }
        setMinePositions([...newMines]);
        setRevealedCells(new Set());
        setGameOver(false);
    };
    // console.log("selectedMines", selectedMines)
    useEffect(() => {
        generateMines();
    }, [selectedMines]);

    const handleClick = (index) => {
        if (!gameStarted || revealedCells.has(index)) return;
        setIsRevealStarted(true)

        if (minePositions.includes(index)) {
            const sound = new Audio(explosionSound);
            sound.play();    
            setGameOver(true);
            setMultiplierIndex(new Set())
            setRevealedCells(new Set([...minePositions, ...Array.from({ length: gridSize }, (_, i) => i)])); // Show all mines and gifts
            setTimeout(() => {
                onGameOver(); // Reset game
            }, 2000);
        } else {
            setMultiplierIndex((prev) => new Set(prev).add(index))
            setRevealedCells((prev) => new Set(prev).add(index));
        }
    };
    useEffect(() => {
        if (restartGame) {
            generateMines()
            setRestartGame(false)
        }
    }, [restartGame])
    // console.log("gameOver", gameOver)
    // console.log("game restartGame",restartGame)

    return (
        <div className="grid-container">
            {[...Array(gridSize)].map((_, index) => (
                <div
                    key={index}
                    className={`grid-box cursor-pointer `}
                    onClick={() => handleClick(index)}
                >
                    {revealedCells.has(index) ? (
                        minePositions.includes(index) ? (
                            <img src={mineIcon} alt="Mine" className="grid-image" />
                        ) : (
                            <img src={giftIcon} alt="Gift" className="grid-image" />
                        )
                    ) : (
                        <img src={minesgridImg} alt="Grid Item" className="grid-image" />
                    )}
                </div>
            ))}

         {/* {gameOver && (
                <button onClick={generateMines} className='relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-black text-[18px] shadow-lg h-12 w-[200px] m-2 rounded-2xl flex items-center justify-center'>
                    Restart Game
                </button>
            )} */}
        </div>
    );
}

export default Minesgrid;
