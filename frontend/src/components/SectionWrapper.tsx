// ============================================================
// KARACHI WEATHER APP — SectionWrapper (Reusable)
// Consistent spacing, headings, and scroll-reveal animation.
// ============================================================

import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/';

interface SectionWrapperProps {
  id?: string;
  badge?: ReactNode;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  reveal?: 'up' | 'left' | 'right' | 'scale' | 'none';
  align?: 'left' | 'center';
  action?: ReactNode;
}

const revealClass: Record<string, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
  none: '',
};

export default function SectionWrapper({
  id,
  badge,
  title,
  subtitle,
  children,
  className = '',
  reveal = 'up',
  align = 'left',
  action,
}: SectionWrapperProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`${revealClass[reveal]} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 ${className}`}
    >
      {(title || badge) && (
        <div className={`mb-8 flex flex-col sm:flex-row sm:items-end gap-4 ${
          align === 'center' ? 'sm:flex-col sm:items-center text-center' : 'justify-between'
        }`}>
          <div className={align === 'center' ? 'mx-auto' : ''}>
            {badge && <div className="section-badge mb-2">{badge}</div>}
            {title && (
              <h2 className="section-heading text-2xl sm:text-3xl font-bold text-white text-3d">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
