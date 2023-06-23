import React, { useCallback, useMemo } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import urlIntoHtml from '../../helpers/urlIntoHtml';

import { FaceSmile } from '@styled-icons/fa-solid';
import { Send } from '@styled-icons/material-rounded/Send';
import { Delete} from '@styled-icons/fluentui-system-filled/Delete';
// import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
import { Check } from '@styled-icons/fa-solid/Check';
import { Lock } from '@styled-icons/boxicons-solid/Lock';
// import { VolumeOff } from '@styled-icons/fa-solid';
import { Warning } from '@styled-icons/fluentui-system-filled/Warning';
// import { User } from '@styled-icons/fa-solid/User';
// import { Gift } from '@styled-icons/fa-solid/Gift';
import { DotsHorizontal } from '@styled-icons/heroicons-outline/DotsHorizontal';
import { Backpack } from '@styled-icons/fluentui-system-filled/Backpack';
import { MessageDetail } from '@styled-icons/boxicons-solid/MessageDetail';
import { ChevronDownOutline } from '@styled-icons/evaicons-outline/ChevronDownOutline';

import admin from '../../resources/images/chat/admin.png';
import yt from '../../resources/images/chat/yt.png';
import dev from '../../resources/images/chat/dev.png';

import Dropdown from '../../components/Dropdown';
import styles from './index.module.css';
import TradeList from './TradeList';

