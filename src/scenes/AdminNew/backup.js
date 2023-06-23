import { Check } from '@styled-icons/bootstrap/Check';
import { Download } from 'styled-icons/bootstrap';
import Button from '../../components/Button';
import UpdateEverySec2 from '../../components/UpdateEverySec2';
import styles from './index.module.css';

const Backup = ({ title, time, tables }) => {
  const self = window.insolve.user.get();

  return !title ? null : (
    <div className={`${styles.gameDistContainer} ${styles.backupContainer}`} style={{marginTop: '40px'}}>
      <h1 className={styles.header}>Backup</h1>

      <div className={`${styles.gameDist} ${styles.backup}`}>
        <h3>Up to date!</h3>
        <p>Last backup was created <span><UpdateEverySec2 value={time} /></span> at <span>{new Date(time * 1000).toLocaleTimeString()}</span>.</p>

        <div className={styles.icon}>
          <Check />
        </div>

        <Button type="external" variant="theme" href={`${window.insolve?.config?.url || ''}/admin/backup/${title}/${self?.token}`} newTab block>
          <Download />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
}

export default Backup;