import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'styled-icons/fa-solid';
import { Search, SortUp, SortDown } from "styled-icons/bootstrap";
import { ExternalLinkOutline } from '@styled-icons/evaicons-outline/ExternalLinkOutline';
import Button from '../../components/Button';
import LoadingSimple from '../../components/LoadingSimple';
import NotFound from '../NotFound';
import styles from '../AdminNew/index.module.css';
import styles2 from './index.module.css';



const { user } = window.insolve;
const SHOW_AT_ONCE = 30;

const Admin = () => {
  const [prices, setPrices] = useState({});
  const [pricesNew, setPricesNew] = useState({}); // client side
  const [names, setNames] = useState({});
  const [search, setSearch] = useState(undefined);
  const [sort, setSort] = useState(0); // 0 = high to low, 1 = low to high
  const [loading, setLoading] = useState({});
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const { page } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if(search === undefined) return;
    navigate(`/admin/settings/prices/1`, {replace: true});
  }, [search]);

  useEffect(() => {
    if((user.get('rank') || 0) < 4) return;

    user.getAdminPrices().then(data => {
      setPrices(data.prices);
      setPricesNew({...data.prices, ...data.prices_overwrite});
      setNames(data.names);
      setLoadingGlobal(false);
    }).catch(alert);
  }, []);

  if((user.get('rank') || 0) < 4) {
    return <NotFound />; 
  }

  const saveNewPrice = (sku, reset = false) => {
    setLoading(prev => {
      prev[sku] = true;
      return {...prev};
    });

    user.updateAdminPrice(sku, reset ? prices[sku] : pricesNew[sku], reset).then(() => {}).catch(alert).finally(() => {
      setLoading(prev => {
        prev[sku] = false;
        return {...prev};
      });

      if(reset) {
        setPricesNew(prev => {
          prev[sku] = prices[sku];

          return {...prev};
        });
      }
    })
  }
  
  const updatePrice = (sku, price) => {
    setPricesNew(prev => {
      prev[sku] = price;

      return {...prev};
    })
  }


  const pricesSearch = Object.fromEntries(
    Object.entries(prices).sort(([,a],[,b]) => (sort === 0) ? b - a : a - b).filter(([key, value]) => {
      return key.includes((search || '').toLowerCase()) || (names[key]?.name || '').toLowerCase().includes((search || '').toLowerCase());
    }
  ));
  
  const index = {
    min: (page - 1) * SHOW_AT_ONCE,
    max: ((page - 1) * SHOW_AT_ONCE) + SHOW_AT_ONCE
  }
  const maxPages = Math.floor(Object.keys(pricesSearch).length / SHOW_AT_ONCE);
  
  return (
    <div className={styles.admin}>
      <div className={styles.top}>
        <div>
          {/* <h1 className={styles.header}>Admin panel - settings</h1> */}
          <h1 className={styles.header} style={{color: 'var(--theme-color-contrast)'}}>Welcome back <span>{user.get('name') || '-'}</span>!</h1>
          <p className={styles.desc}>
            You can overwrite prices for any based on the SKU &#40;stock keeping unit&#41;. Remember that these will ALWAYS overwrite the default pricing - so be sure to keep them updated!
          </p>
        </div>

        <div className={styles.btns}>
          <Button type="link" variant="primary" to="/admin/settings" style={{width: '76px'}} className={styles.mobileFull}>
            <ArrowLeft />
            <span>Go back</span>
          </Button>
        </div>
      </div>


      <div className={styles2.filter}>
        <div className={styles2.search}>
          <Search />
          <input type="text" placeholder="Search by SKU" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className={styles2.sort} onClick={() => setSort(prev => prev === 0 ? 1 : 0)}>
          {sort === 0 ? <SortDown /> : <SortUp />}
          <p>{sort === 0 ? 'Price high to low' : 'Price low to high'}</p>
        </div>
      </div>
      
      {/* <div className={styles.boxes}>
        <Box title="Prices" icon={<PriceTag />} desc="Manually set prices for items" link="/admin/settings/prices" />
      </div> */}
      <div className={styles2.table}>
        <div className={styles2.header}>
          <p>Item</p>
          <p>Price &#40;in USD&#41;</p>
          <p>Price &#40;original&#41;</p>
          <p style={{float: 'right'}}>Action</p>
        </div>

        <div className={styles2.content}>
          {Object.keys(pricesSearch).map((sku, key) => {
            return (key >= index.min && key < index.max) ? (
              <div className={styles2.row} key={key} data-loading={!!loading[sku] || null}>
                {loading[sku] && (
                  <div className={styles2.loading}>
                    <LoadingSimple />
                  </div>
                )}

                <div data-blur="true" className={styles2.sku}>
                  <a href={names[sku]?.bp_link} target="_blank" rel="noopener noreferrer" style={{color: names[sku]?.color || null, fontWeight: '500'}}>
                    <span>{names[sku]?.name}</span>
                    <ExternalLinkOutline />
                  </a>
                  <p style={{fontSize: '12px', margin: '2px 0 0'}}>{sku}</p>
                </div>
                <div data-blur="true">
                  <input type="number" placeholder="0.00" value={pricesNew[sku]} onChange={e => updatePrice(sku, e.target.value)} />
                </div>
                <div data-blur="true" style={{
                  color: typeof pricesNew[sku] === 'undefined' ? 'var(--roulette-green-single)' : (
                    pricesNew[sku] === prices[sku] ? 'var(--roulette-green-single)' : 'var(--roulette-red-single)'
                  )
                }}>{window.insolve.helpers.formatBalance(prices[sku] || 0)}</div>
                <div data-blur="true">
                  <button onClick={() => saveNewPrice(sku)}>Save</button>
                  <button onClick={() => saveNewPrice(sku, true)}>Reset price</button>
                </div>
              </div>
            ) : null;
          })}

          {(Object.keys(pricesSearch).length === 0 || loadingGlobal) && (
            <div className={styles2.row} style={{display: 'block', textAlign: 'center'}}>
              <div style={{color: 'var(--text-color-secondary)'}}>
                {loadingGlobal ? 'Loading...' : 'Looks like there is nothing here'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* pages */}
      <div className={styles2.pages}>
        <Button type="link" to={`/admin/settings/prices/${parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : 1}`} variant="primary">
          <span>Previous page</span>
          <ArrowLeft />
        </Button>

        <div> <span>{page}</span> out of <span>{maxPages + 1}</span></div>

        <Button type="link" to={`/admin/settings/prices/${parseInt(page) + 1 >= (maxPages + 1) ? maxPages + 1 : parseInt(page) + 1}`} variant="primary">
          <span>Next page</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default Admin;