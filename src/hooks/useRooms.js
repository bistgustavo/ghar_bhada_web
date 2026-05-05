import { useState, useEffect, useCallback } from 'react';
import roomService from '../services/roomService';

/**
 * Custom hook to fetch public rooms with filtering, pagination, and error handling
 * Backend returns: { total, skip, limit, rooms: [...] }
 */
export const useRooms = (initialFilters = {}, fetchFn = null) => {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    skip: 0,
    limit: 20,
    ...initialFilters,
  });

  /**
   * Fetch rooms based on current filters
   */
  const fetchRooms = useCallback(
    async (shouldAppend = false) => {
      try {
        setLoading(true);
        setError(null);

        const fetchFunction = fetchFn || roomService.listRooms;
        const response = await fetchFunction(filters);

        // Backend returns { total, skip, limit, rooms: [...] }
        const { rooms: roomsList = [], total: totalCount = 0 } = response;

        if (shouldAppend) {
          setRooms((prev) => [...prev, ...roomsList]);
        } else {
          setRooms(roomsList);
        }

        setTotal(totalCount);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch rooms';
        setError(errorMessage);
        console.error('Room fetch error:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters, fetchFn]
  );

  /**
   * Auto-fetch on filter changes
   */
  useEffect(() => {
    fetchRooms(false);
  }, [fetchRooms]);

  /**
   * Update filters and reset pagination
   */
  const updateFilters = useCallback((newFilters, keepPagination = false) => {
    setFilters((prev) => ({
      ...prev,
      skip: keepPagination ? prev.skip : 0,
      ...newFilters,
    }));
  }, []);

  /**
   * Load next page of results (append)
   */
  const loadMore = useCallback(() => {
    const newSkip = filters.skip + filters.limit;
    setFilters((prev) => ({ ...prev, skip: newSkip }));
  }, [filters.skip, filters.limit]);

  /**
   * Reset to first page
   */
  const resetPagination = useCallback(() => {
    setFilters((prev) => ({ ...prev, skip: 0 }));
  }, []);

  const hasMore = rooms.length < total;

  return {
    rooms,
    total,
    loading,
    error,
    hasMore,
    filters,
    setFilters: updateFilters,
    fetchRooms,
    loadMore,
    resetPagination,
  };
};

export default useRooms;
