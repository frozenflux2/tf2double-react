import Button from '../../components/Button';
import { DiscordAlt as Discord } from '@styled-icons/boxicons-logos/DiscordAlt';
import { Envelope } from '@styled-icons/zondicons/Envelope';
import { Link } from 'react-router-dom';
import styles from './index.module.css';


const Faq = () => {
  return (
    <div className={styles.faq}>
      <h2>Support</h2>

      <div className={styles.container}>
        <p>Did your deposit not go through? You're wondering how much our fee is? Want to ask about sponsorships?</p>
        <p>Please refer to the <Link to="/faq">Frequently Asked Questions</Link> page first.</p>
        <p>If your question isn't answered there, you can contact us via <a href="https://discord.gg/kjH4nPcBpD" target="_blank" rel="noopener noreferrer">Discord</a> or <a href="mailto:support@tf2double.com">email</a>.</p>
      
        <div className={styles.btns}>
          <Button type="external" newTab href="https://discord.gg/kjH4nPcBpD">
            <Discord />
            <span>Discord</span>
          </Button>

          <Button type="external" newTab href="mailto:support@tf2double.com" variant="primary">
            <Envelope />
            <span>Email</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Faq;