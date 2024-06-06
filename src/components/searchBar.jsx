import React from "react";
import styles from "../styles/header.module.css";
import { useState } from 'react';
import PropTypes from 'prop-types';

{/*
    - Make it so that its not onBlur={() => serActiveSearch("searchWindowUnactive")} instead do a X button for that 
*/}

function SearchBar({ products }) {
    const staticLogo = <i className="fa-solid fa-magnifying-glass fa-lg" id={styles["searchButtonStatic"]}></i>;
    const exitLogo = <i className="fa-solid fa-x fa-lg" id={styles["searchButtonExit"]} onClick={() => {setActiveSearch("searchWindowUnactive"); setSearchLogo(staticLogo);}}></i>;
    const [query, setQuery] = useState("");
    const [activeSearch, setActiveSearch] = useState("searchWindowUnactive");
    const [searchLogo, setSearchLogo] = useState(staticLogo);

    function filterProducts() {
        return products.filter(product =>
            (product.props.brand && typeof product.props.brand === 'string' && product.props.brand.toLowerCase().includes(query.toLowerCase())) ||
            (product.props.productName && typeof product.props.productName === 'string' && product.props.productName.toLowerCase().includes(query.toLowerCase()))
        );
    }
    const filteredProducts = filterProducts(); // This will re-run every render when 'query' changes

    return (
        <section name="search" className={styles["searchBar"]}>
            <div className={styles["binder"]}>
                {searchLogo}
                <input 
                    type="text" 
                    className={styles["searchArea"]} 
                    spellCheck="false" 
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => {
                        setActiveSearch("searchWindowActive"); 
                        setSearchLogo(exitLogo);
                    }
                }
                />
            </div>
            <div className={styles[activeSearch]}>
                {filteredProducts.map((product, index) => (
                    React.cloneElement(product, { key: index }) // Use React.cloneElement to manage elements
                ))}
            </div>
        </section>
    );
}

SearchBar.propTypes = {
    products: PropTypes.array.isRequired,
};

export default SearchBar;