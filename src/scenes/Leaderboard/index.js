import React, { Component, useEffect, useState } from 'react';
// import { Trophy } from '@styled-icons/fa-solid/Trophy';
import coin from '../../resources/images/coin.png';
import unknown from '../../resources/images/unknown.png';
import useForceUpdate from '../../hooks/useForceUpdate';

import styles from './index.module.css';

const { tf2_jackpot, events } = window.insolve;

const BigBox = ({ item, user, place, points = 0, color }) => (
  <div className={styles.big} style={{'--box-color': color}} data-t={place === 1 || null} onClick={() => events.emit('internal:toggleUserModal', user)}>
    <div className={styles.allc}>
      <span className={styles.thing}>#{place}</span>

      <div className={styles.itemname}>
        <p>{item?.name || 'Mann Co. Supply Crate Key'}</p>
        <h4>${item?.price || '2.50'}</h4>
      </div>

      <div className={styles.item}>
        <img alt="" src={item?.image || 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ'} />
        <div />
      </div>

      <div className={styles.user}>
        <div className={styles.circle} />

        <div className={styles.rest}>
          <img alt="" src={user?.avatar || unknown} />

            <p className={styles.name}>{user?.name || 'No player yet'}</p>
            <p className={styles.points}>
              {points} <span>points</span>
            </p>
        </div>
      </div>
    </div>
  </div>
);

const Row = ({ place, user, item, points }) => (
  <div className={styles.row} onClick={() => events.emit('internal:toggleUserModal', user)}>
    {/* <Trophy /> */}
    <div style={{color: '#FFAF52'}}>#{place}</div>
    <div className={styles.usr}>
      <img src={user?.avatar || unknown} alt="" />
      <div>
        <p>{user?.name || 'No player yet'}</p>
        <p className={styles.points}><span>{points || 0}</span> points</p>
        {/* <p className={styles.points}>{points} <span>points</span></p> */}
      </div>
    </div>
    {/* <div style={{color2: 'var(--theme-color)'}}>{points} points</div> */}
    <div style={{marginLeft: 'auto'}}>
      <div className={styles.itemrow}>
        <img alt="" src={item?.image || 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ'} />
      </div>

      <div style={{float: 'left', display: 'block'}} className={styles.itm}>
        <p style={{color: 'var(--text-color-secondary)', fontSize: '14px'}}>{item?.name || 'Mann Co. Supply Crate Key'}</p>
        <p style={{color: 'var(--theme-color-contrast)', fontWeight: 500}}>
          <img src={coin} alt="" />
          <span>{item?.price || '2.50'}</span>
        </p>
      </div>
    </div>
  </div>
);

function seconds_to_days_hours_mins_secs_str(seconds)
{ // day, h, m and s
  var days     = Math.floor(seconds / (24*60*60));
      seconds -= days    * (24*60*60);
  var hours    = Math.floor(seconds / (60*60));
      seconds -= hours   * (60*60);
  var minutes  = Math.floor(seconds / (60));
      seconds -= minutes * (60);
  // return ((0<days)?(days+" day, "):"")+hours+"h, "+minutes+"m and "+seconds+"s";
  return {
    days,
    hours,
    minutes,
    seconds
  }
}

const Timer = ({ timeEnd }) => {
  const timeNow = Math.round(+new Date() / 1000);
  const obj = seconds_to_days_hours_mins_secs_str(timeEnd - timeNow);

  useEffect(() => {
    const intr = setInterval(forceUpdate, 1000);

    return () => clearInterval(intr);
  }, []);

  const forceUpdate = useForceUpdate();

  return (
    <p>
      <span className={styles.num}>{obj.days >= 0 ? obj.days : 0}</span>
      <span>D</span>
      <span className={styles.num}>{obj.hours >= 0 ? obj.hours : 0}</span>
      <span>H</span>
      <span className={styles.num}>{obj.minutes >= 0 ? obj.minutes : 0}</span>
      <span>M</span>
      <span className={styles.num}>{obj.seconds >= 0 ? obj.seconds : 0}</span>
      <span>S</span>
    </p>
  );
}

const COLORS = [
  '#70e154',
  '#ff3b4d',
  '#0587c5'
];

export default class Leaderboard extends Component {
  state = {players: [], endTime: 0, startTime: 0};

  componentDidMount() {
    tf2_jackpot.getLeaderboard().then(data => {
      // console.log(data);
      data.players.length = 10;
      this.setState(data);
      // this.setState({...data, players: [...data.players, ...data.players, ...data.players, ...data.players, ...data.players, ...data.players]});
    })
  }

  render() {
    return (
      <div className={styles.lb}>
        <h2>Leaderboard</h2>
        <p className={styles.desc}>Compete with the top players and earn free money! Every bet on our site counts towards your score. The table updates every 5 minutes.</p>

        <div className={styles.top3}>
          {/*
          {this.state?.players?.map((player, key) => {
            return key <= 2 ? <BigBox place={key + 1} t={key === 0} item={{}} color={COLORS[key]} points={player.points} user={player.player} key={key} /> : null
          })}
          */}
          <BigBox place={3} item={{}} color={COLORS[2]} points={this.state?.players[2]?.points} user={this.state?.players[2]?.player} />
          <BigBox place={1}item={{}} color={COLORS[0]} points={this.state?.players[0]?.points} user={this.state?.players[0]?.player} />
          <BigBox place={2} item={{}} color={COLORS[1]} points={this.state?.players[1]?.points} user={this.state?.players[1]?.player} />

          {/* {this.state?.players[2] ? <BigBox place={3} t={false} item={{}} color={COLORS[2]} points={this.state?.players[2].points} user={this.state?.players[2].player} /> : null} */}
          {/* {this.state?.players[0] ? <BigBox place={1} t={true} item={{}} color={COLORS[0]} points={this.state?.players[0].points} user={this.state?.players[0].player} /> : null} */}
          {/* {this.state?.players[1] ? <BigBox place={2} t={false} item={{}} color={COLORS[1]} points={this.state?.players[1].points} user={this.state?.players[1].player} /> : null} */}
        </div>
        
        {this.state.players?.length > 0 && (
          <div className={styles.timer}>
            <p className={styles.title}>Contest ends</p>
            <div className={styles.tm}>
              <Timer timeEnd={this.state?.endTime || 0} />
            </div>
          </div>
        )}

        <div className={styles.table}>
          {/* <div className={styles.head}>
            <p>Rank</p>
            <p>Username</p>
            <p>Points</p>
            <p>Prize</p>
          </div> */}

          <div className={styles.rows}>
            {[...Array(10)].map((player, key) => {
              return key >= 3 ? <Row place={key + 1} item={{}} points={this.state?.players[key]?.points} user={this.state?.players[key]?.player} key={key} /> : null
            })}
          </div>
        </div>
      </div>
    );
  }
};