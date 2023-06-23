import { useCallback, useEffect, useState } from 'react';
import Alert from '../Alert';
import styles from './index.module.css';

const ALERT_LENGTH = 5000;
const { events } = window.insolve;

const AlertManager = () => {
  const [alerts, setAlerts] = useState([]);

  const add = ({ type, msg }) => {
    setAlerts(prev => [...prev, {type, msg, start: Math.round(+new Date())}]);
  }

  const onError = useCallback(msg => {
    add({type: 'error', msg});
  }, []);

  // monitor alerts
  const checkOnAlerts = () => {
    setAlerts(all => {
      const now = Math.round(+new Date());

      all.forEach(alert => {
        if(now - alert.start >= ALERT_LENGTH && !alert.hide) {
          alert.hide = true;
          alert.hideTime = now;
        }

        if(now - alert.hideTime > 500) alert.remove = true;
      });

      // todo: make it disappear without the weird animation glitch
      return [...all];
      // return all.filter(alert => now - alert.hideTime <= 500 || typeof alert.hideTime === 'undefined');
      // return all.filter(alert => typeof alert.remove === 'undefined'); // todo: filter for hideTime
    });
  }

  const hide = key => {
    setAlerts(all => {
      all[key].hide = true;
      all[key].hideTime = Math.round(+new Date());

      return [...all];
    });
  }

  useEffect(() => {
    events.on('generic:error', onError);
    const intrv = setInterval(checkOnAlerts, 50);

    return () => {
      events.off('generic:error', onError);
      clearInterval(intrv);
    }
  }, [onError]);

  return (
    <div className={styles.alerts}>
      {alerts.map((alert, key) => alert.remove ? null : (
        <Alert key={key} {...alert} length={ALERT_LENGTH} onClick={() => hide(key)} />
      ))}
    </div>
  );
}

export default AlertManager;