import { Error } from '@styled-icons/material-rounded/Error';

import styles from './index.module.css';

const Alert = ({ type, msg, hide, length, onClick }) => (
  <div className={styles.alert} data-type={type} data-hide={hide || null} style={{'--length': `${length}ms`}} onClick={onClick}>
    <Error />
    
    <div className={styles.text}>
      <h4>{type}!</h4>
      <p>{msg}</p>
    </div>
  </div>
)

export default Alert;