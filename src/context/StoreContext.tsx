'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StoreDataset,
  TimeRange,
  GrowthRecommendation,
  RecommendationStatus,
} from '@/types';
import { getDemoStoreData, resetDemoStoreData } from '@/lib/data/sample-data';
import { generateRecommendations } from '@/lib/recommendations/engine';

interface StoreContextType {
  dataset: StoreDataset;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  recommendations: GrowthRecommendation[];
  updateRecommendationStatus: (id: string, status: RecommendationStatus) => void;
  resetToDefaultDemo: () => void;
  setCustomDataset: (newDataset: StoreDataset) => void;
  isCustomDataLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [dataset, setDataset] = useState<StoreDataset>(getDemoStoreData());
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [isCustomDataLoaded, setIsCustomDataLoaded] = useState(false);
  const [recommendations, setRecommendations] = useState<GrowthRecommendation[]>([]);

  // Initialize recommendations from current dataset & timeRange
  useEffect(() => {
    const recs = generateRecommendations(dataset, timeRange);

    // Rehydrate any persisted statuses from localStorage
    try {
      const savedStatuses = localStorage.getItem('dukaanai_rec_statuses');
      if (savedStatuses) {
        const statusMap: Record<string, RecommendationStatus> = JSON.parse(savedStatuses);
        recs.forEach((r) => {
          if (statusMap[r.id]) {
            r.status = statusMap[r.id];
          }
        });
      }
    } catch (e) {
      // localStorage unavailable or invalid JSON
    }

    setRecommendations(recs);
  }, [dataset, timeRange]);

  const updateRecommendationStatus = (id: string, status: RecommendationStatus) => {
    setRecommendations((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));

      try {
        const statusMap: Record<string, RecommendationStatus> = {};
        updated.forEach((r) => {
          statusMap[r.id] = r.status;
        });
        localStorage.setItem('dukaanai_rec_statuses', JSON.stringify(statusMap));
      } catch (e) {}

      return updated;
    });
  };

  const resetToDefaultDemo = () => {
    const fresh = resetDemoStoreData();
    setDataset(fresh);
    setIsCustomDataLoaded(false);
    try {
      localStorage.removeItem('dukaanai_rec_statuses');
    } catch (e) {}
  };

  const setCustomDataset = (newDataset: StoreDataset) => {
    setDataset(newDataset);
    setIsCustomDataLoaded(true);
  };

  return (
    <StoreContext.Provider
      value={{
        dataset,
        timeRange,
        setTimeRange,
        recommendations,
        updateRecommendationStatus,
        resetToDefaultDemo,
        setCustomDataset,
        isCustomDataLoaded,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
