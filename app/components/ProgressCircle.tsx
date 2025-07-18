'use client';

interface ProgressCircleProps {
  progress: number;
}

export default function ProgressCircle({ progress }: ProgressCircleProps) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="w-16 h-16">
      <circle cx={27} cy={27} r={25} stroke="#e0e0e0" strokeWidth="5" fill="transparent" />
      <circle
        cx={27}
        cy={27}
        r={25}
        stroke="#6366f1"
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 27 27)"
      />
      <text x={27} y={32} textAnchor="middle" className="text-sm text-gray-700 font-semibold">
        {progress}%
      </text>
    </svg>
  );
}
