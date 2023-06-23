import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@styled-icons/bootstrap/ArrowUpRight';
import styles from './index.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h3>Error 404</h3>
      <p>The page you are trying to access doesn't exist.</p>

      <Link to="/">
        <span>Go home</span>
        <ArrowUpRight />
      </Link>
    </div>
  );
}

export default NotFound;