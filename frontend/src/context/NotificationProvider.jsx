import { NotificationContext } from './NotificationContext';
import Notification from '../utils/Notification';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ show: false, success: true, message: "" });

  // Track the hide-timeout so rapid calls to showNotification don't race
  // each other (e.g. a fast second notification getting hidden early by
  // the first one's leftover timer).
  const timeoutRef = useRef(null);

  const showNotification = useCallback(({ success, message }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({
      show: true,
      success,
      message
    });

    timeoutRef.current = setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        show: false
      }));
    }, 3000);
  }, []); // stable reference forever

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Memoize the context value so consumers don't see a "new" object
  // (and therefore a "new" showNotification) on every provider render.
  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification
        show={notification.show}
        success={notification.success}
        message={notification.message}
      />
    </NotificationContext.Provider>
  );
}