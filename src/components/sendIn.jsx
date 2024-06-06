import { useState } from 'react';
import styles from '../styles/sendIn.module.css';

function SendIn() {
    const [currentRadioValue, setCurrentRadioValue] = useState('');

    function getClassName(value) {
        return currentRadioValue === value ? styles['radio-title-in-focus'] : styles['radio-title'];
    }

    function statusChange(e) {
        setCurrentRadioValue(e.target.value);
    }

    return (
        <main>
            <div className={styles["send-in"]}>
                <form action="" className={styles['form-send-in']}>
                    <h4> Category: </h4>
                    <div className={styles["radio-container"]}>
                        <label htmlFor="laptop" className={styles['radio-button-single-container']} style={{marginRight: "0.25%"}}>
                            <h4 className={getClassName('Laptop')}>Laptop</h4>
                            <input id="laptop" value="Laptop" type="radio" name="Category" className={styles["radio-button"]} checked={currentRadioValue === 'Laptop'} onChange={statusChange}/>
                        </label>
                        <label htmlFor="phone" className={styles['radio-button-single-container']} style={{marginLeft: "0.25%"}}>
                            <h4 className={getClassName('Phone')}>Phone</h4>
                            <input id="phone" value="Phone" type="radio" name="Category" className={styles["radio-button"]} checked={currentRadioValue === 'Phone'} onChange={statusChange}/>
                        </label>
                    </div>
                    <h4>Brand:</h4>
                    <input type="text" id="brand" name="brand" className={styles["text-input"]}/>
                    <h4>Model:</h4>
                    <input type="text" id="model" name="model" className={styles["text-input"]}/>
                    <h4>Year of purchase:</h4>
                    <input type="date" id="YoP" name="YoP" className={styles["date-input"]}/>
                    <h4>What price are you looking for:</h4>
                    <input type="number" id="Price" name="Price" className={styles["price-input"]}/>
                    <h4>What are the damages on this device:</h4>
                    <input type="text" id="description" name="description" className={styles["text-input"]}/>
                    <h4>Import some pictures of the item:</h4>
                    <input type="file" id="pictures" name="pictures" className={styles["picture-input"]} accept="image/*"/>
                    <input type="submit" className={styles["submit-button"]}/>
                </form>
            </div>
        </main>
    );
}

export default SendIn;