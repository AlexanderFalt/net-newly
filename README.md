> [!WARNING]
> OBS! For running the chatbot you need to install the program locally can’t run it by hosting through github. If you do not want to do that i have included a video of me using that chatbot

This project was made using ollama to run llama3 locally and use it as a chatbot. Llama3 is around 5GB and is not really the fastest on low-end computers. In the web worker script there is a timeout for 12 seconds when constructing the chunks, if that time out is reached there will be an error message saying fetch is aborted.

# Link to video of me using the chatbot:
https://drive.google.com/file/d/1XAj9QQrKjMnexwqd7RmhW_D4BWbyfMbN/view?usp=sharing

# Linux setup
### Install Git if not installed
sudo apt-get install git 

### Clone the repository 
git clone https://github.com/AlexanderFalt/net-newly.git <br/> 
cd net-newly 

### Install Node.js and npm if not installed 
sudo apt-get install nodejs npm

### Install dependencies 
npm install langchain <br/>
npm install react-router-dom <br/> 
npm install @langchain/community 

### Install Ollama and pull the model 
sudo apt-get install ollama <br/>
sudo ollama pull llama3 <br/>
ollama start 

### Run the development server 
npm run dev 


# MacOS setup:
### Install Homebrew if not installed 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" 

### Install Git if not installed 
brew install git 

### Clone the repository 
git clone https://github.com/AlexanderFalt/net-newly.git <br/>
cd net-newly 

### Install Node.js and npm if not installed 
brew install node 

### Install dependencies 
npm install langchain <br/>
npm install react-router-dom <br/>
npm install @langchain/community 

### Install Ollama and pull the model 
brew install ollama <br/>
sudo ollama pull llama3 <br/>
ollama start 

### Run the development server 
npm run dev



# Windows setup:
### Install Git if not installed 
(Download and install from https://git-scm.com/ if necessary)

### Install Node.js and npm if not installed 
(Download and install from https://nodejs.org/ if necessary)

### Clone repo
git clone https://github.com/AlexanderFalt/net-newly.git <br/>
cd net-newly

### Installing ollama on windows can be a bit annoying if you have choco you can use that otherwise you can simply download it from there website, or just watch the video i have put in a link for.
(Choco install: choco install ollama) <br/>
(Ollama website: https://ollama.com/download/windows)

### Install dependencies 
npm install langchain <br/>
npm install react-router-dom <br/>
npm install @langchain/community 

### Run ollama
ollama pull llama3 <br/>
ollama start

### Run the development server
npm run dev
