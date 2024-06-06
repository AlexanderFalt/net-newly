import styles from '../styles/header.module.css';
import PropTypes from 'prop-types';

function Header({ toggleNav, toggleSearch }) {
    return (
        <header>
            <div className={styles["wrapper"]}>
                <button href="#" id={styles["menuIcon"]} onClick={toggleNav}>
                    <i className="fa-solid fa-bars fa-2xl" id={styles["menuButton"]}></i>
                </button>
                <h1>NetNewly</h1>
                <button href="#" id={styles["searchIcon"]} onClick={toggleSearch}>
                    <i className="fa-solid fa-magnifying-glass fa-2xl" id={styles["searchButton"]}></i>
                </button>
            </div>
        </header>
    )
}

Header.propTypes = {
    toggleNav: PropTypes.func.isRequired,
    toggleSearch: PropTypes.func.isRequired,
  };

export default Header;