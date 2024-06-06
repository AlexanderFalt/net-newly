import PropTypes from 'prop-types';
import styles from '../styles/products.module.css'; // Importing CSS for styling
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import acer from '../assets/logos/acer.svg';
import apple from '../assets/logos/apple.svg';
import asus from '../assets/logos/asus.svg';
import dell from '../assets/logos/dell.svg';
import hp from '../assets/logos/hp.svg';
import huawei from '../assets/logos/huawei.svg';
import infinix from '../assets/logos/infinix.svg';
import lenovo from '../assets/logos/lenovo.svg';
import lg from '../assets/logos/lg.svg';
import microsoft from '../assets/logos/microsoft.svg';
import motorola from '../assets/logos/motorola.svg';
import msi from '../assets/logos/msi.svg';
import nokia from '../assets/logos/nokia.svg';
import oppo from '../assets/logos/oppo.svg';
import razer from '../assets/logos/razer.svg';
import samsung from '../assets/logos/samsung.svg';
import vivo from '../assets/logos/vivo.svg';
import xiaomi from '../assets/logos/xiaomi.svg';
import realme from '../assets/logos/realme.svg';


function SingleProduct({productId, originalPrice, discount, productName, brand, addToCart, productObject }) {
    const newPrice = originalPrice * (1 - discount / 100); // Calculate discounted price
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getProductLogo = () => {
        const lowerBrand = brand.toLowerCase();
        if (lowerBrand.includes("samsung")) return samsung;
        if (lowerBrand.includes("vivo")) return vivo;
        if (lowerBrand.includes("xiaomi")) return xiaomi;
        if (lowerBrand.includes("razer")) return razer;
        if (lowerBrand.includes("oppo")) return oppo;
        if (lowerBrand.includes("nokia")) return nokia;
        if (lowerBrand.includes("msi")) return msi;
        if (lowerBrand.includes("motorola")) return motorola;
        if (lowerBrand.includes("microsoft")) return microsoft;
        if (lowerBrand.includes("lg")) return lg;
        if (lowerBrand.includes("lenovo")) return lenovo;
        if (lowerBrand.includes("infinix")) return infinix;
        if (lowerBrand.includes("huawei")) return huawei;
        if (lowerBrand.includes("hp")) return hp;
        if (lowerBrand.includes("dell")) return dell;
        if (lowerBrand.includes("asus")) return asus;
        if (lowerBrand.includes("apple")) return apple;
        if (lowerBrand.includes("acer")) return acer;
        if (lowerBrand.includes("realme")) return realme;
        return "assets/logos/default.svg";  // Skapa en default svg
    }

    // Handling window resize
    useEffect(() => {
        // Define a function that updates the state with the current window width
        const handleResize = () => {
            console.log('Window resized to:', typeof window.innerWidth);  // Debugging output
            setWindowWidth(window.innerWidth);
        };

        // Call handleResize immediately to set the initial width
        handleResize();

        // Set up the resize event listener
        window.addEventListener('resize', handleResize);

        // Specify how to clean up after this effect
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={styles["product-container"]}>
            {windowWidth > 768 ? (
                // Horizontal layout for wider screens
                <>
                    <img src={getProductLogo()} alt={productName} className={styles['product-image']}/>
                    <h5 className={styles["product-title"]} style={{ textAlign: "center" }}>{productName}</h5>
                    <div className={styles["price-container"]}>
                        <p className={styles["price-original"]}>{originalPrice.toFixed(0)} kr</p>
                        <p className={styles['price-new']}>{newPrice.toFixed(0)} kr</p>
                    </div>
                    <div className={styles["buttons-container"]}>
                        <button className={styles["product-button"]} onClick={() => addToCart({
                            id: productId,
                            name: productName,
                            price: newPrice,
                            quantity: 1
                        })}>
                            <i className="fa-solid fa-cart-shopping"></i> Add
                        </button>
                        <Link to={"/product-information"} state={{ product: productObject }} className={styles["product-button"]}>
                            <i className="fa-solid fa-arrow-right"></i> More
                        </Link>
                    </div>
                </>
            ) : (
                // Vertical layout for narrower screens
                <>
                    <div className={styles["media-container-one"]}>
                        <img src={getProductLogo()} alt={productName} className={styles['product-image']} />
                        <h5 className={styles["product-title"]} style={{ textAlign: "center" }}>{productName}</h5>
                    </div>
                    <div className={styles["media-container-two"]}>
                    <div className={styles["price-container"]}>
                        <p className={styles["price-original"]}>{originalPrice.toFixed(0)} kr</p>
                        <p className={styles['price-new']}>{newPrice.toFixed(0)} kr</p>
                    </div>
                        <div className={styles["buttons-container"]}>
                            <button className={styles["product-button"]} onClick={() => addToCart({
                                id: productId,
                                name: productName,
                                price: newPrice,
                                quantity: 1
                            })}>
                                <i className="fa-solid fa-cart-shopping"></i> Add
                            </button>
                            <Link to={"/product-information"} state={{ product: productObject }} className={styles["product-button"]}>
                                <i className="fa-solid fa-arrow-right"></i> More
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

SingleProduct.propTypes = {
    originalPrice: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    productId: PropTypes.number.isRequired,
    addToCart: PropTypes.func.isRequired,
    productObject: PropTypes.object.isRequired,
};

export default SingleProduct;