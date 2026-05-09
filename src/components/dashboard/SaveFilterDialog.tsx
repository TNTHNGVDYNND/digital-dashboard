'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { parseFilterQuery, validateDateRange } from '@/lib/filters/query';

interface SaveFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  currentQuery: string;
  isPending: boolean;
  error: string | null;
}

export default function SaveFilterDialog({
  isOpen,
  onClose,
  onSave,
  currentQuery,
  isPending,
  error,
}: SaveFilterDialogProps) {
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setValidationError(null);
      setSuccessMessage(null);
      lastFocusedRef.current = document.activeElement;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

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

  const validateQuery = useCallback((query: string): string | null => {
    const parsed = parseFilterQuery(query);
    if (!validateDateRange(parsed.from, parsed.to)) {
      return 'Invalid date range: start date must be before or equal to end date';
    }
    return null;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const nameError = validateName(name);
    if (nameError) {
      setValidationError(nameError);
      return;
    }

    const queryError = validateQuery(currentQuery);
    if (queryError) {
      setValidationError(queryError);
      return;
    }

    await onSave(name.trim());
    setSuccessMessage('Filter saved successfully');
    setTimeout(() => {
      onClose();
    }, 800);
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
        aria-labelledby="save-filter-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <h2
          id="save-filter-title"
          className="mb-4 text-xl font-bold text-gray-900 dark:text-white"
        >
          Save Filter Preset
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="filter-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Preset Name
            </label>
            <input
              ref={inputRef}
              id="filter-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={isPending}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
              aria-invalid={displayError ? 'true' : 'false'}
              aria-describedby={displayError ? 'filter-name-error' : undefined}
              placeholder="e.g. Active Premium Campaigns"
            />
            {displayError && (
              <p
                id="filter-name-error"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {displayError}
              </p>
            )}
            {successMessage && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Preset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
