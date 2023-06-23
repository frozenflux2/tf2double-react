import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight } from '@styled-icons/bootstrap/ChevronRight';
import Loading from './loading';
import styles from './index.module.css';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const StatBox = ({ title, link, value, icon, loading, statsByDay = {} }) => {
  const [activeDay, setActiveDay] = useState(-1);
  const highestNumber = Math.max(...Object.values(statsByDay?.monday !== undefined ? statsByDay : [1]));

  // if(title === 'Deposits') console.log(value);

  return (
    <div className={styles.statBox} data-loading={loading}>
      <Loading />

      <div className={styles.title} data-show={activeDay === -1}>
        <h5>{title}</h5>
        <h3>{value}</h3>
      </div>
      
      {/* this is shown on hover */}
      <div className={styles.dayDetail} data-show={activeDay !== -1}>
        <h5>{DAYS[activeDay] || '-'}</h5>
        <h3>{statsByDay[ DAYS[activeDay] ] || '0'}</h3>
      </div>

      <div className={styles.icon}>
        {icon}
      </div>

      <div className={styles.chart}>
        {[...Array(7)].map((item, key) => {
          const height = ( (statsByDay[ DAYS[key] ] || 0) / highestNumber ) * 100;

          return (
            <div
              style={{height: `${isNaN(height) ? 0 : height}%`}}
              onMouseOver={() => setActiveDay(key)}
              onMouseOut={() => setActiveDay(-1)}
              key={key}
            />
          );
        })}
      </div>

      <Link to={link}>
        <div className={styles.go}>
          <ChevronRight />
        </div>
      </Link>
    </div>
  );
}

export default StatBox;