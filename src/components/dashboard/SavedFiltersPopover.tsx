'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { ISavedFilter } from '@/lib/models/SavedFilter';

interface SavedFiltersPopoverProps {
  filters: ISavedFilter[];
  onApply: (query: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  pendingById: Record<string, 'rename' | 'delete'>;
  isOpen: boolean;
  onToggle: () => void;
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function SavedFiltersPopover({
  filters,
  onApply,
  onRename,
  onDelete,
  pendingById,
  isOpen,
  onToggle,
}: SavedFiltersPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const getFocusableRows = useCallback((): HTMLElement[] => {
    if (!listRef.current) return [];
    return Array.from(
      listRef.current.querySelectorAll<HTMLElement>('li[data-row] button:not([disabled])'),
    ).filter((el) => el.closest('li[data-row]') !== null);
  }, []);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!isOpen) return;

    const rows = getFocusableRows();
    if (rows.length === 0) return;

    const activeElement = document.activeElement;
    const currentIndex = rows.findIndex((row) => row === activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex >= 0 && currentIndex < rows.length - 1 ? currentIndex + 1 : 0;
      rows[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : rows.length - 1;
      rows[prevIndex]?.focus();
    } else if (e.key === 'Enter') {
      const focusedRow = activeElement?.closest('li[data-row]');
      if (focusedRow) {
        const applyButton = focusedRow.querySelector<HTMLButtonElement>('button[data-apply]');
        if (applyButton && activeElement === applyButton) {
          e.preventDefault();
          const query = applyButton.getAttribute('data-query');
          if (query) {
            handleApply(query);
          }
        }
      }
    }
  };

  const handleApply = (query: string) => {
    onApply(query);
    onToggle();
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="rounded-lg border border-surface-300 bg-surface-0 px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-50"
      >
        Saved Filters
        {filters.length > 0 && (
          <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary-100 px-1.5 py-0.5 text-xs font-semibold text-primary-700">
            {filters.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-surface-200 bg-surface-0 p-2 shadow-lg sm:w-80"
        >
          {filters.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-text-muted">
              No saved filters yet.
            </div>
          ) : (
            <ul
              ref={listRef}
              className="flex flex-col gap-1"
              role="listbox"
              onKeyDown={handleListKeyDown}
              tabIndex={-1}
            >
              {filters.map((filter) => {
                const id = String(filter._id);
                const isPending = pendingById[id];
                return (
                  <li key={id} data-row role="option">
                    <div className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-surface-50">
                      <button
                        type="button"
                        data-apply
                        data-query={filter.query}
                        onClick={() => handleApply(filter.query)}
                        disabled={!!isPending}
                        className="flex-1 text-left text-sm font-medium text-text-primary transition-colors hover:text-primary-600 disabled:opacity-50"
                      >
                        {filter.name}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onRename(id)}
                          disabled={!!isPending}
                          aria-label={`Rename filter ${filter.name}`}
                          className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-100 hover:text-primary-600 disabled:opacity-50"
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(id)}
                          disabled={!!isPending}
                          aria-label={`Delete filter ${filter.name}`}
                          className="rounded p-1.5 text-text-muted transition-colors hover:bg-danger-500/10 hover:text-danger-600 disabled:opacity-50"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
