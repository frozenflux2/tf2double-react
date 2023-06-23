import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import styles from '../AdminNew/index.module.css';
import NotFound from '../NotFound';
import { PriceTag } from '@styled-icons/entypo/PriceTag';
import { DocumentTableSearch } from '@styled-icons/fluentui-system-filled/DocumentTableSearch';
import { ArrowLeft } from 'styled-icons/fa-solid';

const { user } = window.insolve;

const Box = ({ link, title, desc, icon }) => (
  <Link className={styles.settingsBox} to={link}>
    {icon}
    <div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  </Link>
)

const Admin = () => {
  if((user.get('rank') || 0) < 4) {
    return <NotFound />; 
  }

  return (
    <div className={styles.admin}>
      <div className={styles.top}>
        <div>
          {/* <h1 className={styles.header}>Admin panel - settings</h1> */}
          <h1 className={styles.header} style={{color: 'var(--theme-color-contrast)'}}>Welcome back <span>{user.get('name') || '-'}</span>!</h1>
          <p className={styles.desc}>
            Pick a category of the site to change the settings of.
          </p>
        </div>

        <div className={styles.btns}>
          <Button type="link" variant="primary" to="/admin" style={{width: '76px'}} className={styles.mobileFull}>
            <ArrowLeft />
            <span>Go back</span>
          </Button>
        </div>
      </div>
      
      <div className={styles.boxes}>
        <Box title="Prices" icon={<PriceTag />} desc="Manually set prices for items" link="/admin/settings/prices/1" />
        <Box title="Manual review" icon={<DocumentTableSearch />} desc="Review prices that have been marked as suspicious" link="/admin/settings/review_prices/1" />
      </div>
    </div>
  );
}

export default Admin;