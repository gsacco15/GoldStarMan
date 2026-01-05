'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'alert' | 'confirm' | 'success';
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'alert',
  confirmText = 'OK',
  cancelText = 'Cancel',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full p-8 slide-up">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {type === 'success' ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : type === 'confirm' ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4 text-center">
          {title}
        </h2>

        {/* Message */}
        <p className="text-stone-600 dark:text-stone-400 text-center mb-8 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className={`flex gap-3 ${type === 'confirm' ? 'flex-row-reverse' : ''}`}>
          {type === 'confirm' ? (
            <>
              <button
                onClick={handleConfirm}
                className="flex-1 btn-primary py-3"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-secondary py-3"
              >
                {cancelText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full btn-primary py-3"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
