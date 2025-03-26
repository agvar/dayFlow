export const debounce = <T extends (...args: any[]) => Promise<void>>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>): Promise<void> => {
    return new Promise((resolve) => {
      const later = async () => {
        clearTimeout(timeout);
        try {
          await func(...args);
          resolve();
        } catch (error) {
          console.error('Error in debounced function:', error);
          resolve();
        }
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    });
  };
};