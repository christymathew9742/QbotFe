"use client";

import { EdgeProps, getSmoothStepPath, useReactFlow, ConnectionLineComponentProps } from 'reactflow';
import { memo, useState } from 'react';
import { constantsText } from '@/constant/constant';

const {
  BOT: {
    ICON: {
      MESSAGE,
      REPLAY,
      PREFERENCE,
    }
  }
} = constantsText;

interface CustomEdgeProps extends EdgeProps {
  sourceHandle?: string;
  targetHandle?: string;
}

const CustomEdge = memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: CustomEdgeProps) => {
  const { deleteElements } = useReactFlow();
  const [hovered, setHovered] = useState<boolean>(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const edgeColor = id?.includes('option') || id?.includes('slot') ? PREFERENCE : id?.includes('replay') ? REPLAY : MESSAGE;
  const activeColor = '#f43f5e';
  
  const currentColor = hovered ? activeColor : edgeColor;
  const currentWidth = hovered ? 1.2 : 1;

  const markerId = `arrow-${id}`;

  const onEdgeClick = (evt: React.MouseEvent, id: string) => {
    evt.stopPropagation();
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
         <style>
            {`
              @keyframes data-flow {
                from { stroke-dashoffset: 100; }
                to { stroke-dashoffset: 0; }
              }
            `}
        </style>
        <defs>
          <marker
            id={markerId}
            markerWidth="16"
            markerHeight="20"
            refX="4"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L6,3 z"
              fill={currentColor}
              style={{ transition: 'fill 0.3s ease' }}
            />
          </marker>

           <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <path
        d={edgePath}
        stroke="transparent"
        strokeWidth={25}
        fill="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
      />
      <path
        id={id}
        d={edgePath}
        style={{
          stroke: currentColor,
          strokeWidth: currentWidth,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease, opacity 0.3s ease',
          filter: hovered ? `drop-shadow(0 0 4px ${currentColor})` : 'none',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0.5 
        }}
        className="react-flow__edge-path"
        markerEnd={`url(#${markerId})`}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="white"
        strokeWidth={2} 
        style={{
            opacity: hovered ? 1 : 0, 
            strokeDasharray: '10, 50', 
            strokeLinecap: 'round',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            transition: 'opacity 0.3s ease',
            animation: hovered ? 'data-flow 1s linear infinite' : 'none'
        }}
      />
      <foreignObject
        width={30}
        height={30}
        x={labelX - 12}
        y={labelY - 12}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }} 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '24px',
            height: '24px',
            backgroundColor: hovered ? activeColor : '#0f172a', 
            color: hovered ? 'white' : activeColor,
            borderRadius: '50%', 
            border: `1px solid ${hovered ? activeColor : '#334155'}`,
            cursor: 'pointer',
            pointerEvents: 'all',
            transition: 'background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            boxShadow: hovered ? `0 4px 10px ${activeColor}60` : 'none',
          }}
          onClick={(event) => onEdgeClick(event, id)}
        >
          <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1 }}>×</span>
        </div>
      </foreignObject>
    </>
  );
});

export const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  fromHandle
}: ConnectionLineComponentProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    borderRadius: 20,
  });

  const getThemeColor = () => {
    const handleId = fromHandle?.id || "";
    if (handleId.includes('option') || handleId.includes('slot')) return '#67e8f9';
    if (handleId.includes('replay')) return '#f0abfc'; 
    return '#94a3b8'; 
  };

  const strokeColor = getThemeColor();

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1}
        style={{ 
            opacity: 0.8,
            strokeDasharray: '5, 5',
            animation: 'data-flow 0.5s linear infinite'
        }}
      />
      <circle cx={toX} cy={toY} r={3} fill={strokeColor} />
    </g>
  );
};

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
