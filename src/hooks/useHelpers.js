import { useState, useCallback, useEffect } from 'react';

/**
 * useAsync: Generic hook for handling async operations
 * Manages loading, data, and error states automatically
 *
 * @param {Function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately on mount (default: false)
 * @param {Array} dependencies - Dependencies array for useEffect
 *
 * @returns {Object} { data, loading, error, execute }
 */
export const useAsync = (asyncFunction, immediate = false, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [...dependencies]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute };
};

/**
 * useToggle: Simple boolean toggle hook
 *
 * @param {boolean} initialValue - Initial state
 * @returns {Array} [value, toggle, setValue]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
};

/**
 * useLocalStorage: Safe localStorage hook with JSON parsing
 *
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * useDebounce: Delay execution of a value change
 * Useful for search inputs, filters, etc.
 *
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * usePagination: Manage pagination state
 *
 * @param {number} total - Total number of items
 * @param {number} pageSize - Number of items per page (default: 20)
 * @returns {Object} { page, total, pageSize, totalPages, hasMore, goToPage, nextPage, prevPage, resetPage }
 */
export const usePagination = (total = 0, pageSize = 20) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;

  return {
    page,
    total,
    pageSize,
    totalPages,
    hasMore,
    goToPage: (newPage) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    nextPage: () => {
      if (hasMore) setPage((prev) => prev + 1);
    },
    prevPage: () => {
      setPage((prev) => Math.max(1, prev - 1));
    },
    resetPage: () => setPage(1),
  };
};

/**
 * useFormInput: Simplified form input handling
 * Reduces boilerplate for form state management
 *
 * @param {any} initialValue - Initial value
 * @returns {Object} { value, setValue, bind, reset }
 */
export const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    bind: {
      value,
      onChange: (e) => setValue(e.target.value),
    },
    reset: () => setValue(initialValue),
  };
};

/**
 * useFormState: Manage multiple form fields
 *
 * @param {Object} initialState - Initial form state
 * @returns {Object} { formData, setField, setFormData, reset }
 */
export const useFormState = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  return {
    formData,
    setField: (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    setFormData,
    reset: () => setFormData(initialState),
  };
};

export default {
  useAsync,
  useToggle,
  useLocalStorage,
  useDebounce,
  usePagination,
  useFormInput,
  useFormState,
};
