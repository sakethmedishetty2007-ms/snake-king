import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving up
const BASE_SPEED = 150;

type Point = { x: number; y: number };

function generateFood(snake: Point[]): Point {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Make sure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use refs for state accessed frequently inside effect 
  // to avoid strict dependency array issues and rapid re-renders breaking logic
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
    if (keys.includes(e.key)) {
      e.preventDefault(); // Prevent scrolling
    }

    if (!isPlaying) {
      if ([' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
        startGame();
      }
      return;
    }

    const { x: dx, y: dy } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (dy !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
        if (dy !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
        if (dx !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
        if (dx !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
      case ' ':
      case 'Escape':
        setIsPlaying(p => !p); // pause
        break;
    }
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const currentSpeed = Math.max(50, BASE_SPEED - score * 2);

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        setDirection(nextDirectionRef.current);
        const nextHead = {
          x: head.x + nextDirectionRef.current.x,
          y: head.y + nextDirectionRef.current.y
        };

        // Collision Check: Walls
        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Collision Check: Self
        if (prevSnake.some(segment => segment.x === nextHead.x && segment.y === nextHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Eat food
        if (nextHead.x === food.x && nextHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // We don't pop the tail, so it grows
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, food, score]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* HUD components */}
      <div className="flex justify-between w-full max-w-sm px-4">
        <div className="flex flex-col">
          <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Score</span>
          <span className="text-white font-mono text-3xl font-bold">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-400 font-mono text-sm uppercase tracking-wider flex items-center gap-1 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]">
            <Trophy size={14} /> High
          </span>
          <span className="text-white font-mono text-3xl font-bold">{highScore}</span>
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative group rounded bg-slate-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-1 transition-all duration-300">
        
        {/* Glow effect slightly expanding on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 rounded blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>

        <div className="relative overflow-hidden border border-slate-700/50 bg-[#090a0f] rounded-sm"
             style={{
               width: `${GRID_SIZE * 20}px`,
               height: `${GRID_SIZE * 20}px`,
             }}>
          
          {/* Grid lines background style */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          ></div>

          {/* Rendering Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className="absolute"
                style={{
                  width: 20,
                  height: 20,
                  left: segment.x * 20,
                  top: segment.y * 20,
                  transition: 'background 0.1s linear' // small transition for smoothness
                }}
              >
                <div 
                  className={`w-full h-full border hover:border-white/50 ${
                    isHead 
                      ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,1)] z-10' 
                      : 'bg-cyan-600/80 border-cyan-400/30 shadow-[0_0_5px_rgba(8,145,178,0.5)] z-0'
                  }`}
                  style={{
                    borderRadius: isHead ? '4px' : '2px'
                  }}
                />
              </div>
            );
          })}

          {/* Rendering Food */}
          <div
            className="absolute rounded-full"
            style={{
              width: 16,
              height: 16,
              left: food.x * 20 + 2, // centering within 20x20 cell
              top: food.y * 20 + 2,
            }}
          >
            <div className="w-full h-full bg-fuchsia-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(217,70,239,1)]" />
          </div>

          {/* Overlays */}
          {(!hasStarted || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <h2 className={`font-black font-mono text-4xl mb-2 tracking-widest ${isGameOver ? 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]'}`}>
                {isGameOver ? 'GAME OVER' : 'NEON SNAKE'}
              </h2>
              <p className="text-slate-300 font-mono text-sm mb-8 mt-2 max-w-[200px]">
                {isGameOver ? 'Your circuits have failed.' : 'Use WASD or Arrows to move. Space to pause.'}
              </p>
              <button
                onClick={startGame}
                className="group relative flex items-center gap-2 px-6 py-3 font-mono font-bold text-slate-900 uppercase tracking-widest overflow-hidden rounded bg-cyan-400 hover:bg-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.9)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isGameOver ? <RotateCcw size={18} /> : <Play size={18} />}
                  {isGameOver ? 'RETRY' : 'START'}
                </span>
              </button>
            </div>
          )}
          
          {hasStarted && !isPlaying && !isGameOver && (
             <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center z-20">
               <span className="text-cyan-400 font-mono text-2xl font-bold tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">PAUSED</span>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
