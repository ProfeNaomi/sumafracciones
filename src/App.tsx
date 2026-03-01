import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Whole = ({ rows, cols, piecesInThisWhole, baseDirection, colorClass }: any) => {
  return (
    <div className={`grid border-4 border-stone-800 w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-md overflow-hidden shadow-sm`} style={{
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        let isPainted = false;
        if (baseDirection === 'horizontal') {
          isPainted = r < piecesInThisWhole;
        } else {
          isPainted = c < piecesInThisWhole;
        }
        return (
          <div 
            key={i} 
            className={`border border-stone-300 transition-colors duration-300 ${isPainted ? colorClass : 'bg-transparent'}`} 
          />
        )
      })}
    </div>
  )
}

const FractionVisualizer = ({ num, den, otherDen, showCommon, baseDirection, colorClass }: any) => {
  const wholesCount = Math.max(1, Math.ceil(num / den));
  const rows = baseDirection === 'horizontal' ? den : (showCommon ? otherDen : 1);
  const cols = baseDirection === 'vertical' ? den : (showCommon ? otherDen : 1);

  const wholes = [];
  let remainingNum = num;

  for (let w = 0; w < wholesCount; w++) {
    const piecesInThisWhole = Math.min(remainingNum, den);
    remainingNum -= Math.max(0, piecesInThisWhole);

    wholes.push(
      <Whole 
        key={w}
        rows={rows}
        cols={cols}
        piecesInThisWhole={piecesInThisWhole}
        baseDirection={baseDirection}
        colorClass={colorClass}
      />
    );
  }

  return <div className="flex gap-4 flex-wrap">{wholes}</div>;
}

const FractionInput = ({ num, den, setNum, setDen, color }: any) => {
  const colorClass = color === 'blue' ? 'text-blue-700' : 'text-amber-700';
  const bgClass = color === 'blue' ? 'bg-blue-50' : 'bg-amber-50';
  
  return (
    <div className={`flex flex-col items-center p-2 rounded-xl ${bgClass} shadow-inner border border-stone-200`}>
      <input 
        type="number" 
        min="0"
        value={num} 
        onChange={e => setNum(Math.max(0, parseInt(e.target.value) || 0))}
        className={`w-16 sm:w-20 text-center border-b-4 border-stone-800 pb-1 font-bold text-3xl sm:text-4xl bg-transparent outline-none ${colorClass}`}
      />
      <input 
        type="number" 
        min="1"
        value={den} 
        onChange={e => setDen(Math.max(1, parseInt(e.target.value) || 1))}
        className={`w-16 sm:w-20 text-center pt-1 font-bold text-3xl sm:text-4xl bg-transparent outline-none ${colorClass}`}
      />
    </div>
  )
}

const PieceSize = ({ rows, cols, colorClass }: any) => {
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-stone-800 bg-white rounded-md overflow-hidden grid shadow-sm" style={{
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className={`border border-stone-300 ${i === 0 ? colorClass : 'bg-transparent'}`} />
      ))}
    </div>
  )
}

