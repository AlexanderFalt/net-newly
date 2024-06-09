import { Ollama } from '@langchain/community/llms/ollama'; // Importerar ollama från langchain community

self.addEventListener('message', async (event) => { // Lyssnar efter messages från main threaden eller chatbot.jsx då när man kör postMessage körs koden här.
    const { baseUrl, model, question, history, phoneList, computerList} = event.data; // Förberder all nödvändiga aspekter för prompt templaten.
    const AICall = async () => { // Kallar AI:n
        const ollama = new Ollama({ // nytt ollama objekt med base url och model. Dom som vi skrev i postMessage
            baseUrl,
            model,
        });

        const controller = new AbortController(); // AbortController används för att avsluta requestet om det tar för lång tid.
        let timer;

        const chatHistory = history;

        const formattedPrompt = formatPrompt(question, chatHistory, phoneList, computerList); // Skapar prompt template. Vi tar och kollar på den för så vi får en bättre ide av vad som pågår här efter.

        try { // Om streamen tar för lång tid eller något annat error up kommer.
            console.log("Starting stream...");
            const stream = await ollama.stream(formattedPrompt, { signal: controller.signal }); // Startar en stream som sickar data del för del i form av chunks, type ett ord. 
            const chunks = [];

            timer = setTimeout(() => { 
                console.log("Timeout reached, aborting stream...");
                controller.abort(); // Om streamen är längre än 12s så abort signalen.
            }, 12000);

            for await (const chunk of stream) { // For await används för att kolla over asyncrona itrerbara objekten.
                if (controller.signal.aborted) {  
                    console.log("Stream aborted by controller.");
                    break;
                }
                chunks.push(chunk); //Lägger till varje chunk från streamen i en array.
            }

            const response = chunks.join(""); // Sätter samman chunksen till en string.
            console.log(response);

            const aiResponseMessage = { sender: "AI", content: response, timestamp: new Date().getTime() }; // Lägger till AI's repsonse i chat history tillsamans med timestamp som vi använder i komponenten.
            const updatedChatHistory = [...chatHistory, aiResponseMessage]; 

            // Create an object to be sent back containing the updated chat history
            const responseData = { 
                output: response,
                previousMessages: updatedChatHistory, 
            }

            self.postMessage({ success: true, data: responseData }); // Sickar tillbaka till chatbot.jsx
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted by timeout');
                self.postMessage({ success: false, error: "Fetch aborted by timeout" });
            } else {
                console.error('Error during streaming:', error);
                self.postMessage({ success: false, error: error.message });
            }
        } finally { // Nollställer timern
            if (timer) {
                clearTimeout(timer);
            }
        }
    };

    await AICall(); // Kör AIcall tills promise:et är resolved eller rejected.
});

function formatPrompt(question, chatHistory, pList, cList) {
   // Prompt templates är som det låter en mall för prompten. I detta fallet skulle det vara prompt.
   
    const exampleResponses = [
        "I'd be happy to help",
        "What are you looking for?",
        "The display on this phone is fantastic!",
        "The camera on this phone is not the best. Still usable but not super good.",
        "Have a nice day!",
    ];

    const prompt = `
    You should give advice and sell phones and latops from the inventory to the user. Llamas response has to follow {rules}. You don't have to roleplay. The users {question} is as bellow, the {phone inventory} and {laptop inventory} is as bellow. The {Chat history} is have conversation has looked so far. If {Chat history} is empty this is the start of the conversation.
    rules:
    - Provide tailored recommendations based on user preferences.
    - Keep responses concise and conversational, under 25 words (IMPORTANT).
    - Avoid lists. Present recommendations as part of a natural conversation (IMPORTANT).
    - If uncertain, prompt for clarification rather than providing generic responses.
    - Offer additional details about recommended phones upon request.
    - You can only recommend products's which are in the inventory (IMPORTANT).
    - You are not to change anything in the chat history whether it be add or remove(IMPORTANT).
    - You are to answer in proffesional manor do not use emoji's or stuff like *smile* (IMPORTANT).
    question: ${question}.
    Chat history: ${JSON.stringify(formatChatHistory(chatHistory))}.
    exampels: ${exampleFluent(exampleResponses)}.
    phone inventory: ${pList}.
    laptop inventory: ${cList}.
    `;
    // Det är 50/50 om den lyssnar på mitt ruleset den har ändå relativit bra koll på hur dens svar ska se ut.

    return prompt;
}

function exampleFluent(examples) {
    return examples.join("\n") // De olika exempel för hur ett svar ska se ut.
}

function formatChatHistory(chatHistory) {
    // Formatera så att det är en array av objekt med message sender så AI/user och content det vill säga det de sagt. Om jag inte gör detta så blir det [obejct object]
    return chatHistory.map(message => ({ sender: message.sender, content: message.content }));
}