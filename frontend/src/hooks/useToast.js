import { useState, useCallback, useEffect, useRef } from "react";


export function useToast(duration = 3000) {
  const [toast, setToast] = useState({ message: "", type: "success" });
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {

      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({ message, type });

      timerRef.current = setTimeout(() => {
        setToast({ message: "", type: "success" });
      }, duration);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, hideToast };
}