const ComparisonArea = ({ den1, den2, showCommon, setShowCommon, isReady }: any) => {
  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border-4 transition-colors duration-300 w-full max-w-md ${isReady ? 'border-emerald-500 bg-emerald-50' : 'border-red-400 bg-red-50'}`}>
      <h3 className={`font-bold mb-6 text-lg sm:text-xl text-center ${isReady ? 'text-emerald-700' : 'text-red-700'}`}>
        {isReady ? '¡Pedacitos del mismo tamaño!' : 'Pedacitos de diferente tamaño'}
      </h3>
      <div className="flex gap-4 sm:gap-8 items-center">
        <PieceSize rows={den1} cols={showCommon ? den2 : 1} colorClass="bg-blue-400" />
        <span className={`font-bold text-4xl sm:text-5xl ${isReady ? 'text-emerald-600' : 'text-red-500'}`}>
          {isReady ? '=' : '≠'}
        </span>
        <PieceSize rows={showCommon ? den1 : 1} cols={den2} colorClass="bg-amber-400" />
      </div>
      {!isReady && (
        <button 
          onClick={() => setShowCommon(true)} 
          className="mt-8 px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-xl shadow-md hover:bg-red-600 transition transform hover:scale-105 active:scale-95 w-full"
        >
          Cortar para igualar
        </button>
      )}
      {showCommon && den1 !== den2 && (
        <button 
          onClick={() => setShowCommon(false)} 
          className="mt-8 px-6 py-3 bg-stone-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-stone-700 transition transform hover:scale-105 active:scale-95 w-full"
        >
          Deshacer cortes
        </button>
      )}
    </div>
  )
}

const MCMCalculator = ({ den1, den2 }: any) => {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (den1 * den2) / gcd(den1, den2);

  const getMultiples = (den: number, targetLcm: number) => {
    const multiples = [];
    const targetCount = targetLcm / den;
    
    if (targetCount <= 15) {
      for (let i = 1; i <= targetCount + 2; i++) {
        multiples.push(den * i);
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        multiples.push(den * i);
      }
      multiples.push(-1); // ellipsis
      multiples.push(targetLcm);
      multiples.push(targetLcm + den);
    }
    return multiples;
  };

  const multiples1 = getMultiples(den1, lcm);
  const multiples2 = getMultiples(den2, lcm);

  const renderMultiple = (m: number, index: number, allMultiples: number[], den: number) => {
    if (m === -1) {
      return <span key={`ellipsis-${index}`} className="inline-flex items-center justify-center w-8 h-8 text-stone-400 font-bold">...</span>;
    }

    const isLcm = m === lcm;
    const isCommon = m % den1 === 0 && m % den2 === 0;
    
    let circleClass = "border-transparent text-stone-600";
    if (isLcm) {
      circleClass = "bg-emerald-400/40 border-emerald-500 font-bold text-emerald-900";
    } else if (isCommon) {
      circleClass = "bg-blue-400/30 border-blue-400 font-semibold text-blue-900";
    }

    return (
      <span key={`${m}-${index}`} className={`inline-flex items-center justify-center min-w-[2.5rem] h-10 px-2 rounded-full border-2 ${circleClass} transition-all`}>
        {m}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col gap-6 w-full xl:w-96 shrink-0 h-fit xl:sticky xl:top-8">
      <h2 className="text-2xl font-bold text-stone-700 border-b-2 border-stone-100 pb-4 flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner font-black text-lg">M</span>
        Cálculo del M.C.M.
      </h2>
      
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-stone-600 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            Múltiplos de {den1}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {multiples1.map((m, i) => renderMultiple(m, i, multiples1, den1))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-stone-600 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            Múltiplos de {den2}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {multiples2.map((m, i) => renderMultiple(m, i, multiples2, den2))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t-2 border-stone-100">
        <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200 flex flex-col items-center justify-center shadow-inner">
          <span className="text-emerald-700 font-bold mb-2 text-lg">MCM ({den1}, {den2})</span>
          <span className="text-6xl font-black text-emerald-600 drop-shadow-sm">{lcm}</span>
        </div>
        <div className="mt-6 text-sm text-stone-600 flex flex-col gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-400/30 border-2 border-blue-400 shrink-0"></div>
            <span className="font-medium">Múltiplos en común</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/40 border-2 border-emerald-500 shrink-0"></div>
            <span className="font-medium">Mínimo Común Múltiplo (MCM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [num1, setNum1] = useState(5);
  const [den1, setDen1] = useState(3);
  
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(8);
  
  const [op, setOp] = useState('+');
  const [showCommon, setShowCommon] = useState(false);

  useEffect(() => {
    setShowCommon(false);
  }, [den1, den2]);

  const isReady = den1 === den2 || showCommon;
  
  const resDen = showCommon ? den1 * den2 : (den1 === den2 ? den1 : den1 * den2);
  const resNum1 = showCommon ? num1 * den2 : (den1 === den2 ? num1 : num1 * den2);
  const resNum2 = showCommon ? num2 * den1 : (den1 === den2 ? num2 : num2 * den1);
  const resNum = op === '+' ? resNum1 + resNum2 : resNum1 - resNum2;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans pb-24">
      <header className="bg-indigo-600 text-white p-6 shadow-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight">Suma y Resta de Fracciones</h1>
      </header>

      <main className="flex-grow p-4 sm:p-8 flex flex-col xl:flex-row items-start gap-8 max-w-[1400px] mx-auto w-full">
        
        <div className="flex-grow flex flex-col gap-8 w-full">
          <div className="w-full flex flex-col gap-8 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-stone-700 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">1</span>
                Primera Fracción
              </h2>
              <FractionVisualizer num={num1} den={den1} otherDen={den2} showCommon={showCommon} baseDirection="horizontal" colorClass="bg-blue-400" />
            </div>

            <hr className="border-stone-200 border-2 rounded-full" />

            <div>
              <h2 className="text-2xl font-bold mb-6 text-stone-700 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">2</span>
                Segunda Fracción
              </h2>
              <FractionVisualizer num={num2} den={den2} otherDen={den1} showCommon={showCommon} baseDirection="vertical" colorClass="bg-amber-400" />
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-between bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200">
            
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              <FractionInput num={num1} den={den1} setNum={setNum1} setDen={setDen1} color="blue" />
              
              <select 
                value={op} 
                onChange={e => setOp(e.target.value)}
                className="bg-stone-100 border-4 border-stone-300 rounded-2xl p-2 sm:p-4 text-3xl sm:text-5xl font-black text-stone-700 cursor-pointer hover:bg-stone-200 transition appearance-none text-center shadow-sm"
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>

              <FractionInput num={num2} den={den2} setNum={setNum2} setDen={setDen2} color="amber" />

              <div className="text-4xl sm:text-6xl font-black text-stone-300">=</div>

              <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-50 shadow-inner border border-emerald-200 min-w-[5rem] sm:min-w-[6rem]">
                <div className="w-full text-center border-b-4 border-stone-800 pb-1 font-bold text-3xl sm:text-4xl text-emerald-700">
                  {isReady ? resNum : '?'}
                </div>
                <div className="w-full text-center pt-1 font-bold text-3xl sm:text-4xl text-emerald-700">
                  {isReady ? resDen : '?'}
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full lg:w-auto">
              <ComparisonArea den1={den1} den2={den2} showCommon={showCommon} setShowCommon={setShowCommon} isReady={isReady} />
            </div>

          </div>
        </div>

        <MCMCalculator den1={den1} den2={den2} />
      </main>

      <footer className="fixed bottom-0 w-full bg-stone-900 text-stone-300 p-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 border-t-4 border-indigo-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-xl text-white tracking-wide flex items-center gap-2">
            <span className="bg-indigo-500 text-white px-2 py-1 rounded-md text-sm">Profe</span>
            la_transformada_de_naomi
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com/la_transformada_de_naomi" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white hover:bg-pink-600 transition bg-stone-800 px-5 py-2.5 rounded-full font-semibold">
              <Instagram size={20} />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a href="https://tiktok.com/@la_transformada_de_naomi" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white hover:bg-black transition bg-stone-800 px-5 py-2.5 rounded-full font-semibold border border-stone-700 hover:border-stone-500">
              <TikTokIcon className="w-5 h-5" />
              <span className="hidden sm:inline">TikTok</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
