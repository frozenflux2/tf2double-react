import { useState } from 'react';
import { Download } from 'styled-icons/fa-solid';
import Button from '../../components/Button';
import styles from './index.module.css';

const Logs = ({ logs = '', setLogs }) => {
  const [sure, setSure] = useState(false);
  const self = window.insolve.user.get();

  const clear = () => {
    if(!sure) return setSure(true);

    window.insolve.user.clearAdminLogs().then(data => {
      setLogs(data.msg);
    }).catch(e => setLogs(e)).finally(() => {
      setSure(false);
    });
  }

  return (
    <div className={styles.txnsContainer} style={{marginTop: '40px'}}>
      <div className={styles.logBtns}>
        <h1 className={styles.header}>Logs</h1>
        <div>
          <Button type="button" variant="primary" onClick={clear}>
            {sure ? 'Sure?' : 'Clear'}
          </Button>
          <Button type="external" variant="primary" href={`${window.insolve?.config?.url || ''}/admin/downloadLogs/${self?.token}`} newTab>
            <Download />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <pre>{logs}</pre>
    </div>
  );
}

export default Logs;