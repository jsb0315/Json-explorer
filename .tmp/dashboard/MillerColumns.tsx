import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const columnVariants = {
  enter: (direction: any) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: any) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function MillerColumnTest() {
  const [path, setPath] = useState([0]);
  const [direction, setDirection] = useState(1);

  const maxColumns = 3;
  const flexRatios = ['flex-[3]', 'flex-[3]', 'flex-[4]'];

  // 1. 현재 경로에서 최대 3개까지만 잘라냅니다.
  const slicedPath = path.slice(-maxColumns);

  // 💡 2. [핵심] 3개보다 부족하면 뒤쪽에 null을 채워 넣어 항상 길이가 3인 배열을 만듭니다.
  // 예: [0] -> [0, null, null] / [0, 1] -> [0, 1, null]
  const paddedPath = [
    ...slicedPath,
    ...Array(Math.max(0, maxColumns - slicedPath.length)).fill(null)
  ];

  const handleNext = () => {
    setDirection(1);
    setPath((prev) => [...prev, prev[prev.length - 1] + 1]);
  };

  const handlePrev = () => {
    if (path.length <= 1) return;
    setDirection(-1);
    setPath((prev) => prev.slice(0, -1));
  };

  return (
    <div className="w-full h-full bg-neutral-900 p-6 font-sans text-white">
      {/* 부모 컨테이너 */}
      <div className="w-full h-full bg-neutral-800 rounded-xl shadow-2xl overflow-hidden p-3 flex gap-4">
        
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {paddedPath.map((depth, index) => {
            const currentFlexClass = flexRatios[index] || 'flex-1';
            
            // 💡 현재 슬롯이 실제 데이터인지 Placeholder인지 판별
            const isPlaceholder = depth === null;
            const currentIdx = !isPlaceholder ? path.indexOf(depth) : -1;
            const isRoot = currentIdx === 0;

            return (
              <motion.div
                // 💡 Placeholder일 때는 고정 키값을 주어 애니메이션 대상에서 제외(제자리 유지)시킵니다.
                key={isPlaceholder ? `placeholder-${index}` : depth}
                custom={direction}
                variants={columnVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                layout
                className={`${currentFlexClass} min-w-0 h-full border rounded-lg flex flex-col overflow-hidden transition-colors duration-300
                  ${isPlaceholder 
                    ? 'bg-neutral-800/30 border-dashed border-neutral-700 text-neutral-500 z-0' 
                    : 'bg-neutral-700/50 border-neutral-600 text-white z-10'}`}
              >
                {/* 💡 조건부 렌더링: Placeholder 유무에 따른 분기 */}
                {isPlaceholder ? (
                  // 1) Placeholder 바디
                  <div className="flex flex-col items-center justify-center h-full p-5 text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <p className="text-xs font-medium text-neutral-500">
                      {index === 1 ? '상위 항목을 선택하세요' : '상세 내역을 보려면 선택하세요'}
                    </p>
                  </div>
                ) : (
                  // 2) 실제 데이터 컬럼 바디
                  <>
                    {/* 컬럼 헤더 */}
                    <div className="p-4 bg-neutral-700 font-bold border-b border-neutral-600 text-emerald-400 text-sm tracking-wide truncate">
                      ID: {depth}번 (Depth {currentIdx})
                    </div>
                    
                    {/* 컬럼 내용 */}
                    <div className="p-5 flex flex-col gap-3 flex-1 justify-center">
                      <button 
                        onClick={handleNext} 
                        className="w-full py-3 bg-emerald-400 hover:bg-emerald-500 text-neutral-900 font-bold rounded-md shadow-md transition-colors duration-200 text-sm"
                      >
                        👉 하위 탐색
                      </button>
                      
                      <button 
                        onClick={handlePrev} 
                        disabled={isRoot}
                        className={`w-full py-3 bg-neutral-600 text-white font-medium rounded-md border border-neutral-500 transition-all duration-200 text-sm
                          ${isRoot ? 'opacity-30 cursor-not-allowed' : 'hover:bg-neutral-500'}`}
                      >
                        👈 상위 이동
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
      </div>
    </div>
  );
}