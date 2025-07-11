/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const PlinkoGridMobile = ({ betId, setBetId, ballDropped, setballDropped, getNumbersList, betAndDropId, betAndDropStatus, setBetAndDrop }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); 

  useEffect(() => {
    console.log("ballDropped", ballDropped);

  }, [ballDropped])
  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: isMobile > 400 ? 410 : isMobile > 420 ? 420 : isMobile > 389 ? 385 : 355,
        height: 415,
        wireframes: false,
        background: "transparent",
      },
    });

    render.canvas.style.background = "transparent";
    const pegs = [];
    const rows = 14;
    const canvasWidth = isMobile > 400 ? 410 : isMobile > 420 ? 420 : isMobile > 389 ? 385 : 355;
    const baseX = canvasWidth / 2; 

    for (let row = 2; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        const f = isMobile > 400 ? 30 : isMobile > 389 ? 28 : 26.5
        const offsetX = (col - row / 2) * f;
        const offsetY = row * 27;
        const peg = Matter.Bodies.circle(baseX + offsetX, 50 + offsetY, 5, {
          isStatic: true,
          render: { fillStyle: "white" },
        });

        pegs.push(peg);
      }
    }

    const leftWall = Matter.Bodies.rectangle(0, 250, 10, 500, {
      isStatic: true,
      render: { visible: false }, 
    });
    const rightWall = Matter.Bodies.rectangle(canvasWidth, 250, 10, 500, {
      isStatic: true,
      render: { visible: false },
    });

    // **Add Everything to the World**
    // Matter.World.add(world, [leftWall, rightWall, ...pegs, ...slots]);
    Matter.World.add(world, [leftWall, rightWall, ...pegs]);
    // Matter.World.add(world, [...pegs]);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (!betAndDropStatus || !engineRef.current) return;

    // **Drop the ball**
    const l = 170;
    const h = 200;
    const randomX = Math.random() * (h - l) + l;
    console.log("randomXrandomX"), randomX
    const ball = Matter.Bodies.circle(randomX, 40, 6, {
      restitution: 0.4,  // Lower bounce (was 0.8)
      friction: 0.1,     // Adds resistance to movement
      density: 0.02,     // Makes the ball heavier
      frictionAir: 0.02, // Slows it down in the air
      render: { fillStyle: "yellow" },
      label: "ball",
      // restitution: 0.8,
      // render: { fillStyle: "yellow" },
    });

    Matter.World.add(engineRef.current.world, ball);
    Matter.Events.on(engineRef.current, "afterUpdate", () => {
      if (ball.position.y > 400) { 
        const ballX = ball.position.x;
        const slotWidth = isMobile > 400 ? 30 : isMobile > 389 ? 29 : 27; 
        const dropIndex = (Math.round((ballX) / slotWidth));
        console.log("dropindex", dropIndex)
        if (dropIndex) {
          setBetId(dropIndex)
          setballDropped(true)
        }
        Matter.Events.off(engineRef.current, "afterUpdate");
      }
    });
   
  }, [betAndDropStatus, setBetAndDrop]);

  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const handleCollision = (event) => {
      event.pairs.forEach((collision) => {
        let slotIndex = -1;
        let ball;
        if (collision.bodyA.label.startsWith("Circle Body")) {
          slotIndex = parseInt(collision.bodyA.label.replace("slot-", ""), 10);
          ball = collision.bodyB;
        } else if (collision.bodyB.label.startsWith("Circle Body")) {
          slotIndex = parseInt(collision.bodyB.label.replace("slot-", ""), 10);
          ball = collision.bodyA;
        }
      });
    };

    Matter.Events.on(engine, "collisionActive", handleCollision);

    return () => {
      Matter.Events.off(engine, "collisionActive", handleCollision);
    };
  }, []);
 
  return (
    <div className="flex flex-col items-center z-10">
      <div className="relative z-10 -mt-14 w-full xs1:w-[390px] xs:w-[400px] flex justify-center" ref={sceneRef}></div>
      <div className="flex justify-center w-full overflow-x-auto">
        {getNumbersList?.data1?.map((num, index) => {
          return (
            <div
              key={index}
              className={`${(betId === index + 1 && ballDropped && num?.type === 1) ? "animate-zoomIn scale-110" : ""} 
            ${betAndDropId === 1 ? "border-black" : "border-green"} 
            border-[1px] relative bg-gradient-to-tr from-[#448B02] to-[#5FAF09] 
            text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] 
            rounded-sm h-5 w-[27px] xs1:w-[28px] xs:w-[30px] flex items-center 
            justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 
            after:w-full after:h-[2px] after:bg-black/50`}
            >
              {num?.multiplier}
            </div>

          )
        })}
      </div>
      <div className="flex justify-center w-full overflow-x-auto">
        {getNumbersList?.data2?.map((num, index) => (
          <div
            key={index}
            className={`${(betId === index + 1 && ballDropped && num?.type === 1) ? "animate-zoomIn scale-110" : ""} ${betAndDropId === 2 ? "border-black" : "border-green"} border-[1px] relative bg-gradient-to-tr from-[#C47400] to-[#DD9600] text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] rounded-sm h-5 5 w-[27px] xs1:w-[28px] xs:w-[30px] flex items-center justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black/50`}
          >
            {num?.multiplier}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full overflow-x-auto">
        {getNumbersList?.data3?.map((num, index) => (
          <div
            key={index}
            className={`${(betId === index + 1 && ballDropped && num?.type === 1) ? "animate-zoomIn scale-110" : ""} ${betAndDropId === 3 ? "border-black" : "border-green"} border-[1px] relative bg-gradient-to-tr from-[#F5240C] to-[#CC1C00] text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] rounded-sm h-5 5 w-[27px] xs1:w-[28px] xs:w-[30px] flex items-center justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#981204]/90`}
          >
            {num?.multiplier}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlinkoGridMobile;
