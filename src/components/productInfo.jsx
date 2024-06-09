import styles from "../styles/productInfo.module.css";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
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

function ProductInfo({ addToCart }) {
    const location = useLocation(); // useLocation används för att få tillgång till state som vi ancänder för att få till gång till just det productObjektet vi vill ha.
    const productObject = location.state;

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
        return "assets/logos/default.svg";  
    }

    if (!productObject) { 
        console.error('Product data is not available.');
    }

    const [slideIndex, setSlideIndex] = useState(1); // Orginella sliden som den ska vissa. Slide number 1.

    // Ändra slide nummer.
    const changeSlide = (n) => { //
        setSlideIndex(prev => {
            const newIndex = prev + n;
            const numSlides = document.getElementsByClassName(styles.mySlides).length;
            if (newIndex > numSlides) return 1; // Om newIndex är större än numSlides gå tillbaka till första slide.
            if (newIndex < 1) return numSlides; // Om newIndex är mindre än numSildes gå tillbaka till sista slide.
            return newIndex;
        });
    };

    // display the correct slide based on slideIndex
    useEffect(() => {
        const slides = document.getElementsByClassName(styles.mySlides); // Skapar en HTMLcollection av antalet slides.
        const dots = document.getElementsByClassName(styles.dot); // Skapar en HTMLcollection av dots.
        Array.from(slides).forEach(slide => { // Använder Array.from på grund av att man kan inte använda forEach on HTMLcollection så detta undviker det problemet. Med att gör slides till array.
            slide.style.display = "none"; // Ändrar display till alla föremål i listan till none.
        });
        Array.from(dots).forEach(dot => {
            dot.className = dot.className.replace("active", ""); // Tror den delen ksk inte funkar helt.
        });
        if (slides.length > 0) slides[slideIndex - 1].style.display = "flex"; // Gör den sliden som ska vissas synnlig genom att förvandla den till flex.
        if (dots.length > 0) dots[slideIndex - 1].className += " active";
    }, [slideIndex]); // Slide index som dependenice

    return (
        <div className={styles["main-div"]}>
            <div className={styles["horizontal-container-one"]}>
                <div className={styles["vertical-container-one"]} style={{marginBottom: "1%"}}>
                    {/*Slideshow tagen från w3schools*/}
                    <div className={styles["slideshow-container"]}>
                        <div className={styles["mySlides"]}>
                            <div className={styles["numbertext"]}>1 / 3</div>
                            <img src={productObject.product.images[0]} height={400} className={styles["product-image"]} /> {/*Change to a photo of the product*/}
                        </div>

                        <div className={styles["mySlides"]}>
                            <div className={styles["numbertext"]}>2 / 3</div>
                            <img src={productObject.product.images[1]} height={400}  className={styles["product-image"]} /> {/*Change to a photo of the product*/}
                        </div>

                        <div className={styles["mySlides"]}>
                            <div className={styles["numbertext"]}>3 / 3</div>
                            <img src={productObject.product.images[2]} height={400} className={styles["product-image"]} /> {/*Change to a photo of the product*/}
                        </div>

                        <a className={styles["prev"]} onClick={() => changeSlide(-1)}>&#10094;</a>
                        <a className={styles["next"]} onClick={() => changeSlide(1)}>&#10095;</a>
                    </div>
                    <br/>


                    <div style={{textAlign:"center"}}>
                        <span className={styles["dot"]} onClick={() => setSlideIndex(1)}></span>
                        <span className={styles["dot"]} onClick={() => setSlideIndex(2)}></span>
                        <span className={styles["dot"]} onClick={() => setSlideIndex(3)}></span>
                    </div>
                </div>
                <div className={styles["vertical-container-two"]} style={{flexDirection: "row"}}>
                    <p className={styles["discription"]}>
                        {productObject.product.description}
                    </p>
                    <span className={styles["logo"]}>
                        <img src={getProductLogo(productObject.product.brand.toLowerCase())} alt="Item logo" width={150} height={150}/>
                    </span>
                </div>
            </div>
            <div className={styles["horizontal-container-two"]}>
                <div className={styles["vertical-container-two"]} style={{marginBottom: "1%"}}>
                    <div className={styles["highlight"]} style={{marginTop: 4}}>
                        <p style={{fontSize: "2rem", fontWeight: "600"}}>{(productObject.product.price - ((productObject.product.discountPercentage/100) *  productObject.product.price)).toFixed(0)}kr</p>
                    </div>
                    <div className={styles["highlight"]}>
                        <p style={{marginRight: 6}}>{productObject.product.rating}<i className="fa-solid fa-star"></i></p> <p style={{fontSize: "2rem"}}>/  </p> <p style={{marginLeft:6}}>5<i className="fa-solid fa-star"></i></p>
                    </div>
                    <button id="cart-button" className={styles["add-to-cart"]} onClick={() => addToCart({id: productObject.product.id,  name: productObject.title, price: (productObject.product.price - ((productObject.product.discountPercentage/100) *  productObject.product.price)).toFixed(0), quantity: 1})} style={{marginBottom: 4}}><i className="fa-solid fa-cart-shopping"></i> Add to shopping cart</button>
                </div>
                <div className={styles["vertical-container-one"]}>
                    <table style={{marginTop: "1%"}}>
                        <div className={styles["headline-container"]}>
                            <h4 className={styles["headline-one"]}>Demensions</h4>
                        </div>
                        <div className={styles["info-container"]}>
                            <tr >
                                <th className={styles["border-cell"]}>Width</th>
                                <th className={styles["border-cell"]}>Height</th>
                                <th className={styles["border-cell"]} style={{borderBottomLeftRadius: 8}}>Depth</th>
                            </tr>
                            <tr>
                                <td className={styles["border-cell"]}>{productObject.product.dimensions.width}cm</td>
                                <td className={styles["border-cell"]}>{productObject.product.dimensions.height}cm</td>
                                <td className={styles["border-cell"]} style={{ borderBottomRightRadius: 8}}>{productObject.product.dimensions.depth}cm</td>
                            </tr>
                        </div>
                    </table>
                    <table className={styles["reviews-table"]}>
                        <div className={styles["headline-container"]}>
                            <h4 className={styles["headline-one"]}>Reviews</h4>
                        </div>
                        <div className={styles["info-container-two"]}>
                            <tr>
                                <td className={styles["border-cell-two"]} >{productObject.product.reviews[0].comment}</td>
                                <td className={styles["border-cell-two"]} >{productObject.product.reviews[1].comment}</td>
                                <td className={styles["border-cell-two"]} style={{ borderBottomRightRadius: 8, borderBottomLeftRadius: 8}}>{productObject.product.reviews[2].comment}</td>
                            </tr>
                        </div>
                    </table>
                </div>
            </div>
        </div>
    );
}


ProductInfo.propTypes = {
    addToCart: PropTypes.func.isRequired,
};

export default ProductInfo;