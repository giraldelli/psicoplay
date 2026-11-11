import React from 'react';

/**
 * Subtle educational background doodles (stars, clouds, pencils, geometric shapes, puzzle pieces).
 * Rendered with soft pastel strokes and low opacity to avoid sensory overstimulation.
 */
export const BackgroundDoodles: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Soft ambient background gradient spots */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E8F8F2] opacity-60 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#EDE7F6] opacity-50 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#D4ECF9] opacity-40 blur-3xl" />

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] text-[#2C3E50]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="educational-doodles"
            width="280"
            height="280"
            patternUnits="userSpaceOnUse"
          >
            {/* Soft Star */}
            <path
              d="M 40,25 L 44,35 L 55,36 L 46,43 L 49,53 L 40,47 L 31,53 L 34,43 L 25,36 L 36,35 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Cloud */}
            <path
              d="M 180,45 A 12,12 0 0,1 195,35 A 16,16 0 0,1 220,38 A 12,12 0 0,1 230,50 L 175,50 A 8,8 0 0,1 180,45 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Pencil */}
            <g transform="translate(110, 110) rotate(35)">
              <rect x="0" y="0" width="10" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <polygon points="0,0 5,-10 10,0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <line x1="0" y1="28" x2="10" y2="28" stroke="currentColor" strokeWidth="1.5" />
            </g>

            {/* Building block / Cube */}
            <g transform="translate(35, 160)">
              <rect x="0" y="8" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </g>

            {/* Puzzle Piece */}
            <g transform="translate(200, 150)">
              <path
                d="M 10,10 H 22 A 4,4 0 0,0 26,6 A 4,4 0 0,0 30,10 H 42 V 22 A 4,4 0 0,1 46,26 A 4,4 0 0,1 42,30 V 42 H 30 A 4,4 0 0,0 26,38 A 4,4 0 0,0 22,42 H 10 V 30 A 4,4 0 0,1 6,26 A 4,4 0 0,1 10,22 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Geometric Triangle */}
            <polygon
              points="150,220 166,250 134,250"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Soft Circle */}
            <circle cx="85" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />

            {/* Small sparkles */}
            <path d="M 245,95 L 245,103 M 241,99 L 249,99" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M 60,240 L 60,246 M 57,243 L 63,243" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#educational-doodles)" />
      </svg>
    </div>
  );
};
