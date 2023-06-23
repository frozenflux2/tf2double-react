import Button from '../../components/Button';
import styles from './index.module.css';
import abbreviateNumber from '../../helpers/abbreviateNumber';
import { Users } from '@styled-icons/heroicons-solid/Users';
import { Dice } from '@styled-icons/ionicons-solid/Dice';
import { ClipboardList } from '@styled-icons/heroicons-solid/ClipboardList';
import { Money } from '@styled-icons/fluentui-system-regular/Money';
import { useState, useEffect } from 'react';
import NotFound from '../NotFound';
import { Cog } from '@styled-icons/boxicons-solid/Cog';
import { Refresh } from '@styled-icons/zondicons/Refresh';
import { ChevronRight } from '@styled-icons/bootstrap/ChevronRight';
import { ChevronLeft } from '@styled-icons/bootstrap/ChevronLeft';

import getReadableDate from '../../helpers/getReadableDate';

import StatBox from './statBox';
import GameDist from './gameDist';
import Transactions from './transactions';
import Bots from './bots';
import Logs from './logs';
import Backup from './backup';
// import Rake from './rake';
import Uptime from './uptime';
import Leaderboard from './leaderboard';

const { user } = window.insolve;

const Admin = () => {
  const [stats, setStats] = useState({});
  const [dist, setDist] = useState({});
  const [loading, setLoading] = useState(true);
  const [bots, setBots] = useState([]);
  const [txns, setTxns] = useState([]);
  const [txns_fail, setTxns_fail] = useState([]);
  const [backup, setBackup] = useState(undefined);
  // const [rake, setRake] = useState(undefined);
  const [logs, setLogs] = useState('');
  const [statsByDay, setStatsByDay] = useState({});
  const [uptime, setUptime] = useState(0);
  const [lb, setLb] = useState({});
  const [statsWeek, setStatsWeek] = useState(0); // 0 = current, -1 = 1 week back etc
  const [timeRange, setTimeRange] = useState([0, 0]);

  const loadData = (week = 0) => {
    if((user.get('rank') || 0) < 4) return;
    setLoading(true);

    user.getAdminStats(Math.abs(week)).then(data => {
      if(data.success === false) return;

      setStats(data.stats);
      setDist(data.dist);
      setBots(data.bots);
      setTxns(data.txns);
      setTxns_fail(data.txns_fail);
      setBackup(data.backup);
      setLogs(data.logs);
      setStatsByDay(data.statsByDay);
      // setRake(data.rake);
      setUptime(data.uptime);
      setLb(data.lb);
      setTimeRange(data.timeRange);
    }).catch(e => {
      console.log(e);
    }).finally(() => {
      setLoading(false);
    });
  }

  const statsPrev = () => {
    setStatsWeek(prev => {
      loadData(prev - 1);
      return prev - 1;
    });
  }

  const statsNext = () => {
    if(statsWeek >= 0) return;

    setStatsWeek(prev => {
      loadData(prev + 1);
      return prev + 1;
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  if((user.get('rank') || 0) < 4) {
    return <NotFound />; 
  }

  return (
    <div className={styles.admin}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.header} style={{color: 'var(--theme-color-contrast)'}}>Welcome back <span>{user.get('name') || '-'}</span>!</h1>
          <p className={styles.desc}>
            Looking good. Check out how the site is doing this week.
          </p>
        </div>

        <div className={styles.btns}>
          <Button type="link" variant="primary" to="/admin/settings">
            <Cog />
            <span>Site settings</span>
          </Button>

          <Button type="button" variant="primary" onClick={() => loadData()} className={loading ? styles.load : null}>
            <Refresh />
          </Button>
        </div>
      </div>
      
      <div className={styles.boxes}>
        <StatBox title="Commission" link="/admin/commission" value={'$' + abbreviateNumber(stats?.commission?.basis || 0)} icon={<Money />} loading={loading} statsByDay={statsByDay.commission} />
        <StatBox title="Deposits" link="/admin/deposits" value={'$' + abbreviateNumber(stats?.deposits?.basis || 0)} icon={<ClipboardList />} loading={loading} statsByDay={statsByDay.deposits} />
        <StatBox title="Games" link="/admin/games" value={stats?.games?.basis || 0} icon={<Dice />} loading={loading} statsByDay={statsByDay.games} />
        <StatBox title="Users" link="/admin/users" value={stats?.users?.basis || 0} icon={<Users />} loading={loading} statsByDay={statsByDay.users} />
      </div>

      <div className={styles.week}>
        <ChevronLeft onClick={statsPrev} />

        <div>
          <p>Showing stats from <span>{statsWeek >= 0 ? 'current week' : `${Math.abs(statsWeek)} week${Math.abs(statsWeek) === 1 ? '' : 's'} ago`}</span></p>
          <span>{getReadableDate(timeRange[0] * 1000)} - {getReadableDate(timeRange[1] * 1000)}</span>
        </div>

        <ChevronRight onClick={statsNext} style={statsWeek >= 0 ? {cursor: 'not-allowed'} : null} />
      </div>

      <div style={{width: '100%', float: 'left', marginTop: '50px'}}>
        <div className={styles.right}>
          <GameDist {...dist} loading={loading} />
          {/* <Rake {...rake} loading={loading} /> */}
          <Bots loading={loading} bots={bots} />
          <Leaderboard loading={loading} latest={lb?.latest} list={lb?.list || []} />
          <Uptime loading={loading} uptime={uptime} />
          <Backup {...backup} loading={loading} />
        </div>

        <div className={styles.left}>
          <Transactions txns={txns} txns_fail={txns_fail} loading={loading} />
          <Logs logs={logs} setLogs={setLogs} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Admin;