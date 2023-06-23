import { useState } from 'react';
import Button from '../../../../components/Button';
import styles from './index.module.css';

const { events } = window.insolve;

const EditBadge = ({ user }) => {
  const [text, setText] = useState(user?.badge || '');
  const [textColor, setTextColor] = useState(user?.badge_text_color || '');
  const [background, setBackground] = useState(user?.badge_color || '');

  const submit = () => {
    // todo: the internal:sendChat event should send a flag to let the server know that its being sent from gui
    // then setup the listener for the new result here
    // also have an option to not return an error because sending 3 messages at once is gay
    events.emit('internal:sendChat', `/updateval badge ${text} ${user?.id}`);
    if(textColor !== '') events.emit('internal:sendChat', `/updateval badge_text_color ${textColor} ${user?.id}`);
    if(background !== '') events.emit('internal:sendChat', `/updateval badge_color ${background} ${user?.id}`);
  }

  return (
    <>
      <h5>Badge text</h5>
      <input className={styles.input} type="text" value={text} placeholder="ADMIN" onChange={e => setText(e.target.value)} />

      <h5 style={{marginTop: '10px'}}>Badge text color</h5>
      <input className={styles.input} type="text" value={textColor} placeholder="#0000ff" onChange={e => setTextColor(e.target.value)} />

      <h5 style={{marginTop: '10px'}}>Badge background</h5>
      <input className={styles.input} type="text" value={background} placeholder="#ff0000" onChange={e => setBackground(e.target.value)} />

      {text !== '' && (
        <>
          <h5 style={{marginTop: '10px'}}>Badge preview</h5>
          <div><p className={styles.badge} style={{
            color: textColor,
            background: background
          }}>{text}</p></div>
        </>
      )}

      <Button type="button" block className={styles.bottom} onClick={submit}>{text === '' ? 'Delete' : 'Update'} badge</Button>
    </>
  );
}

export default EditBadge;