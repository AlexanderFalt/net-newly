import styles from "../styles/slideShow.module.css";

function slideShow() {
    return(
        <main>
            <div id={styles["slideDiv"]}>
                <div>
                    <h1>Welcome!</h1>
                    <div>
                        <p style={{marginTop:'2%', marginBottom:'2%'}}>
                            Recycling electronics, including mobile phones, remains uncommon in today&apos;s society, which presents significant environmental and economic challenges. Electronic devices contain precious and rare metals such as gold, silver, and palladium. When these devices are not recycled, these valuable materials are lost, contributing to the depletion of finite natural resources. Recycling not only helps conserve these rare metals but also reduces the environmental impact of mining for new materials and decreases electronic waste, which can be harmful to ecosystems if not disposed of properly.
                        </p>
                        <p>
                            Our company streamlines the process of recycling and reselling old electronics, and we enhance the customer experience with a unique feature: an AI chat service. This AI is available to provide detailed information about each phone in our inventory. Customers can interact with the AI to ask questions about the specific features, history, and condition of the devices, making it easier to find exactly what they&apos;re looking for. This service ensures transparency and aids in making informed decisions, all while supporting environmental sustainability by promoting the reuse of electronics.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default slideShow;