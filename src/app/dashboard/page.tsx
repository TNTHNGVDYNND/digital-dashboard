'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCampaigns, updateCampaign, deleteCampaign } from '@/hooks/useCampaigns';
import type { ICampaign, CampaignStatus, CampaignTier } from '@/lib/models/Campaign';
import type { ISavedFilter } from '@/lib/models/SavedFilter';
import type { FilterQuery } from '@/types/filters';
import { parseFilterQuery, serializeFilterQuery } from '@/lib/filters/query';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import CampaignEditModal from '@/components/dashboard/CampaignEditModal';
import CampaignDeleteModal from '@/components/dashboard/CampaignDeleteModal';
import FilterToolbar from '@/components/dashboard/FilterToolbar';
import SaveFilterDialog from '@/components/dashboard/SaveFilterDialog';
import RenameFilterDialog from '@/components/dashboard/RenameFilterDialog';
import DeleteFilterConfirmation from '@/components/dashboard/DeleteFilterConfirmation';
import TemplateCard from '@/components/campaign/TemplateCard';
import { useTemplatesStore } from '@/store/templates';
import { useFiltersStore } from '@/store/filters';
import Link from 'next/link';

function applyFilters(campaigns: ICampaign[], query: FilterQuery): ICampaign[] {
  return campaigns.filter((campaign) => {
    if (query.status && campaign.status !== query.status) return false;
    if (query.tier && campaign.tier !== query.tier) return false;

    if (query.from || query.to) {
      if (!campaign.startDate) return false;
      const start = new Date(campaign.startDate).toISOString().split('T')[0];
      if (query.from && start < query.from) return false;
      if (query.to && start > query.to) return false;
    }

    return true;
  });
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { campaigns, isLoading, isError, mutate } = useCampaigns();
  const { templates, isLoading: templatesLoading, fetchTemplates, deleteTemplate } = useTemplatesStore();

  // Modal State
  const [editingCampaign, setEditingCampaign] = useState<ICampaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<ICampaign | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [renamingFilter, setRenamingFilter] = useState<ISavedFilter | null>(null);
  const [deletingFilter, setDeletingFilter] = useState<ISavedFilter | null>(null);

  const {
    filters: savedFilters,
    createFilter,
    updateFilter,
    deleteFilter,
    fetchFilters,
    pendingAction,
    pendingById,
    error: filterError,
    clearError,
  } = useFiltersStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const filterQuery = useMemo(() => parseFilterQuery(searchParams), [searchParams]);

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return applyFilters(campaigns, filterQuery);
  }, [campaigns, filterQuery]);

  const hasCampaigns = campaigns && campaigns.length > 0;
  const hasActiveFilters =
    !!filterQuery.status || !!filterQuery.from || !!filterQuery.to || !!filterQuery.tier;

  const updateUrlFilter = useCallback(
    (key: keyof FilterQuery, value: string) => {
      const next: FilterQuery = { ...filterQuery };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      const canonical = serializeFilterQuery(next);
      router.replace(`/dashboard${canonical ? `?${canonical}` : ''}`, { scroll: false });
    },
    [filterQuery, router],
  );

  const handleClearAll = useCallback(() => {
    router.replace('/dashboard', { scroll: false });
  }, [router]);

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (data.count > 0) {
          setMigrationStatus(`Success! Found and migrated ${data.count} campaigns.`);
          mutate();
        } else {
          setMigrationStatus('No legacy campaigns found to migrate.');
        }
      } else {
        setMigrationStatus(`Migration failed: ${data.error}`);
      }
    } catch (err) {
      setMigrationStatus('An error occurred during migration.');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleEditSave = async (id: string, name: string) => {
    try {
      await updateCampaign(id, { name });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteCampaign(id);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplate(id);
  };

  const handleSaveFilter = async (name: string) => {
    clearError();
    const canonical = serializeFilterQuery(filterQuery);
    const result = await createFilter(name, canonical);
    if (result) {
      await fetchFilters();
    }
  };

  const handleApplyFilter = (query: string) => {
    const parsed = parseFilterQuery(query);
    const canonical = serializeFilterQuery(parsed);
    router.replace(`/dashboard${canonical ? `?${canonical}` : ''}`, { scroll: false });
  };

  const handleRenameFilter = (id: string) => {
    const filter = savedFilters.find((f) => String(f._id) === id);
    if (filter) {
      setRenamingFilter(filter);
    }
  };

  const handleConfirmRename = async (name: string) => {
    if (!renamingFilter) return;
    clearError();
    await updateFilter(String(renamingFilter._id), name);
  };

  const handleDeleteFilter = (id: string) => {
    const filter = savedFilters.find((f) => String(f._id) === id);
    if (filter) {
      setDeletingFilter(filter);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingFilter) return;
    clearError();
    await deleteFilter(String(deletingFilter._id));
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your active campaigns and performance.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Failed to load campaigns. Please try again.
          </div>
        ) : hasCampaigns ? (
          <>
            <FilterToolbar
              status={(filterQuery.status as CampaignStatus) || ''}
              from={filterQuery.from || ''}
              to={filterQuery.to || ''}
              tier={(filterQuery.tier as CampaignTier) || ''}
              onStatusChange={(value) => updateUrlFilter('status', value)}
              onFromChange={(value) => updateUrlFilter('from', value)}
              onToChange={(value) => updateUrlFilter('to', value)}
              onTierChange={(value) => updateUrlFilter('tier', value)}
              onClearAll={handleClearAll}
              hasActiveFilters={hasActiveFilters}
              onSaveClick={() => setIsSaveDialogOpen(true)}
              filters={savedFilters}
              onApplyFilter={handleApplyFilter}
              onRenameFilter={handleRenameFilter}
              onDeleteFilter={handleDeleteFilter}
              pendingById={pendingById}
              isPopoverOpen={isPopoverOpen}
              onPopoverOpenChange={setIsPopoverOpen}
            />

            <AnalyticsChart campaigns={filteredCampaigns} />

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                Your Campaigns
              </h2>
              {filteredCampaigns.length > 0 ? (
                <div className="grid gap-4">
                  {filteredCampaigns.map((campaign: ICampaign) => (
                    <div
                      key={campaign._id as unknown as string}
                      className="group flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {campaign.type} • {campaign.tier} tier
                          {campaign.status && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {campaign.status}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-indigo-600">
                            ${campaign.budget.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">{campaign.duration} days</div>
                        </div>

                        {/* CRUD Actions */}
                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => setEditingCampaign(campaign)}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingCampaign(campaign)}
                            className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    No campaigns match the current filters.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600 dark:bg-indigo-900/20">
              📊
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No campaigns yet
            </h2>
            <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              You haven't created any promotional campaigns yet. Start your first campaign to see
              analytics here.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/campaigns"
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Create Campaign
              </Link>

              <button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {isMigrating ? 'Checking...' : 'Migrate Legacy Data'}
              </button>
            </div>

            {migrationStatus && (
              <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {migrationStatus}
              </p>
            )}
          </div>
        )}

        {/* Saved Templates Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Saved Templates
          </h2>

          {templatesLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : templates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard
                  key={template._id}
                  template={template}
                  onLoad={() => {}}
                  onDelete={handleDeleteTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-600 dark:bg-indigo-900/20">
                📝
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                No templates yet
              </h3>
              <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
                Save your campaign configurations as templates to quickly reuse them later.
              </p>
            </div>
          )}
        </div>
      </div>

      {editingCampaign && (
        <CampaignEditModal
          campaign={editingCampaign}
          isOpen={!!editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={handleEditSave}
        />
      )}

      {deletingCampaign && (
        <CampaignDeleteModal
          campaign={deletingCampaign}
          isOpen={!!deletingCampaign}
          onClose={() => setDeletingCampaign(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <SaveFilterDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveFilter}
        currentQuery={serializeFilterQuery(filterQuery)}
        isPending={pendingAction === 'create'}
        error={filterError}
      />

      {renamingFilter && (
        <RenameFilterDialog
          isOpen={!!renamingFilter}
          onClose={() => setRenamingFilter(null)}
          onRename={handleConfirmRename}
          currentName={renamingFilter.name}
          isPending={pendingById[String(renamingFilter._id)] === 'rename'}
          error={filterError}
        />
      )}

      {deletingFilter && (
        <DeleteFilterConfirmation
          isOpen={!!deletingFilter}
          onClose={() => setDeletingFilter(null)}
          onConfirm={handleConfirmDelete}
          filterName={deletingFilter.name}
          isPending={pendingById[String(deletingFilter._id)] === 'delete'}
        />
      )}
    </main>
  );
}
