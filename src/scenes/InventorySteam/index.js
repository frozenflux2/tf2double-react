import { useCallback, useEffect, useState } from 'react';
import { Search } from '@styled-icons/heroicons-solid/Search';
import { KeyboardArrowLeft } from '@styled-icons/material-sharp/KeyboardArrowLeft';
import { ExclamationCircle } from '@styled-icons/bootstrap/ExclamationCircle';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Item from '../../components/Item';
import ItemSmall from '../../components/ItemSmall';
import LoadingSimple from '../../components/LoadingSimple';
import TransactionModal from './components/TransactionModal';
import usePrevious from '../../hooks/usePrevious';
import styles from './index.module.css';

import { ReactComponent as Coins } from '../../components/Coins.svg';

const { events, helpers, user, steam } = window.insolve;

const PRICE_RANGES = [
  '$0.00 - $5.00',
  '$5.01 - $10.00',
  '$10.01 - $20.00',
  '$20.01 - $50.00',
  '$50.01 - $100.00',
  '$100.01 - $250.00',
  '$250.00 - $500.00',
  '$500.01+'
];

const SORT_BY = [
  'Alphabetically',
  'Price low to high',
  'Price high to low'
];

const MAX_ITEMS_PER_TRADE = 20;

const DepositSteam = ({ appid, type }) => {
  const [inventory, setInventory] = useState([]);
  const [priceRange, setPriceRange] = useState(-1);
  const [sortBy, setSortBy] = useState(2);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [invLoaded, setInvLoaded] = useState(false);
  const [inputTradelink, setInputTradelink] = useState('');
  const [isTradelink, setIsTradelink] = useState(!!user.get('tradelink')); // todo: add event to listen for this change instead
  const [error, setError] = useState('');

  const prevIsTradelink = usePrevious(isTradelink);


  const selectItem = (assetid, reducer = 1) => {
    const inv = inventory.map(item => {
      if(item.assetid === assetid) {
        // single item already selected
        if(item.amount === 1 && item.amountSelected === 1) {
          item.amountSelected = 0;
          reducer = 0;
        }

        // first time selecting
        if(isNaN(item.amountSelected)) {
          item.amountSelected = 1;
        } else {
          item.amountSelected += reducer;
        }

        // prevent overflow
        if(item.amountSelected > item.amount) {
          item.amountSelected = item.amount;
        }

        // add activeId only if empty
        if(!item.activeId) {
          item.activeId = Math.max(...inventory.map(o => o.activeId || 0)) + 1;
        }

        if(item.amountSelected === 0) {
          delete item.activeId;
        }
      }

      return item;
    });

    setInventory(inv);
  }

  const sumSelected = (returnAmount = false) => {
    return inventory.filter(item => item.amountSelected > 0).reduce((accumulator, object) => {
      return accumulator + (returnAmount ? object.amountSelected : (object.price * object.amountSelected));
    }, 0);
  }

  const getFilteredInv = () => {
    let inv = JSON.parse(JSON.stringify(inventory));

    // sort by price
    if(sortBy === 0) {
      inv = inv.sort((a,b) => a.name.localeCompare(b.name));
    } else if(sortBy === 1) {
      inv = inv.sort((a,b) => a.price - b.price);
    } else if(sortBy === 2) {
      inv = inv.sort((a,b) => b.price - a.price);
    }

    // search by name
    return inv.filter(item => item.name.toLowerCase().includes(search));
  }

  const action = () => {
    setLoading(true);

    const fn = type === 'deposit' ? user.requestDeposit : user.requestWithdraw;
    const items = inventory.filter(item => item.amountSelected > 0).map(item => {
      return {assetid: item.assetid, amount: item.amountSelected}
    });

    fn(appid, {items}).then(data => {
      events.emit('internal:toggleTransactionModal', {...data, type});
      setLoading(false);
    }).catch(e => {
      setError(e);
    });
  }

  const loadInv = useCallback(() => {
    if(!isTradelink) return;
    setInventory([]);
    setInvLoaded(false);

    const fn = type === 'deposit' ? user.loadSteamInventory : steam.loadInventory;

    fn(appid).then(inv => {
      setInventory(inv.sort((a,b) => a.price - b.price));
      setInvLoaded(true);
    }).catch(e => {
      setError(e);
    });
  }, [appid, isTradelink, type]);

  const updateTradelink = () => {
    setLoading(true);

    user.updateTradelink(inputTradelink).then(() => {
      console.log('new', user.get('tradelink'));
      setIsTradelink(true);
      setError('');
    }).catch(e => {
      setError(e || 'Invalid tradelink, please try again.');
      setIsTradelink(false);
    }).finally(() => {
      setLoading(false);
    });
  }

  const dismissTradelink = () => {
    setIsTradelink(true);
    setError('');
    setLoading(false);
  }

  // request inventory on start
  // useEffect(loadInv, []);
  

  // reset on page change
  useEffect(() => {
    setSearch('');
    setSortBy(2);
    setInventory([]);
    setInvLoaded(false);
    loadInv();
    setError('');
    // setIsTradelink(!!user.get('tradelink'));
  }, [appid, type, loadInv]);

  // load inventory after tradelink is input
  useEffect(() => {
    if(prevIsTradelink !== undefined) loadInv();
  }, [isTradelink, loadInv, prevIsTradelink]);

  const inv = getFilteredInv();
  const selected = inventory.filter(item => item.amountSelected > 0);
  const selectedSum = sumSelected(true);
  
  return !isTradelink ? (
    <div className={styles.tradelink}>
      <Button type="link" to="/deposit" variant="primary" className={styles.back}>
        <KeyboardArrowLeft />
        <span>Back</span>
      </Button>

      <h3>Input your tradelink</h3>
      <p>Before you can start trading, we need your Steam trade url. <a href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer">Click here</a> to get it.</p>

      <input type="text" value={inputTradelink} onChange={e => setInputTradelink(e.target.value)} placeholder="https://steamcommunity.com/tradeoffer/new/?partner=252289723&token=yORPmBKd" />
      <Button disabled={loading} type="button" variant="theme" onClick={updateTradelink}>
        {loading ? <LoadingSimple /> : 'Save'}
      </Button>

      <p className={styles.dismiss} onClick={dismissTradelink}>No thanks, I'm just browsing</p>

      <p className={styles.error}>{error}</p>
    </div>
  ) : (
    <>
      <TransactionModal />

      <div className={styles.deposit}>
        <div className={styles.left}>
          <div className={styles.filters}>
            {type === 'deposit' && (
              <Button type="link" to="/deposit" variant="primary" className={styles.back}>
                <KeyboardArrowLeft />
                <span>Back</span>
              </Button>
            )}

            <div className={styles.search}>
              <Search />
              <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <Select placeholder="Price range" options={PRICE_RANGES} select={setPriceRange} selected={priceRange} className={styles.prices} />
            <Select placeholder="Sort by" options={SORT_BY} select={setSortBy} selected={sortBy} className={styles.prices} />
          </div>

          {!invLoaded ? (
            <div className={styles.loading}>
              {error === '' ? <Loader variant="circle" className={styles.spinner} /> : <ExclamationCircle />}
              <h3>{error === '' ? 'Loading your items...' : 'Failed to load your items :('}</h3>
              {error !== '' && <p>{error}</p>}
            </div>
          ) : (
            <div className={styles.list}>
              {inv.map((item, key) => <Item key={key} item={item} select={selectItem} />)}
            </div>
          )}
        </div>

        <div className={styles.summary}>
          <h2>
            <p>Selected items {selectedSum > MAX_ITEMS_PER_TRADE}</p>
            <span style={selectedSum > MAX_ITEMS_PER_TRADE ? {color: 'var(--roulette-red-single)'} : null}>{selectedSum} out of {MAX_ITEMS_PER_TRADE}</span>
          </h2>

          <div className={styles.items}>
            {selected.sort((a,b) => a.activeId - b.activeId).map((item, key) => <ItemSmall key={key} item={item} select={selectItem} />)}
          </div>

          <div className={styles.bottom}>
            <div style={{display: 'inline-block'}}>
              <p>
                <span>You will {type === 'deposit' ? 'receive' : 'pay'}</span>
                <Coins />
                <span> {helpers.formatBalance(sumSelected())} coins.</span>
              </p>
            </div>
            <Button type="button" onClick={action} disabled={loading || selectedSum <= 0 || selectedSum > MAX_ITEMS_PER_TRADE} block>
              {!loading ? (
                <>{type === 'deposit' ? 'Deposit' : 'Withdraw'}</>
              ) : (
                <Loader className={styles.loader} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DepositSteam;