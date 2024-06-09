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

  // useCallback så att den inte behöver köras om på varje render.
  const addToCart = useCallback((productToAdd) => {
    setCart(currentCart => {
        // Kollar om cart redan innehåller producten så att man inte kan lägga till den flera gånger. Some kollar om det finns ett tillfälle med den i arrayen.
        const isProductInCart = currentCart.some(item => item.id === productToAdd.id);
        
        // Om produkten inte är i cart lägg till den,
        if (!isProductInCart) {
            return [...currentCart, productToAdd];
        } else {
            // Om den är där ändras inget.
            return currentCart;
        }
      });
  }, []);

  //Samma här.
  const removeFromCart = useCallback((productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId)); // Skapar en ny lista med all föremål så länge de inte matchar productId
  }, []);

  useEffect(() => {
    setCartSize(cart.length) // Cart length så att bubblan vid checkout vissar hur många producter det finns i carten.
  }, [cart]);

  useEffect(() => { // Hämtar produkter från dummyjson
    const fetchProducts = async () => { // Asynchron
      const smartphonesResponse = await fetch('https://dummyjson.com/products/category/smartphones'); // Vänta till's promise slutförs 
      console.log(smartphonesResponse)
      const smartphonesData = await smartphonesResponse.json(); //

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

      setProducts([...smartphonesList, ...computersList]); // setter products till samling av det jag får av dessa två.
    };

    fetchProducts();
  }, [addToCart]);

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
