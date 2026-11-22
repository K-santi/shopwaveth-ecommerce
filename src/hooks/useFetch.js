import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook โหลดข้อมูลแบบเรียบง่าย
 * @param fetcher ฟังก์ชัน async ที่คืนข้อมูล
 * @param key     เปลี่ยนค่านี้เพื่อสั่งโหลดใหม่ (เช่น id ใน route)
 */
export default function useFetch(fetcher, key = 'default') {
  const fetcherRef = useRef(fetcher);
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
