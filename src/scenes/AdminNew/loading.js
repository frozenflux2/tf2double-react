import styles from './index.module.css';
import { Refresh } from '@styled-icons/zondicons/Refresh';

const Loading = () => (
  <div className={styles.loading}>
    <Refresh />
  </div>
);

export default Loading;