import styles from "../styles/header.module.css";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavBar({ numberOfItems }) {
    const hoverCheckOut = (hoverColor) => {
        document.getElementById("counterCart").style.borderColor = hoverColor;
    }
  
    return(
    <>
        <nav>
            <ul>
                <li><Link to="/" className={styles['menuItem']}>Home</Link></li>
                <li><Link to="/products" className={styles['menuItem']}>Products</Link></li>
                <li><Link to="/chat" className={styles['menuItem']}>Chat</Link></li>
                <li><Link to="/send-in" className={styles['menuItem']}>Send In</Link></li>
                <li onMouseEnter={() => hoverCheckOut('black')} onMouseLeave={() => hoverCheckOut('white')}><Link to="/checkout" className={styles['menuItem']}>Check out<div id="counterCart" className={styles["holder-cart-amount"]}><p className={styles["holder-number"]}>{numberOfItems}</p></div></Link></li>
                <li><Link to="/contact-us" className={styles['menuItem']}>Contact Us</Link></li>
            </ul>
        </nav>
    </>
    )
}

NavBar.propTypes = {
    numberOfItems: PropTypes.func.isRequired,
  };

export default NavBar;