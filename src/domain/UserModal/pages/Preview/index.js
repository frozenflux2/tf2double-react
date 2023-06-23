import styles from './index.module.css';

const Preview = ({ user }) => {
  return (
    <div className={styles.preview}>
      {Object.keys(user).map((item, key) => (
        <div key={key}>
          <h5>{item}</h5>
          <p>{typeof user[item] === 'object' ? JSON.stringify(user[item]) : user[item].toString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Preview;