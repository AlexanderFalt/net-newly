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
        const newWorker = new Worker(new URL('../webworker.js', import.meta.url), { type: 'module' }); // Javascript module som kör att jag kan använda import/export. URL relativit till nuvarande filen. Detta är en webworker som tar bort arbets kraft från main threaden där olika operationer för till exempel animationer sker. Som gör processen att få ett svar snabbare.
        setWorker(newWorker); // Setting the worker in state. 
        newWorker.onmessage = (event) => { // When i get a response from the web worker/AI script.
            setIsLoading(false); // Turn off loading when you have gotten a response.
            if (event.data.success) { // If i succesfully have gotten the data run the rest.
                const newOutputContent = event.data.data; // In the object that is returend the there is a property named data. I want the data in that so: data.data.
                setChatHistory(prevChatHistory => { // Updating the chat history
                    // Lägg till nya medelande beroend på time stamps.
                    const latestTimestamp = Math.max(...prevChatHistory.map(msg => msg.timestamp || 0)); // Maximum time stamp in chat history. To get the latest one. If there is no timestamp it defaults to 0.
                    const newMessages = newOutputContent.previousMessages.filter(msg => msg.timestamp > latestTimestamp); // checks for new messages in the content i get back from the script these are determind by comparing to the latest current timestamp if msg is newser then add.
                    return [...prevChatHistory, ...newMessages]; // Adds to together the new messages to the old chat history.
                });
            } else { // If the event.data.sucess is false the create error.
                // Error handeling.
                console.error('Error from worker:', event.data.error);
                setChatHistory(prevChatHistory => [...prevChatHistory, { sender: "Error", content: "Error processing your request. Please try again." }]);
            }
        };

        return () => newWorker.terminate(); // When the ChatBot component is unmounted then terminate the webwokrer making things not as laggy.
    }, []); 

    // Updaterar input content baserat på när man skriver i text rutan använder on change i return delen.
    const handleInputChange = (e) => {
        setInputContent(e.target.value);
    };

    //Make the lists to send to the AI (cant send functions)
    const makePhoneList = () => {
        const listToReturn = []; // Skapar tom array att sicka tillbaka
        for (let i = 0; i < products.length; i++) { // Vanlig for loop.
            const item = products[i].props.productObject.title; // Titlen för föremålet
            if (products[i].props.productObject.category == "smartphones") { // If catagory is smartphoens add it
                listToReturn.push(item);
            }
        }
        return listToReturn;
    }

    // Same thing except laptops
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
        if (worker) { // Om workern har startat
            const userMessage = { sender: "User", content: inputContent }; // använder som object för att kunna för user/AI so att llama får en bättre ide om hur chat history ska see ut.
            const updatedChatHistory = [...chatHistory, userMessage]; // Updates the chat history to send to the web worker. Använder spread så all medlande i arrayen läggs til i den nya listan.
            setChatHistory(updatedChatHistory); // Lägger till som dens nya state.
            worker.postMessage({ // sickar datan till web workern via post message.
                baseUrl: "http://localhost:11434", // Localhost addressen som ollama körs på.
                model: "llama3", // Modellen är ollama tre som är typ 5gb och en av dom tyngre modellerna detta gör att det är svårt att köra på datorer med svagare CPU's 
                question: inputContent, // Frågan eller användarens prompt
                history: updatedChatHistory, // chat historyn är den updaterade chat historin
                phoneList: makePhoneList(), // Listan av telefonerna
                computerList: makeComputerList(), // Cant send functions to webworker. Listan av datorerna.
            });
            setInputContent(''); // Clearing the input field after sending. Noll ställer input content.
            setIsLoading(true); // Set loading to true when a request is made. Startar laddnings "animationen".
        }
    };

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
        text = text.content.toLowerCase(); // turning the text to lower case to make things more consistent
        const foundProducts = products.filter(product => text.includes(product.props.productName.toLowerCase())); // If there is a mention of a product in the text then show that product.
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
        return foundProducts.map(product => ( // Mapping ever product to a jsx element so it shows up in the chat box.
            <div key={product.props.productName} className={`${styles['bubble-container']} ${styles["bot-message"]}`}> {/*key or the unique identifier is the name of the product all the other stuff is simple html/jsx*/}
                <div className={`${styles['bubble']}`}>
                    <p className={styles["product-title-chat"]}>{product.props.productName}</p>
                    <div className={styles["div-logo-disc"]}>
                        <p className={styles["product-disc-chat"]}>{product.props.productObject.description}</p>
                        <button className={styles["product-button-chat"]} onClick={() => addToCart({ 
                            id: product.props.productId, // Ensure product has an ID
                            name: product.props.productName,
                            price: product.props.newPrice,
                            quantity: 1  // Default quantity, adjust as necessary
                            // Adds this objekt to the cart. Cart is in the app.jsx higher up in the hiarchy
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
    const lastMessage = chatHistory.length > 0 ? chatHistory[lastIndex] : null; // : null because chat history is empty when the component is mounted.

    // Rendering the chat interface.
    return (
        <main className={styles['chatbot-main']}>
            <div className={styles["output"]}>
                {/* Displaying the chat history */}
                {chatHistory.map((message, index) => ( // Mapping again for the chatHistory. The messages index is use as a key because its a static list basically never changes under the components mounting.
                    <div key={index} className={`${styles['bubble-container']} ${styles[getMessageStyle(message.sender)]}`}>
                        <div className={`${styles['bubble']}`}>
                            {message.content}
                        </div>     
                    </div>
                ))}
                {productInResponse(lastMessage)} {/*Checks if there is any product mentioned in the latest message*/}
                {/* Conditionally display the loading bubble */}
                {isLoading && ( // if the loading state is  true then do the loading animation.
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

// PropTypes
Chat.propTypes = {
    products: PropTypes.array.isRequired, // This prop is verified being an array
    addToCart: PropTypes.func.isRequired, // this prop is verified being a function
};

export default Chat;
