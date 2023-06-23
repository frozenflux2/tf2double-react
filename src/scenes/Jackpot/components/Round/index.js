import { useState } from 'react';
import { Gamepad } from '@styled-icons/fa-solid/Gamepad';
import { ShieldFillCheck } from '@styled-icons/bootstrap/ShieldFillCheck';
import { User } from '@styled-icons/fa-solid/User';
import { Gun } from '@styled-icons/fa-solid';

import LoadingSimple from '../../../../components/LoadingSimple';

import coin from '../../../../resources/images/coin.png';

import styles from './index.module.css';

const { helpers, events } = window.insolve;

const PlayerListSingle = props => {
  const { name, avatar, color, items = [], activePlayer, setActivePlayer, index, totalBank = 0, top, isPF, tickets } = props;
  const myTotal = items.reduce((a, b) => +a + +b.price, 0);

  return (
    <div
      className={styles.player} data-top={top || null} style={{
        '--color': color,
        opacity: activePlayer === -1 ? null : (activePlayer === index ? null : .2)
      }}
      // onMouseOver={() => setActivePlayer(index)}
      // onMouseOut={() => setActivePlayer(-1)}
    >
      <div className={styles.avatar}>
        <img src={avatar} alt="" onClick={() => events.emit('internal:toggleUserModal', props)} />
        <p>{name}</p>
      </div>

      <div className={styles.right}>
        {isPF ? (
          <p className={styles.desc}>Tickets from <span>#{tickets[0]}</span> to <span>#{tickets[1]}</span></p>
        ) : (
          <>
            <div className={styles.chance}>{parseFloat((myTotal / totalBank) * 100).toFixed(2)}%</div>

            <div className={styles.amount}>
              <Gun />
              <span>{items.length}</span>
            </div>

            <div className={styles.price}>
              <img src={coin} alt="" />
              <span>
                {helpers.formatBalance(myTotal)}
              </span>
            </div>
          </>
        )}

        <div className={styles.color} onMouseOver={() => setActivePlayer(index)} onMouseOut={() => setActivePlayer(-1)} />
      </div>
    </div>
  );
}

const Round = ({ totalBank, players = [], activePlayer, setActivePlayer, roundId = 0, publicServerHash, items = [], time = 0, totalTime = 0 }) => {
  // const [PF, setPF] = useState(false);
  // const togglePF = () => setPF(prev => !prev);
  const togglePF = () => events.emit('internal:togglePFmodal', {publicServerHash, game: 'jackpot'});

  return (
    <div className={styles.roundContainer}>
      {/* info compact */}
      <div className={styles.tags}>
        <div>
          <Gamepad />
          <p>Round:</p>
          <span>#{roundId || 0}</span>
        </div>

        <div>
          <User />
          <p>Players:</p>
          <span>{players.length} <span style={{color: 'var(--text-color-secondary)'}}>/ 10</span></span>
        </div>

        <div className={styles.link} onClick={togglePF}>
          <ShieldFillCheck style={{color: '#12cb5a'}} />
          <span>Provably fair</span>
          {/* <span>{PF ? 'Close' : 'Provably fair'}</span> */}
        </div>
      </div>

      <div className={styles.timer} style={{'--progress': `${(time / totalTime) * 100}%`, height: time === 0 ? '4px' : null}} />



      {/* player list */}
      {/* {PF && (
        <div className={styles.pf}>
          <p className={styles.title}>Server hash:</p>
          <p>{publicServerHash}</p>

          <div className={styles.progress}>
            {players.map((player, key) => (
              <div style={{
                width: `${(player.total / totalBank) * 100}%`,
                '--color': player.color,
                borderRadius: players.length === 1 ? `8px` : null
                }}
                key={key}
                onMouseOver={() => setActivePlayer(key)}
                onMouseOut={() => setActivePlayer(-1)}
              />  
            ))}
          </div>
        </div>
      )} */}

      <div className={styles.playerList} style={{height: players.length === 0 ? '207px' : `${52 * players.length}px`}}>
        {players.map((player, key) => (
          <PlayerListSingle {...player} key={key} totalBank={totalBank} activePlayer={activePlayer} setActivePlayer={setActivePlayer} items={items.filter(item => item.owner?.id === player.id)} index={key} />
        ))}

        {players.length === 0 && (
          <div className={styles.empty}>
            <LoadingSimple className={styles.loader} />

            <h4>No players yet...</h4>
            <p>Be first to join this round and enjoy a reduced commission!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Round;