"use client";

import React from 'react';

export const Box: React.FC<React.HTMLAttributes<HTMLDivElement> & { px?: number; maxWidth?: string | number }> = ({ children, style, ...rest }) => {
  return (
    <div {...rest} style={{ boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
};

export default Box;
