import Link from 'next/link';
import React from 'react';

const PromoCard: React.FC = () => {
    return (
        /* Container:
        - bg-gradient-to-b: Vertical gradient.
        - from-[#2E2657]: Dark indigo top.
        - to-[#493e81d6]: Lighter, transparent indigo bottom.
        - backdrop-blur-sm: Keeps the glassmorphism effect.
        */
        <div className="relative w-full rounded-md overflow-hidden p-8 sm:p-6 text-white shadow-xl backdrop-blur-sm bg-gradient-to-b from-[#2e2657f2] to-[#493e8199]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Column: Text Content */}
                <div className="flex-1 space-y-2 text-center md:text-left z-10">
                    <h2 className="text-3xl sm:text-1xl font-bold leading-tight">
                        Manage your appointment <br className="hidden md:block" />
                        in one touch
                    </h2>
                    <p className="text-indigo-100 text-base font-light w-full mx-auto md:mx-0">
                        AI-powered automation for effortless appointment management.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/api-config"
                            className="inline-block bg-white text-sm text-[#493e81] hover:bg-indigo-50 transition-all duration-300 font-semibold py-3 px-8 rounded-full shadow-md active:scale-95 transform hover:-translate-y-0.5"
                        >
                            Integrate Free Now
                        </Link>
                    </div>
                </div>

                {/* Right Column: Custom SVG 
                    - Removed custom 'animate-float' class.
                    - Added 'transition-transform duration-500 hover:-translate-y-2': 
                    This makes the chart float upwards smoothly when you hover over the card.
                */}
                <div className="flex-1 flex justify-center md:justify-end relative w-full max-w-[300px] transition-transform duration-500 ease-in-out hover:-translate-y-2">
                    <svg 
                        viewBox="0 0 200 200" 
                        className="w-full h-auto drop-shadow-2xl"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
                        </linearGradient>
                        </defs>

                        {/* Background Decoration */}
                        <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.05" />
                        <circle cx="100" cy="100" r="60" fill="white" fillOpacity="0.05" />

                        {/* Chart Base Line */}
                        <line x1="20" y1="170" x2="180" y2="170" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

                        {/* Animated Bars (SVG native animation is valid and doesn't use CSS classes) */}
                        <rect x="40" y="100" width="20" height="70" rx="4" fill="url(#barGradient)">
                        <animate attributeName="height" values="70; 90; 70" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="y" values="100; 80; 100" dur="4s" repeatCount="indefinite" />
                        </rect>

                        <rect x="75" y="60" width="20" height="110" rx="4" fill="url(#barGradient)">
                        <animate attributeName="height" values="110; 120; 110" dur="5s" repeatCount="indefinite" />
                        <animate attributeName="y" values="60; 50; 60" dur="5s" repeatCount="indefinite" />
                        </rect>

                        <rect x="110" y="40" width="20" height="130" rx="4" fill="white">
                        <animate attributeName="height" values="130; 140; 130" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="y" values="40; 30; 40" dur="3s" repeatCount="indefinite" />
                        </rect>

                        <rect x="145" y="80" width="20" height="90" rx="4" fill="url(#barGradient)">
                        <animate attributeName="height" values="90; 70; 90" dur="4.5s" repeatCount="indefinite" />
                        <animate attributeName="y" values="80; 100; 80" dur="4.5s" repeatCount="indefinite" />
                        </rect>

                        {/* Trend Line */}
                        <path 
                        d="M30 110 Q 70 50, 110 30 T 170 80" 
                        fill="none" 
                        stroke="#FFD700" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        className="drop-shadow-md"
                        >
                        <animate attributeName="d" values="M30 110 Q 70 50, 110 30 T 170 80; M30 100 Q 70 60, 110 40 T 170 70; M30 110 Q 70 50, 110 30 T 170 80" dur="6s" repeatCount="indefinite" />
                        </path>

                        {/* Bubble */}
                        <circle cx="110" cy="30" r="6" fill="#FFD700">
                        <animate attributeName="cy" values="30; 40; 30" dur="3s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default PromoCard;