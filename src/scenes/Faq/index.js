import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from '@styled-icons/boxicons-regular/ChevronDown';
import { Search } from '@styled-icons/boxicons-regular/Search';
import styles from './index.module.css';

const LIST = [
  {title: 'What is TF2Double?', content: 'TF2Double is a gambling site that provides a fun and engaging platform for players to gamble and win TF2 skins.'},
  {title: 'How do I know my results are fair?', content: 'When it comes to fairness - transparency is a must, and to serve this purpose we use a provably fair system. A provably fair algorithm solves the trust issue between players and operators by providing a transparent way to verify round results, check (text link to provably fair page) for more information.'},
  {title: 'My offer is missing an item!', content: 'The site can tax up to 10% of each game. If you are missing an item, it is likely because the item was taxed. If you believe the taxed item was over 10%, please open a support ticket.'},
  {title: 'Why are my skins underpriced / overpriced here?', content: 'Our prices are sourced from a few different sources to ensure fair value for your items. Items that exist in lower quantities, or have different rarity specifications may have a significantly lower or higher price.'},
  {title: 'The animation lagged. Can I get a refund?', content: <>Lag is a common issue caused by high latency or bad internet connection on the user\'s end. We only refund for errors on our end. Animation is for visual purposes only - The actual result is determined before the animation and can be verified using our <Link to="/provably-fair">provably fair page</Link>. If you have any concerns, feel free to contact our support.</>},
];

const FaqElement = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  return (
    <div className={styles.element} data-open={open || null}>
      <div className={styles.header} onClick={() => setOpen(prev => !prev)}>
        <span>{title}</span>
        <ChevronDown />
      </div>

      <div className={styles.content} ref={ref} style={open ? {height: `${ref?.current?.scrollHeight || '0'}px`} : null}>
        {children}
      </div>
    </div>
  );
}

const Faq = () => {
  const [search, setSearch] = useState('');
  return (
    <div className={styles.faq}>
      <h2>Frequently asked questions</h2>

      <div className={styles.container}>
        <div className={styles.search}>
          <input type="text" placeholder="Search for a question" value={search} onChange={e => setSearch(e.target.value)} />
          <Search />
        </div>

        {LIST.filter(question => question.title.toLowerCase().includes(search.toLowerCase())).map((question, key) => (
          <FaqElement key={key} title={question.title}>
            {question.content}
          </FaqElement>
        ))}
      </div>
    </div>
  );
}

export default Faq;