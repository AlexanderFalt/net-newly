import React from "react";
import styles from "../styles/header.module.css";
import { useState } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ products }) {
    const staticLogo = <i className="fa-solid fa-magnifying-glass fa-lg" id={styles["searchButtonStatic"]}></i>;
    const exitLogo = <i className="fa-solid fa-x fa-lg" id={styles["searchButtonExit"]} onClick={() => {setActiveSearch("searchWindowUnactive"); setSearchLogo(staticLogo);}}></i>; // När x:et klickas stängs sök rutan ner.
    const [query, setQuery] = useState(""); // State för sökningen.
    const [activeSearch, setActiveSearch] = useState("searchWindowUnactive"); // Oaktiverad på start.
    const [searchLogo, setSearchLogo] = useState(staticLogo);

    function filterProducts() {
        return products.filter(product => // brand or product
            (product.props.brand && typeof product.props.brand === 'string' && product.props.brand.toLowerCase().includes(query.toLowerCase())) || // Check the query compared to the product brand of the products. And if its a string.
            (product.props.productName && typeof product.props.productName === 'string' && product.props.productName.toLowerCase().includes(query.toLowerCase())) // Check the query compared to the product name of the products. And if its a string.
        );
    }
    const filteredProducts = filterProducts(); // This will run every render when 'query' changes

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
                    React.cloneElement(product, { key: index }) // Key så att react kan skilja producterna. Och sedan clone element klonar bara de producter sam passerar filteredProducts.
                ))}
            </div>
        </section>
    );
}

SearchBar.propTypes = {
    products: PropTypes.array.isRequired,
};

export default SearchBar;