const { events, chat, STATIC, user } = window.insolve;
const emojisPattern = new RegExp(/(:(?![\n])[()#$@\w]+:)/, "g");

const MsgLoading = () => (
  <div className={styles.msgLoading}>
    <div className={styles.avatar} />
      <div className={styles.title} />
      <div className={styles.text} />
  </div>
);

const addZeros = num => num > 9 ? num : '0' + num;
function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

const Msg = ({ user, self, content, system, emojis = [], gifs = [], highlight, time, deleteMessage }) => {
  const [dropdown, setDropdown] = useState(false);
  const links = useMemo(() => {
    const time2 = new Date(time === 0 ? +new Date() : time * 1000);

    return self?.rank >= 3 ? [
      {name: 'Delete message', icon: <Delete />, onClick: () => deleteMessage({
        steamid: user?.steamid,
        content,
        time: Math.round(time2.getTime() / 1000)
      })},
    ] : []
  }, [self]); 

  system = (system === null || typeof system === 'undefined') ? false : true;
  system = !user?.id;
  // highlight = content.includes('[hl]') && user?.rank === 0;

  const contentRender = useMemo(() => {
    let final = parseInt(user?.rank) !== 4 ? escapeHtml(content) : content;

    // replace emojis
    final = final.replace(emojisPattern, match => {
      let emoji = emojis.filter(emote => emote.name === match.split(':')[1])[0];
      return emoji ? `<img data-emoji="true" loading="lazy" src="${chat.emojisPrefix}/${emoji.url}" title="${emoji.name}" alt="${emoji.name}" />` : match;
    });

    // replace gifs
    // todo: allow only one gif per message
    if(user?.level >= 10) {
      gifs.forEach(gif => {
        final = final.replace(`[gif:${gif}]`, `<img src="${gif}" loading="lazy" alt="" />`);
      });
    }
    
    // replace links with clickable links
    final = urlIntoHtml(final);
    
    return final;
  }, [content]);

  // time
  const timeRender = useMemo(() => {
    const time2 = new Date(time === 0 ? +new Date() : time * 1000);

    return `${addZeros(time2.getHours())}:${addZeros(time2.getMinutes())}`;
  }, [time]);

  // render
  return (
    <div className={styles.msg} data-system={system ? true : null} data-highlight={highlight ? true : null} data-rank={user?.rank || null}>
      <div className={styles.avatar} onClick={() => events.emit('internal:toggleUserModal', user)}>
        {system ? (
          <Warning />
        ) : (
          <>
            {(user?.name && user?.rank === '0') && <span className={styles.lvl}>{user?.level || 0}</span>}
            <img src={user?.avatar} alt="" loading="lazy" />
          </>
        )}
      </div>
      
      <div className={styles.text}>
        <div className={styles.name}>
          {/* {(user?.name && user?.rank === '0') && <span className={styles.lvl} data-level={true}>{user?.level || 0}</span>} */}
          {/* 
          {(STATIC.RANKS[ user?.rank ] && parseInt(user?.rank) !== 0) && (
            <span className={styles.badge}>{STATIC.RANKS[ user?.rank ]}</span>
          )}
           */}
          {['Owner', 'Admin'].includes(STATIC.RANKS[user?.rank]) && <img src={admin} title={STATIC.RANKS[user?.rank]} alt="" />}
          {['Youtuber'].includes(STATIC.RANKS[user?.rank]) && <img src={yt} title={STATIC.RANKS[user?.rank]} alt="" />}
          {['Moderator'].includes(STATIC.RANKS[user?.rank]) && <img src={dev} title={STATIC.RANKS[user?.rank]} alt="" />}

          {/* <span className={styles.lvl}>{user?.level || 0}</span> */}
          <span className={styles._name}>{user?.name ? (user?.name) : (system ? '### SYSTEM ###' : '-')}</span>
          <span className={styles.time}>{timeRender}</span>
        
          {(!system && links.length > 0) && (
             <>
               <DotsHorizontal className={styles.drp} onClick={() => setDropdown(prev => !prev)} />

               <Dropdown bottom={0} right={0} links={links} visible={dropdown} toggle={setDropdown} />
             </>
           )}
        </div>
          
        <div style={{width: '100%', float: 'left'}} />

        <div className={styles.content} dangerouslySetInnerHTML={{__html: contentRender}}></div>
      </div>
    </div>
  );
};

const Emojis = ({ visible, toggle, insert, emojis = [], gifs = [] }) => {
  const [tab, setTab] = useState(0);
  const [currEmoji, setCurrEmoji] = useState(undefined);
  const [showList, setShowList] = useState(false);
  const [level, setLevel] = useState(user.get('level') || 0);

  const onLevel = d => {
    setLevel(d.level);
  }

  const clickRef = React.useRef();
  useClickOutside(clickRef, () => visible && toggle(false));

  useEffect(() => {
    if(visible) return setShowList(visible);

    const tmt = setTimeout(() => setShowList(visible), 300);

    events.on('user:levelProgress', onLevel);

    return () => {
      events.off('user:levelProgress', onLevel);
      clearTimeout(tmt);
    };
  }, [visible]);

  return (
    <div className={styles.emojis} data-active={visible} ref={clickRef}>
      <div className={styles.tabs}>
        <div data-select={tab === 0} onClick={() => setTab(0)}>Emojis</div>
        <div data-select={tab === 1} onClick={() => setTab(1)}>Gifs</div>
      </div>

      {/* emoji list */}
      {(showList && tab === 0) && (
        <>
          <div className={styles.list}>
            {emojis.map((emoji, i) => (
              <div className={styles.emoji} key={i} onClick={() => insert(emoji)} onMouseOver={() => setCurrEmoji(emoji)} onMouseOut={() => setCurrEmoji(undefined)}>
                <img src={`${chat.emojisPrefix}/${emoji.url}`} alt={emoji.name} />
              </div>
            ))}
          </div>

          <div className={styles.preview}>
            {currEmoji && (
              <>
                <img src={`${chat.emojisPrefix}/${currEmoji.url}`} alt={currEmoji.name} />
                <p>:{currEmoji.name}:</p>
              </>
            )}
          </div>
        </>
      )}

      {/* gifs list */}
      {(showList && tab === 1) && (
        <div className={styles.gifs} data-locked={level < 10}>
          <div className={styles.lock}>
            <Lock />
            <p>You need to be at least <span>level 10</span> to use GIFs in the chat.</p>
          </div>

          {gifs.map((gif, i) => (
            <div className={styles.gif} key={i} onClick={() => insert(gif, true)}>
              <img src={gif} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Chat = () => {
  const [showNew, setShowNew] = useState(false);
  const [room, setRoom] = useState(window.insolve.store.get('lastJoinedRoom') || 0);
  const [showList, setShowList] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [online, setOnline] = useState({total: 0, rooms: []});
  const [showRoomNotification, setShowRoomNotification] = useState(false);
  const [msgLimit, setMsgLimit] = useState(10);
  const [emojis, setEmojis] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [tab, setTab] = useState('chat');
  const [self] = useState(window.insolve.store.get('user') || undefined); // todo: maybe have to make it [self, setSelf]

  const messagesEndRef = useRef(null);
  const inputRef = React.useRef();
  const roomListRef = React.useRef();

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight + 500;
  }

  const onScroll = () => {
    const obj = messagesEndRef.current;
    const fullyScrolled = obj.scrollTop === (obj.scrollHeight - obj.offsetHeight);

    setShowNew(!fullyScrolled);
  }

  // const joinRoom = key => {
  //   setRoom(key);
  //   setShowList(false);
  // }

  const sendMessage = useCallback(msg => {
    msg = msg || message;
    if(msg.replace(/\s/g, '') === '') return;
    
    chat.sendMessage(msg, room);
    setMessage('');
  }, [message, room]);

  const deleteMessage = dataa => {
    // { steamid, content, time, room }

    chat.deleteMessage({...dataa, room});
  }

  const onRoomJoin = ({ msgs, config }) => {
    setMsgs([]);
    setIsLoading(false);
    setShowRoomNotification(true);
    setMsgLimit(config.limit);
    setConnected(true);

    setMsgs(prev => [...prev, ...msgs]);
    // msgs.forEach(onMessage);
  }

  const onMessage = data => {
    setMsgs(prev => [...prev, {user: data.user, content: data.content, time: data.time}]);
    setConnected(true);
  }

  const onDeleteMessage = ({ steamid, content, time }) => {
    setMsgs(prev => {
      prev = [...prev];
      
      prev = prev.filter(x => {
        if(x.time === time && x?.user?.steamid === steamid) { // todo: check content or even better use ID
          return false;
        } else {
          return true;
        }
      });

      return prev;
    });
  }

  const onError = data => {
    setMsgs(prev => [...prev, {system: true, content: data}]);
  }

  const insertEmoji = (emoji, isGif = false) => {
    setMessage(prev => isGif ? `${prev}[gif:${emoji}]` : `${prev}:${emoji.name}: `);
    setShowEmojis(false);
  }

  const requestEmojis = async () => {
    const data = await chat.getEmojis();

    setEmojis(data?.emojis || data);
    setGifs(data?.gifs || []);
  }

  const setConnectedTrue = () => setConnected(true);
  const setConnectedFalse = () => setConnected(false);

  const updateOnline = data => {
    setOnline({
      total: data.reduce((a, b) => +a + +b.total, 0),
      rooms: data
    });
    setConnected(true);
  }


  useClickOutside(roomListRef, () => showList && setShowList(false));

  // auto focus on chat after closing emoji box
  useEffect(() => {
    if(!showEmojis && inputRef !== null) inputRef.current.focus();
  }, [showEmojis]);

  // hide the room notif after 3 seconds
  useEffect(() => {
    if(!showRoomNotification) return;

    const tmt = setTimeout(() => setShowRoomNotification(false), 1500);

    return () => clearTimeout(tmt);
  }, [showRoomNotification]);

  // scroll to bottom automatically
  useLayoutEffect(scrollToBottom, [room, msgs, isLoading]);

  // limit amount of messages
  useEffect(() => {
    if(msgs.length <= msgLimit) return;

    setMsgs(prev => {
      prev.splice(0, prev.length - msgLimit);

      return prev;
    });
  }, [msgs, msgLimit]);

  // watch for room changes
  useEffect(() => {
    // todo: make this not happen on first load
    setIsLoading(true);
    chat.joinRoom(room);
  }, [room]);

  // componentDidMount basically
  useEffect(() => {
    const onInternalSendChat = data => {
      sendMessage(data);
    }

    events.on('io:connected', setConnectedTrue);
    events.on('io:connect_error', setConnectedFalse);
    events.on('chat:online', updateOnline);
    events.on('chat:joined_room', onRoomJoin);
    events.on('chat:message', onMessage);
    events.on('chat:deleteMessage', onDeleteMessage);
    events.on('chat:error', onError);
    events.on('internal:sendChat', onInternalSendChat);

    requestEmojis();

    return () => {
      events.off('io:connected', setConnectedTrue);
      events.off('io:connect_error', setConnectedFalse);
      events.off('chat:online', updateOnline);
      events.off('chat:joined_room', onRoomJoin);
      events.off('chat:message', onMessage);
      events.off('chat:deleteMessage', onDeleteMessage);
      events.off('chat:error', onError);
      events.off('internal:sendChat', onInternalSendChat);
    }
  }, [sendMessage]);

  return (
    <div className={styles.chatContainer} data-open={mobileChatOpen ? true : null} data-tab={tab}>
      <div className={styles.overlay} onClick={() => setMobileChatOpen(false)} />
      <div className={styles.toggleChat} onClick={() => setMobileChatOpen(true)}>
        <MessageDetail />
      </div>

      <Emojis emojis={emojis} gifs={gifs} visible={showEmojis} toggle={setShowEmojis} insert={insertEmoji} />

      <div className={styles.container}>
        {/* info bar */}
        <div className={styles.info}>
          <div className={styles.switch} data-right={tab === 'trades'}>
            <div data-active={tab === 'chat' || null} onClick={() => setTab('chat')}><MessageDetail /></div>
            <div data-active={tab === 'trades' || null} onClick={() => setTab('trades')}><Backpack /></div>
          </div>

          {/* <div className={styles.online}>
            <User />
            <span>{online?.total || 0}</span>
          </div>  */}
          <div className={styles.online} data-connected={connected}>
            <div><p /></div>
            <p className={styles.text}>
              {/* Online: */}
              <span>{online.total}</span>
            </p>
          </div>
        </div>


        {/* messages */}
        <div className={styles.msgs}>
          {/* <div className={styles.gradient} /> */}

          <div className={styles.joined} data-active={showRoomNotification}>
            <Check />
            <p>Joined the {online.rooms[room]?.title || '?'}</p>
          </div>
          <div className={styles.new} data-visible={showNew} onClick={scrollToBottom}>
            <ChevronDownOutline />
          </div>

          <div className={styles.scroll} ref={messagesEndRef} onScroll={onScroll}>
            {isLoading ? [...Array(12)].map((e, i) => <MsgLoading key={i} />) : msgs.map((item, key) => <Msg key={key} time={item.time || 0} user={item.user} system={item.system ? true : null} content={item.content} gifs={gifs} emojis={emojis} self={self} deleteMessage={deleteMessage} />)}
          </div>
        </div>

        <div className={styles.trades}>
          <TradeList active={tab === 'trades'} />
        </div>

        <div className={styles.footer}>
          <div className={styles.input}>
            <input type="text" autoComplete="new-off" placeholder="Say hello to chat!" ref={inputRef} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} value={message} />
            <Send className={styles.send} onClick={() => sendMessage()} />

            <div className={styles.icons}>
              <FaceSmile onClick={() => setShowEmojis(prev => !prev)} />
            </div>
          </div>

          {/*
          <div className={styles.online} data-connected={connected}>
            <div><p /></div>
            <p>Online: <span>{online.total}</span></p>
          </div>

          <div className={styles.room} data-open={showList}>
            <div className={styles.selected} onClick={() => setShowList(prev => !prev)}>
              <ChevronUp />
              <span className={styles.select}>{(online.rooms[room]?.title || '?').split(' ')[0]}</span>
            </div>

            <span>Room: </span>

            <div className={styles.rooms} ref={roomListRef}>
              {online.rooms.map((item, key) => (
                <div data-active={parseInt(key) === parseInt(room)} className={styles.selector} key={key} onClick={() => joinRoom(key)}>
                  <div>
                    <img src={`https://flagicons.lipis.dev/flags/4x3/${item.code}.svg`} alt="" />
                  </div>
                  <p>
                    <span className={styles.name}>{item.title}</span>
                    <span className={styles.count}>{online.rooms.filter(x => x.id === item.id)[0]?.total || 0}/{online.total}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

export default Chat;