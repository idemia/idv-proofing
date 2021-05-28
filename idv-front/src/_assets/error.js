/* eslint-disable */
import React from 'react';

const Error = ({ fill, height, width }) => (
  <svg
    width={width || 16}
    height={height || 16}
    viewBox="0 0 16 16"
  >
    <g fill="none" fillRule="evenodd">
      <g>
        <g>
          <g transform="translate(-1275 -1033) translate(928 1017) translate(347 16)">
            <circle cx="8" cy="8" r="8" fill={fill || '#D0021B'} />
            <path
              fill="#FFF"
              d="M10.73 9.965c.1.11.15.24.15.39 0 .15-.05.275-.15.375-.1.1-.225.15-.375.15s-.28-.05-.39-.15L8 8.765 6.035 10.73c-.11.1-.235.15-.375.15s-.265-.05-.375-.15c-.11-.1-.165-.225-.165-.375s.055-.28.165-.39L7.235 8l-1.95-1.965c-.11-.11-.165-.24-.165-.39 0-.15.055-.275.165-.375.11-.1.235-.15.375-.15s.265.05.375.15L8 7.235 9.965 5.27c.11-.1.24-.15.39-.15.15 0 .275.05.375.15.1.1.15.225.15.375s-.05.28-.15.39L8.765 8l1.965 1.965z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default Error;
