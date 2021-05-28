import React from 'react';

const Success = ({ fill, height, width, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width || '24'}
    height={height || '24'}
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="none" fillRule="evenodd">
      <g>
        <g>
          <g transform="translate(-122 -740) translate(122 736) translate(0 4)">
            <circle
              cx="11.874"
              cy="11.874"
              r="11.874"
              fill={fill || '#429400'}
            />
            <path
              stroke="#FFF"
              strokeLinecap="round"
              strokeWidth="1.719"
              d="M7.307 12.16L9.3 15.43c.259.425.814.56 1.24.3.108-.065.2-.152.272-.255l5.672-8.168h0"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default Success;
