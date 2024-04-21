/* eslint-disable */
import React from 'react';

const useDebouncedCallback = (
  cb: (...args: any[]) => any,
  delaySeconds = 800
) => {
  const timeout = React.useRef<any>();

  return React.useCallback(
    (...args: any[]) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => cb(...args), delaySeconds);
    },
    [cb]
  );
};

export default useDebouncedCallback;
