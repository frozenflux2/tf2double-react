import { useState } from 'react';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import styles from './index.module.css';

const { events, STATIC } = window.insolve;

const EditRank = ({ user, close }) => {
  const [rank, setRank] = useState(user?.rank);
  const [updateRank, setUpdateRank] = useState(0);

  const submit = () => {
    events.emit('internal:sendChat', `/updateval rank ${rank} ${user?.id}`);
    if(updateRank === 0) events.emit('internal:sendChat', `/updateval badge ${STATIC.RANKS[rank].toUpperCase()} ${user?.id}`);
    
    close();
  }

  return (
    <>
      <h5>Select rank</h5>
      <Select options={STATIC.RANKS} select={setRank} z={202} selected={rank} className={styles.select} />

      <h5 style={{marginTop: '20px'}}>Update badge to default</h5>
      <Select z={201} options={['Yes', 'No']} select={setUpdateRank} selected={updateRank} className={styles.select} />

      {updateRank === 0 && (
        <>
          <h5 style={{marginTop: '20px'}}>Badge preview</h5>
          <div><p className={styles.badge} style={{
            color: user?.badge_text_color || null,
            backgroundColor: user?.badge_color || null
          }}>{STATIC.RANKS[rank]}</p></div>
        </>
      )}
      <Button type="button" block className={styles.bottom} onClick={submit}>Update rank</Button>
    </>
  );
}

export default EditRank;