// ============================================================
// KARACHI WEATHER APP — RevealOnScroll (Reusable)
// Wraps children and reveals them when scrolled into view.
// ============================================================

import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealOnScrollProps {
  children: ReactNode;
  variant?: 'up' | 'left' | 'right' | 'scale';
  className?: string;
  delay?: number;
}

const variantClass = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

export default function RevealOnScroll({
  children,
  variant = 'up',
  className = '',
  delay = 0,
}: RevealOnScrollProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}