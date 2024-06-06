import styles from '../styles/products.module.css';
import PropTypes from 'prop-types';

function Products({ products}) {
    return (
        <main className={styles["main-products-page"]}>
            {products}
        </main>
    );
}

Products.propTypes = {
    products: PropTypes.func.isRequired,
  };

export default Products;