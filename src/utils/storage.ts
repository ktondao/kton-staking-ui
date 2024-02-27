const isBrowser = (): boolean => typeof window !== 'undefined';

const getItem = (key: string): string | null => {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(key, value);
};

const removeItem = (key: string): void => {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(key);
};

export { getItem, setItem, removeItem };
