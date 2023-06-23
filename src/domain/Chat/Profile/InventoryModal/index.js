import React, { useState, useEffect, useCallback } from "react";
import useClickOutside from '../../../../hooks/useClickOutside';
import { QuestionCircle } from '@styled-icons/fa-solid/QuestionCircle';
import { Backpack } from '@styled-icons/fluentui-system-filled/Backpack';
import Button from "../../../../components/Button";
import ItemSmall from '../../../../components/ItemSmall';
// import Modal from "../../components/Modal";
// import { ReactComponent as Coins } from "../../../../components/Coins.svg";

import styles from "./index.module.css";

// const { events } = window.insolve;

const InventoryModal = () => {
  const [visible, setVisible] = useState(false);
  const [inventory, setInventory] = useState([]);

  const clickRef = React.useRef();
  useClickOutside(clickRef, () => visible && setVisible(false));

  // selected items
  const selected = inventory.filter(x => x.active).length;

  // const close = () => setVisible(false);
  const open = () => setVisible(true);
  const selectItem = assetid => {
    const inv = inventory.map(item => {
      if(item.assetid === assetid) {
        item.active = !item.active;
        item.activeId = inventory.filter(it => !!it.active).length + 1; // for visual purposes
      }

      return item;
    });

    setInventory(inv);
  }

  const selectOrUnselectAll = useCallback(force => {
    setInventory(currItems => {
      currItems.forEach(item => {
        item.active = typeof force !== 'undefined' ? !!force : selected < inventory.length;
      });

      return [...currItems];
    });
  }, [inventory, selected]);

  // unselect all when closing
  // useEffect(() => !visible && selectOrUnselectAll(false), [visible, selectOrUnselectAll]);

  // listen for events
  useEffect(() => {
    window.insolve.events.on("internal:toggleInventoryModal", open);
    return () => window.insolve.events.off("internal:toggleInventoryModal", open);
  }, []);

  // add items
  /*
  useEffect(() => {
    let inv = [];

    for(let i=0; i<2; i++) {
      inv = inv.concat([{"name":"Bone Cage Box","price":2814,"assetid":"3598949092335067391","classId":"4504818934","instanceId":"0","image":"https://community.cloudflare.steamstatic.com/economy/image/6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835dd42LMfCk4nReh8DEiv5daMKo6pbA3SPy8iYdN1j8","color":"35a3f1","nametag":"","stickers":[],"tradableAfter":0},{"name":"Green Hoodie","price":297,"assetid":"3598948460145859793","classId":"1141874029","instanceId":"0","image":"https://community.cloudflare.steamstatic.com/economy/image/6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835Ja5GXHfCk4nReh8DEiv5dYOak6pLc0SfygfcCVUQ","color":"a7ec2e","nametag":"","stickers":[],"tradableAfter":0},{"name":"Weather Sleeping Bag","price":2942,"assetid":"3473957715976352166","classId":"4114226677","instanceId":"0","image":"https://community.cloudflare.steamstatic.com/economy/image/6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835de4WLGfCk4nReh8DEiv5ddOKs-qbw_Sfy7cTcl_I8","color":"35a3f1","nametag":"","stickers":[],"tradableAfter":0},{"name":"Blackout Jacket","price":3183,"assetid":"3740817556510064045","classId":"4029168713","instanceId":"0","image":"https://community.cloudflare.steamstatic.com/economy/image/6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835BX42LCfCk4nReh8DEiv5daPqw9qbc2Qfm-cPJbhSA","color":"a7ec2e","nametag":"","stickers":[],"tradableAfter":0}]);
      
      inv.forEach((item, key) => {
        item.price = key + 1;
        // item.price = parseInt(Math.random() * 400 + 40);
        item.assetid = `xx-${parseInt(Math.random() * 99999 + 1000)}`;
      });
    }

    setInventory(inv.sort((a,b) => a.price - b.price));
  }, []);
  */


  return (
      <div className={styles.container} ref={clickRef} data-open={visible ? true : null}>
        <div className={styles.header2}>
          <Backpack />
          <span>Inventory</span>

          <QuestionCircle className={styles.help} />
        </div>

        <div className={styles.items}>
          {inventory.map((item, key) => <ItemSmall key={key} item={item} select={selectItem} checkbox />)}
        </div>

        <div className={styles.footer}>
          <Button block type="button" variant="primary" style={{marginRight: '10px'}} onClick={() => selectOrUnselectAll()}>
            {selected >= inventory.length ? 'Unselect all' : 'Select all'}
          </Button>
          <Button block type="button" disabled={selected <= 0}>Sell {selected} items</Button>
        </div>
      </div>
  );
};

export default InventoryModal;
