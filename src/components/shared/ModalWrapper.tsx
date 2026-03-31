'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: (state: { animationPhase: 'entering' | 'visible' | 'exiting' | 'closed' }) => React.ReactNode;
  zIndex?: number;
}

/**
 * ModalWrapper: handles mount/unmount with smooth enter/exit animations.
 * 
 * Usage:
 * <ModalWrapper isOpen={isModalOpen} onClose={setModalOpen}>
 *   {state => (
 *     <div className={cn(state.animationPhase === 'closed' ? 'hidden' : '', 'your-backdrop-classes')}>
 *       <div className="your-panel-classes">...</div>
 *     </div>
 *   )}
 * </ModalWrapper>
 */
export function ModalWrapper({ isOpen, onClose, children, zIndex = 50 }: ModalWrapperProps) {
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'visible' | 'exiting' | 'closed'>('closed');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Keep the ref updated even if onClose identity changes
  const handleClose = useCallback(() => {
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (isOpen && animationPhase === 'closed') {
      // Start entrance animation
      setAnimationPhase('entering');
      // Mark as fully visible after animation completes
      const timer = setTimeout(() => setAnimationPhase('visible'), 200);
      return () => clearTimeout(timer);
    }
    if (!isOpen && (animationPhase === 'entering' || animationPhase === 'visible')) {
      // Start exit animation
      setAnimationPhase('exiting');
      // Remove from DOM after exit completes
      const timer = setTimeout(() => setAnimationPhase('closed'), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationPhase]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (animationPhase === 'entering' || animationPhase === 'visible') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [animationPhase]);

  // Close on Escape key
  useEffect(() => {
    if (animationPhase !== 'entering' && animationPhase !== 'visible') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [animationPhase, handleClose]);

  if (animationPhase === 'closed') return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 modal-backdrop",
        animationPhase === 'entering' && 'modal-enter',
        animationPhase === 'exiting' && 'modal-exit',
        "flex items-center justify-center"
      )}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-md modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      />
      {/* Content */}
      {children({ animationPhase })}
    </div>
  );
}
