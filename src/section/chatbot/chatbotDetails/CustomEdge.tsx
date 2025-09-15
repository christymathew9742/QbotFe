
"use client";

import { EdgeProps, getSmoothStepPath } from 'reactflow';
import { memo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const CustomEdge = memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
    const [hovered, setHovered] = useState<boolean>(false);

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    
    const edgeColor = id?.includes('option') ? '#17C4DC' : id?.includes('replay') ? '#f069b1' : 'gray';
    const markerEnd = `url(#arrow-${id})`;

    return (
        <>
            <svg style={{ height: 0 }}>
                <defs>
                    <marker
                        id={`arrow-${id}`}
                        markerWidth="8"
                        markerHeight="10"
                        refX="8"
                        refY="5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                        d="M0,0 L0,10 L10,5 z"
                        fill={hovered ? 'red' : edgeColor}
                        />
                    </marker>
                </defs>
            </svg>

            <path
                id={id}
                d={edgePath}
                style={{
                    stroke: hovered ? 'red' : edgeColor,
                    strokeWidth: 1,
                    transition: 'stroke 0.2s, stroke-width 0.2s',
                }}
                className="react-flow__edge-path"
                markerEnd={markerEnd}
            />

        <foreignObject
            width={20}
            height={20}
            x={labelX - 10}
            y={labelY - 12}
            requiredExtensions="http://www.w3.org/1999/xhtml"
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    backgroundColor: hovered ? 'red' : 'white',
                    color: hovered ? 'white' : 'red',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background-color 0.2s, color 0.2s',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                >
                {data?.label ?? 'X'}
            </div>
        </foreignObject>
        </>
    );
});

export default CustomEdge;

