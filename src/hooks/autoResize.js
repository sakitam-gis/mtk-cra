import debounce from 'lodash/debounce';
import { useState, useCallback, useEffect, useRef, useImperativeHandle } from 'react';
// import a from '@umijs/hooks';
// import ResizeObserver from 'resize-observer-polyfill';
import { observerDomResize } from '@/utils/dom';

export default function useAutoResize(ref) {
  const [state, setState] = useState({ width: 0, height: 0 });

  const domRef = useRef(null);

  const setWH = useCallback(() => {
    if (domRef && domRef.current) {
      const { clientWidth, clientHeight } = domRef.current;

      setState({ width: clientWidth, height: clientHeight });
    }
  }, []);

  useImperativeHandle(ref, () => ({ setWH }), [setWH]);

  useEffect(() => {
    const debounceSetWHFun = debounce(setWH, 100);

    debounceSetWHFun();

    const domObserver = observerDomResize(domRef.current, debounceSetWHFun);
    // const domObserver = new ResizeObserver((entries, observer) => {
    //
    // });
    //
    // domObserver.observe(domRef.current);

    window.addEventListener('resize', debounceSetWHFun);

    return () => {
      domObserver.disconnect();
      domObserver.takeRecords();

      window.removeEventListener('resize', debounceSetWHFun);
    };
  }, [setWH]);

  return { ...state, domRef, setWH };
}
