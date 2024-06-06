import styles from '../styles/checkOut.module.css';
import PropTypes from 'prop-types';
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

function CheckOut({ products, cart, removeFromCart }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const totalPrice = cart.reduce((acc, item) => {
        const product = products.find(p => p.props.productId === item.id);
        return product ? acc + (product.props.originalPrice - ((product.props.discount/100) * product.props.originalPrice)) : acc; // Check if product exists
    }, 0);

    const getProductLogo = (brand) => {
        if (brand.includes("samsung")) return samsung;
        if (brand.includes("vivo")) return vivo;
        if (brand.includes("xiaomi")) return xiaomi;
        if (brand.includes("razer")) return razer;
        if (brand.includes("oppo")) return oppo;
        if (brand.includes("nokia")) return nokia;
        if (brand.includes("msi")) return msi;
        if (brand.includes("motorola")) return motorola;
        if (brand.includes("microsoft")) return microsoft;
        if (brand.includes("lg")) return lg;
        if (brand.includes("lenovo")) return lenovo;
        if (brand.includes("infinix")) return infinix;
        if (brand.includes("huawei")) return huawei;
        if (brand.includes("hp")) return hp;
        if (brand.includes("dell")) return dell;
        if (brand.includes("asus")) return asus;
        if (brand.includes("apple")) return apple;
        if (brand.includes("acer")) return acer;
        if (brand.includes("realme")) return realme;
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
        <>
            {windowWidth > 768 ? (
                <main className={styles["cart-container"]}>
                    <div className={`${styles['larg-container']} ${styles['show-product']}`}>
                        {cart.map((cartItem, index) => {
                            const product = products.find(product => product.props.productId === cartItem.id);
                            if (!product) {
                                return <div key={index}>Product not found</div>; // Handle missing products gracefully
                            }
                            return (
                                <div className={styles["product-container"]} key={index}>
                                    <div className={styles["item-container"]}>
                                        <p className={styles["item-info"]} style={{marginBottom: "0.5%"}}>{product.props.productName}</p>
                                        <p className={styles["item-info"]}>{(product.props.originalPrice - ((product.props.discount/100) * product.props.originalPrice)).toFixed(0)} kr</p>                    
                                    </div>
                                    <button className={styles["trash-button"]} onClick={() => removeFromCart(product.props.productId)}><i className="fa-solid fa-trash fa-xl"></i></button>
                                    <img src={getProductLogo(product.props.brand.toLowerCase())} alt="Item logo" className={styles["product-logo"]}/>
                                </div>
                            );
                        })}
                    </div>
                    <div className={`${styles['larg-container']} ${styles['price-confirmation']}`}>
                        <div className={`${styles['small-container']} ${styles['one-small']}`}>
                            <h2 className={styles['total-price']}>Total Price: {totalPrice.toFixed(0)} kr</h2>
                        </div>
                        <div className={`${styles['small-container']} ${styles['two-small']}`}>
                            <form action="" className={styles["form-order"]}>
                                <label htmlFor="name" className={styles["order-info"]}>
                                    <input type="text" id="name" placeholder='Your name...' />
                                </label>
                                <label htmlFor="email" className={styles["order-info"]}>
                                    <input type="text" id="email" placeholder='email@address.com' />
                                </label>
                                <label htmlFor="cardNumber" className={styles["order-info"]}>
                                    <input type="number" id="cardNumber" placeholder='Card numbers' />
                                </label>
                                <label htmlFor="cvc" className={styles["order-info"]}>
                                    <input type="number" id="cvc" placeholder='CVC' />
                                </label>
                                <label htmlFor="date" className={styles["order-info"]}>
                                    <input type="text" id="date" placeholder='Card expiration date' />
                                </label>
                                <label htmlFor="address" className={styles["order-info"]}>
                                    <input type="text" name="address" placeholder='Home address' />
                                </label>
                                <input type="Submit" value="Purchase" className={styles["order-button"]}/>
                            </form>
                        </div>
                    </div>
                </main>
                ) : (
                    <main className={styles["cart-container"]}>
                    <div className={`${styles['larg-container']} ${styles['show-product']}`}>
                        {cart.map((cartItem, index) => {
                            const product = products.find(product => product.props.productId === cartItem.id);
                            if (!product) {
                                return <div key={index}>Product not found</div>; // Handle missing products gracefully
                            }
                            return (
                                <div className={styles["product-container"]} key={index}>
                                    <div className={styles["item-container"]}>
                                        <p className={styles["item-info"]} style={{marginBottom: "0.5%"}}>{product.props.productName}</p>
                                        <p className={styles["item-info"]}>{(product.props.originalPrice - ((product.props.discount/100) * product.props.originalPrice)).toFixed(0)} kr</p>                    
                                    </div>
                                    <button className={styles["trash-button"]} onClick={() => removeFromCart(product.props.productId)}><i className="fa-solid fa-trash fa-xl"></i></button>
                                    <img src={getProductLogo(product.props.brand.toLowerCase())} alt="Item logo" className={styles["product-logo"]}/>
                                </div>
                            );
                        })}
                    </div>
                        <div className={`${styles['small-container']} ${styles['one-small']}`}>
                            <h2 className={styles['total-price']}>Total Price: {totalPrice.toFixed(0)} kr</h2>
                        </div>
                        <div className={`${styles['small-container']} ${styles['two-small']}`}>
                            <form action="" className={styles["form-order"]}>
                                <label htmlFor="name" className={styles["order-info"]}>
                                    <input type="text" id="name" placeholder='Your name...' />
                                </label>
                                <label htmlFor="email" className={styles["order-info"]}>
                                    <input type="text" id="email" placeholder='email@address.com' />
                                </label>
                                <label htmlFor="cardNumber" className={styles["order-info"]}>
                                    <input type="number" id="cardNumber" placeholder='Card numbers' />
                                </label>
                                <label htmlFor="cvc" className={styles["order-info"]}>
                                    <input type="number" id="cvc" placeholder='CVC' />
                                </label>
                                <label htmlFor="date" className={styles["order-info"]}>
                                    <input type="text" id="date" placeholder='Card expiration date' />
                                </label>
                                <label htmlFor="address" className={styles["order-info"]}>
                                    <input type="text" name="address" placeholder='Home address' />
                                </label>
                                <input type="Submit" value="Purchase" className={styles["order-button"]}/>
                            </form>
                        </div>
                </main>
            )}
        </>
    );
}

CheckOut.propTypes = {
    products: PropTypes.array.isRequired,
    cart: PropTypes.array.isRequired,
    removeFromCart: PropTypes.func.isRequired,
};

export default CheckOut;