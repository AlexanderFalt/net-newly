import { Ollama } from '@langchain/community/llms/ollama';

self.addEventListener('message', async (event) => {
    const { baseUrl, model, question, history, phoneList, computerList} = event.data;
    const AICall = async () => {
        const ollama = new Ollama({
            baseUrl,
            model,
        });

        const controller = new AbortController();
        let timer;

        const chatHistory = history;

        console.log(typeof chatHistory + " and this is its content: " + JSON.stringify(chatHistory));

        const formattedPrompt = formatPrompt(question, chatHistory, phoneList, computerList);

        try {
            console.log("Starting stream...");
            const stream = await ollama.stream(formattedPrompt, { signal: controller.signal });
            const chunks = [];

            timer = setTimeout(() => {
                console.log("Timeout reached, aborting stream...");
                controller.abort();
            }, 8000);

            for await (const chunk of stream) {
                if (controller.signal.aborted) {
                    console.log("Stream aborted by controller.");
                    break;
                }
                chunks.push(chunk);
            }

            const response = chunks.join("");
            console.log(response);

            // Include the AI's response in the chat history
            const aiResponseMessage = { sender: "AI", content: response, timestamp: new Date().getTime() };
            const updatedChatHistory = [...chatHistory, aiResponseMessage];

            // Create an object to be sent back containing the updated chat history
            const responseData = {
                output: response,
                previousMessages: updatedChatHistory, 
            }

            self.postMessage({ success: true, data: responseData });
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted by timeout');
            } else {
                console.error('Error during streaming:', error);
                self.postMessage({ success: false, error: error.message });
            }
        } finally {
            if (timer) {
                clearTimeout(timer);
            }
        }
    };

    await AICall();
});

function formatPrompt(question, chatHistory, pList, cList) {
    const exampleResponses = [
        "I'd be happy to help",
        "What are you looking for?",
        "The display on this phone is fantastic!",
        "The camera on this phone is not the best. Still usable but not super good.",
        "Have a nice day!",
    ];

    // Format the prompt manually, including the question and chat history
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

    console.log("THIS IS THE PROMPT(TEST):" + prompt)
    return prompt;
}

function exampleFluent(examples) {
    return examples.join("\n")
}

function formatChatHistory(chatHistory) {
    // Format the chat history as an array of objects with sender and content properties
    return chatHistory.map(message => ({ sender: message.sender, content: message.content }));
}