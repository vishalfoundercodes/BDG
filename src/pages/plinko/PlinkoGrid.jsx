/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import Matter from "matter-js";

const PlinkoGrid = ({ betId, setBetId, ballDropped, setballDropped, getNumbersList, betAndDropId, betAndDropStatus, setBetAndDrop }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 490,
        wireframes: false,
        background: "transparent",
      },
    });

    // Set background to transparent
    render.canvas.style.background = "transparent";

    // **Plinko Pegs (grid layout)**
    const pegs = [];
    const rows = 14;
    const canvasWidth = 400;
    const baseX = canvasWidth / 2; // Centered in the canvas
    // Reduce friction on pegs and the ball
    const pegOptions = {
      isStatic: true,
      friction: 0,
      restitution: 0.8, // Higher bounce
      render: { fillStyle: "white" },
    };
    for (let row = 2; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        // Center the V-shape pyramid
        const offsetX = (col - row / 2) * 30;
        const offsetY = row * 30;
        const peg = Matter.Bodies.circle(baseX + offsetX, 50 + offsetY, 5, pegOptions);
        pegs.push(peg);
      }
    }

    // V-Shaped Walls
    const leftWall = Matter.Bodies.rectangle(135, 60, 100, 5, {
      isStatic: true,
      angle: Math.PI * 0.25,
      // render: { fillStyle: "gray" },
      render: { visible: false }
    });

    const rightWall = Matter.Bodies.rectangle(265, 60, 100, 5, {
      isStatic: true,
      angle: -Math.PI * 0.25,
      // render: { fillStyle: "gray" },
      render: { visible: false }

    });
    // Side Walls(x,y,w,h)
    const sideLeft = Matter.Bodies.rectangle(-5, 250, 10, 500, { isStatic: true, render: { visible: true } });
    const sideRight = Matter.Bodies.rectangle(405, 250, 10, 500, { isStatic: true, render: { visible: true } });

    // **Bottom Slots**
    // const slotWidth = 39;
    // const slots = [];

    // for (let i = 0; i < getNumbersList?.data1?.length; i++) {
    //   const slotX = i * slotWidth + 25;
    //   const slot = Matter.Bodies.rectangle(slotX, 460, 5, 10, {
    //     isStatic: true,
    //     isSensor: true, // Detects collision without affecting physics
    //     label: `slot-${i}`,
    //     render: { visible: false },
    //   });

    //   slots.push(slot);
    // }


    // **Add Everything to the World**
    Matter.World.add(world, [leftWall, rightWall, sideLeft, sideRight, ...pegs]);
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
    const l = 195;
    const r = 210;
    const randomX = Math.random() * (r - l) + l;
    const ball = Matter.Bodies.circle(randomX, 10, 10, {
      restitution: 0.4,  // Lower bounce (was 0.8)
      friction: 0.2,     // Adds resistance to movement
      density: 0.02,     // Makes the ball heavier
      frictionAir: 0.02, // Slows it down in the air
      render: { fillStyle: "yellow" },
      label: "ball",
    });
    // const ball = Matter.Bodies.circle(randomX, 10, 10, {
    //   restitution: 0.8,
    //   friction: 0,
    //   render: { fillStyle: "yellow" },
    //   label: "ball",
    // });

    Matter.World.add(engineRef.current.world, ball);

    Matter.Events.on(engineRef.current, "afterUpdate", () => {
      if (ball.position.y > 460) { 
        const ballX = ball.position.x;
        const slotWidth = 26; 
        const dropIndex = (Math.round((ballX) / slotWidth)); 
        if (dropIndex) {
          setBetId(dropIndex)
          setballDropped(true)
        } else if (dropIndex === 0) {
          setBetId(1)
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
    <div className="flex flex-col items-center mx-auto">
      <div className="relative mx-auto -mt-5" ref={sceneRef}></div>
      <div className="flex justify-center gap-1.5  -mt-5">
        {getNumbersList?.data1?.map((num, index) => {
          const i = betId > 5 ? index + 1 : index
          return (
            <div
              key={index}
              className={`${(betId === i + 1 && ballDropped) ? "animate-zoomIn scale-110" : ""} ${betAndDropId === 1 ? "border-white" : "border-green"} border-[1px] relative  bg-gradient-to-tr from-[#448B02] to-[#5FAF09] text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] rounded-sm h-5 w-[25px] flex items-center justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black/50`}
            >
              {num?.multiplier}
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-1.5   mt-1">
        {getNumbersList?.data2?.map((num, index) => {
          const i = betId > 5 ? index + 1 : index
          return (
            <div
              key={index}
              className={`${(betId === i + 1 && ballDropped) ? "animate-zoomIn scale-110" : ""} ${betAndDropId === 1 ? "border-white" : "border-green"} relative bg-gradient-to-tr from-[#C47400] to-[#DD9600] text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] rounded-sm h-5 w-[25px] flex items-center justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black/50`}
            >
              {num?.multiplier}
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-1.5   mt-1">
        {getNumbersList?.data3?.map((num, index) => {
          const i = betId > 5 ? index + 1 : index
          return (
            <div
              key={index}
              className={`${(betId === i + 1 && ballDropped) ? "animate-zoomIn scale-110" : ""} ${betAndDropId === 1 ? "border-white" : "border-green"} relative bg-gradient-to-tr from-[#F5240C] to-[#CC1C00] text-white text-[10px] shadow-lg drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] rounded-sm h-5 w-[25px] flex items-center justify-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#981204]/90`}
            >
              {num?.multiplier}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PlinkoGrid;
