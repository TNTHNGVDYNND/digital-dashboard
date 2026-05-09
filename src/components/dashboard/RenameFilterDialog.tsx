'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface RenameFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (name: string) => Promise<void>;
  currentName: string;
  isPending: boolean;
  error: string | null;
}

export default function RenameFilterDialog({
  isOpen,
  onClose,
  onRename,
  currentName,
  isPending,
  error,
}: RenameFilterDialogProps) {
  const [name, setName] = useState(currentName);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setValidationError(null);
      lastFocusedRef.current = document.activeElement;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isOpen, currentName]);

  useEffect(() => {
    if (!isOpen && lastFocusedRef.current instanceof HTMLElement) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(dialog.querySelectorAll(focusableSelectors));
      if (focusables.length === 0) return;
      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const validateName = useCallback((value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Name is required';
    if (trimmed.length > 50) return 'Name must be 50 characters or fewer';
    return null;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const nameError = validateName(name);
    if (nameError) {
      setValidationError(nameError);
      return;
    }

    const trimmed = name.trim();
    if (trimmed === currentName.trim()) {
      onClose();
      return;
    }

    await onRename(trimmed);
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (validationError) setValidationError(null);
  };

  if (!isOpen) return null;

  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-filter-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <h2
          id="rename-filter-title"
          className="mb-4 text-xl font-bold text-gray-900 dark:text-white"
        >
          Rename Filter Preset
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="rename-filter-name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Preset Name
            </label>
            <input
              ref={inputRef}
              id="rename-filter-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={isPending}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              aria-invalid={displayError ? 'true' : 'false'}
              aria-describedby={displayError ? 'rename-filter-name-error' : undefined}
            />
            {displayError && (
              <p
                id="rename-filter-name-error"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {displayError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Renaming...' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
