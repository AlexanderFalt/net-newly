import { useState, useEffect } from 'react';
import styles from '../styles/chatbot.module.css';
import PropTypes from 'prop-types';
// Import link
import { Link } from 'react-router-dom';
// Importing the logos from the logos folder.
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

// Loader taken from here: https://www.youtube.com/watch?v=E01XdDQgzDM&ab_channel=DevtoolsTech
// Langchain taken from a multiple of places.
function Chat({ products, addToCart }) {
    const [inputContent, setInputContent] = useState(''); // state for input. That is then sent to webworker (AI script) as quesiton. 
    const [chatHistory, setChatHistory] = useState([]); // Takes and adds the input then the output to the list in the hook.
    const [worker, setWorker] = useState(null); // The worker is originally set to null, so the webworker is originally not running.
    const [isLoading, setIsLoading] = useState(false); // Indicating if the chat is wating for a response. Used so that the loader knows if its supposed to run.

    // useEffect to handle the lifecycle of the web worker.
    useEffect(() => {
        // Creating a new web worker instance from a module.
        const newWorker = new Worker(new URL('../webworker.js', import.meta.url), { type: 'module' });
        setWorker(newWorker); // Setting the worker in state.

        // Setting up a handler for messages received from the worker.
        newWorker.onmessage = (event) => {
            setIsLoading(false); // Turn off loading indicator on response.
            if (event.data.success) {
                const newOutputContent = event.data.data;
                setChatHistory(prevChatHistory => {
                    // Filtering to add only new messages based on timestamps.
                    const latestTimestamp = Math.max(...prevChatHistory.map(msg => msg.timestamp || 0));
                    const newMessages = newOutputContent.previousMessages.filter(msg => msg.timestamp > latestTimestamp);
                    return [...prevChatHistory, ...newMessages];
                });
            } else {
                // Handling any errors received from the worker.
                console.error('Error from worker:', event.data.error);
                setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "Error", content: "Error processing your request. Please try again." }]);
            }
        };

        // Cleanup function to terminate the worker when the component unmounts.
        return () => newWorker.terminate();
    }, []); // Empty dependency array means this effect runs only once on mount.

    // Handler for changes in the input field.
    const handleInputChange = (e) => {
        setInputContent(e.target.value);
    };

    //Make the lists to send to the AI (cant send functions)
    const makePhoneList = () => {
        const listToReturn = [];
        for (let i = 0; i < products.length; i++) {
            const item = products[i].props.productObject.title;
            if (products[i].props.productObject.category == "smartphones") {
                listToReturn.push(item);
            }
        }
        return listToReturn;
    }


    const makeComputerList = () => {
        const listToReturn = [];
        for (let i = 0; i < products.length; i++) {
            const item = products[i].props.productObject.title;
            if (products[i].props.productObject.category == "laptops") {
                listToReturn.push(item);
            }
        }
        return listToReturn;
    }

    // Handler for the send button click.
    const handleButtonClick = () => {
        if (worker) {
            const userMessage = { sender: "User", content: inputContent };
            const updatedChatHistory = [...chatHistory, userMessage]; // Directly use updated history
            setChatHistory(updatedChatHistory); // Update state
            worker.postMessage({
                baseUrl: "http://localhost:11434",
                model: "llama2",
                question: inputContent,
                history: updatedChatHistory,
                phoneList: makePhoneList(),
                computerList: makeComputerList(), // Cant send functions to webworker.
            });
            setInputContent(''); // Clearing the input field after sending.
            setIsLoading(true); // Set loading to true when a request is made.
        }
    };

    console.log("Rendering chat history:", chatHistory);

    const loader = () => {
        return <div className={styles["loader"]}>
            <div className={styles["dotLoader"]}></div>
            <div className={styles["dotLoader"]}></div>
            <div className={styles["dotLoader"]}></div>
        </div>
    }

    // What bubble to use.
    function getMessageStyle(sender) {
        switch (sender) {
            case 'User':
                return 'user-message';
            case 'Error':
                return 'error-message';
            default:
                return 'bot-message';
        }
    }

    //Check if product is in the response
    const productInResponse = (text) => {
        if (!text) return null;  // Return null if no text is provided
        text = text.content.toLowerCase();
        const foundProducts = products.filter(product => text.includes(product.props.productName.toLowerCase()));
        const getProductLogo = (lowerBrand) => {
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
        return foundProducts.map(product => (
            <div key={product.props.productName} className={`${styles['bubble-container']} ${styles["bot-message"]}`}>
                <div className={`${styles['bubble']}`}>
                    <p className={styles["product-title-chat"]}>{product.props.productName}</p>
                    <div className={styles["div-logo-disc"]}>
                        <p className={styles["product-disc-chat"]}>{product.props.productObject.description}</p>
                        <button className={styles["product-button-chat"]} onClick={() => addToCart({
                            id: product.props.productId, // Ensure product has an ID
                            name: product.props.productName,
                            price: product.props.newPrice,
                            quantity: 1  // Default quantity, adjust as necessary
                        })}>
                            <i className="fa-solid fa-cart-shopping"></i> Add
                        </button>
                        <Link to={"/product-information"} state={{ product: product.props.productObject }} className={styles["product-button-chat"]}><i className="fa-solid fa-arrow-right"></i>  More</Link>
                        <img src={getProductLogo(product.props.brand.toLowerCase())} alt="Display error" width={100} height={100} className={styles["product-logo-chat"]}/>
                    </div>
                </div>
            </div>
        ));
    };

    const lastIndex = chatHistory.length - 1;
    const lastMessage = chatHistory.length > 0 ? chatHistory[lastIndex] : null;

    // Rendering the chat interface.
    return (
        <main className={styles['chatbot-main']}>
            <div className={styles["output"]}>
                {/* Displaying the chat history. */}
                {chatHistory.map((message, index) => (
                    <div key={index} className={`${styles['bubble-container']} ${styles[getMessageStyle(message.sender)]}`}>
                        <div className={`${styles['bubble']}`}>
                            {message.content}
                        </div>     
                    </div>
                ))}
                {productInResponse(lastMessage)}
                {/* Conditionally display the loading bubble */}
                {isLoading && (
                    <div className={`${styles['bubble-container']} ${styles['bot-message']}`} style={{height: "15%", display:"flex", alignItems: "center", justifyContent: "center", marginTop: "4px"}}>
                        <div className={`${styles['bubble']}`}>
                            {loader()}
                        </div>
                    </div>
                )}
            </div>
            <div className={styles['button-container']}>
                <textarea 
                    cols="30" 
                    rows="10" 
                    className={styles["input"]} 
                    onChange={handleInputChange} 
                    value={inputContent}
                />
                <button className={styles["input-button"]} onClick={handleButtonClick}>
                    <i className="fa-solid fa-arrow-up fa-2xl"></i>
                </button>
            </div>
        </main>
    );
}


Chat.propTypes = {
    products: PropTypes.array.isRequired,
    addToCart: PropTypes.func.isRequired,
};

export default Chat;