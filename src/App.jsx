import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Chat from "./components/ChatBot.jsx";
import NavBar from "./components/navBar.jsx";
import Products from "./components/Products.jsx";
import SlideShow from "./components/slideShow.jsx";
import SearchBar from "./components/searchBar.jsx";
import SendIn from './components/sendIn.jsx';
import Product from './components/singleProduct.jsx';
import ContactUs from './components/contactUs.jsx';
import CheckOut from './components/checkOut.jsx';
import ProductInfo from "./components/productInfo.jsx";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartSize, setCartSize] = useState(0);
  useEffect(() => {
    const colors = [
      "#FF4466", "#84DE02", "#391285", "#6F2DA8", "#DA2647", "#3F26BF", "#DA2C43",
      "#6CDAE7", "#00CCCC", "#00CC99", "#E936A7", "#0048BA", "#AFE313", "#E77200",
      "#CCFF00", "#7070CC",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundImage = `linear-gradient(black 50%, ${randomColor})`;
    document.getElementById("secondeDiv").style.backgroundImage = `linear-gradient(${randomColor}, black 45%)`;

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []); 

  // Define addToCart using useCallback to ensure it doesn't change on every render
  const addToCart = useCallback((productToAdd) => {
    setCart(currentCart => {
        // Check if the cart already contains the product based on id (not productId)
        const isProductInCart = currentCart.some(item => item.id === productToAdd.id);
        
        // If the product is not in the cart, add it
        if (!isProductInCart) {
            return [...currentCart, productToAdd];
        } else {
            // If it is in the cart, return the cart unchanged
            return currentCart;
        }
      });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  }, []);

  useEffect(() => {
    setCartSize(cart.length)
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      const smartphonesResponse = await fetch('https://dummyjson.com/products/category/smartphones');
      const smartphonesData = await smartphonesResponse.json();

      const laptopsResponse = await fetch('https://dummyjson.com/products/category/laptops');
      const laptopsData = await laptopsResponse.json();

      const smartphonesList = smartphonesData.products.map(product => (
        <Product 
            key={product.id}
            productId={product.id}
            originalPrice={product.price}
            discount={product.discountPercentage}
            productName={product.title}
            brand={product.brand}
            productObject={product}
            addToCart={() => addToCart(product)} // Pass addToCart function
        />
      ));

      const computersList = laptopsData.products.map(product => (
        <Product 
            key={product.id}
            productId={product.id}
            originalPrice={product.price}
            discount={product.discountPercentage}
            productName={product.title}
            brand={product.brand}
            productObject={product} // Should just change in the single product to just use this but lets do like this for now.
            addToCart={() => addToCart(product)} // Pass addToCart function
        />
      ));

      setProducts([...smartphonesList, ...computersList]);
    };

    fetchProducts();
  }, [addToCart]); // Depend on addToCart, which is now stable due to useCallback

  const [searchIsPressed, setSearchIsPressed] = useState(true);
  const [navIsPressed, setNavIsPressed] = useState(true);

  const toggleSearch = () => {
      setSearchIsPressed(!searchIsPressed);
  }
    
  const toggleNav = () => {
      setNavIsPressed(!navIsPressed);
  }

   return (
      <BrowserRouter>
        <Header toggleNav={toggleNav} toggleSearch={toggleSearch} />
        {searchIsPressed && <SearchBar products={products} />}
        {navIsPressed && <NavBar numberOfItems={cartSize}/>}
        <Routes>
          <Route path="/" element={<SlideShow />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/chat" element={<Chat products={products} addToCart={addToCart}/>} />
          <Route path="/send-in" element={<SendIn />} />
          <Route path="/checkout" element={<CheckOut products={products} cart={cart} removeFromCart={removeFromCart}/>} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/product-information" element={<ProductInfo addToCart={addToCart}/>} />
        </Routes>
      <div className="background-container first-color"></div>
      <div className="background-container second-color" id="secondeDiv"></div>
      </BrowserRouter>
  )
}

export default App
