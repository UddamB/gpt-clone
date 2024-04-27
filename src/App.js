import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { sendMsgToOpenAI } from './openai';
import { useEffect, useState, useRef } from 'react';

function App() {
  // Declaring msgEnd without triggering a re-render (used for detecting the last message for auto-scroll)
  const msgEnd = useRef(null);

  // Creating a usestate hook for updating user message input
  const [input, setInput] = useState("");

  // Creating usestate hook for updating GPT's message output, stored in array
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am ChatGPT, a state-of-the-art language model developed by OpenAI. I am designed to understand and generate human-like text based on the input I receive. You can ask me questions, have conversations, seek information, or even request assistance with various tasks. Just let me know how I can help you!",
      isBot: true, 
    }
  ]);

  // When the messages are updated, the scroll wheel auto-scrolls down
  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  // Creating arrow function for api message sending
  const handleSend = async () => {
    // Clearing input message after message is sent
    const text = input;
    setInput('');
    setMessages([
      ...messages,
      { text, isBot: false }
    ])
    // Setting all messages generated to date, appending them to a new response based on user or GPT
    const res = await sendMsgToOpenAI(text);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true }
    ]);
  }

  // Every time enter key is pressed, api message is sent and output is displayed
  const handleEnter = async (e) => {
    if(e.key==='Enter') await handleSend();
  }

  // Every time the left side-bar buttons are clicked, input is sent to api and output is displayed
  const handleQuery = async (e) => {
    // Clearing input message after message is sent
    const text = e.target.value;
    setMessages([
      ...messages,
      { text, isBot: false }
    ])
    // Setting all messages generated to date, appending them to a new response based on user or GPT
    const res = await sendMsgToOpenAI(text);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true }
    ]);
  }

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          {/* Displaying GPT & logo on the top */}
          <div className="upperSideTop"><img src={gptLogo} alt="Logo" className="logo" /><span className="brand">ChatGPT</span></div>
          {/* Displaying New Chat button */}
          <button className="midBtn" onClick={() => {window.location.reload()}}><img src={addBtn} alt="new chat" className="addBtn" />New Chat</button>
          <div className="upperSideBottom">
            {/* Displaying template prompts with message logo */}
            <button className="query" onClick={handleQuery} value={"What is Programming?"}><img src={msgIcon} alt="Query" />What is Programming? </button>
            <button className="query" onClick={handleQuery} value={"How to use an API?"}><img src={msgIcon} alt="Query" />How to use an API? </button>
          </div>
          {/* Referencing github link for github button */}
          <div class="social-icons">
            <a href="https://github.com/UddamB"><i class="fa fa-github"></i></a>
            <p>By Uddam Bhathal</p>   
          </div>
        </div>
        <div className="lowerSide">
          {/* Displaying different logos for home, saved, and upgrade option */}
          <div className="listItems"><img src={home} alt="Home" className="listItemsImg" />Home</div>
          <div className="listItems"><img src={saved} alt="Saved" className="listItemsImg" />Saved</div>
          <div className="listItems"><img src={rocket} alt="Rocket" className="listItemsImg" />Upgrade to Pro</div>
        </div>
      </div>
      <div className="main">
        <div className="chats">
          {/* Mapping messages and checking if the message is from GPT or User */}
          {messages.map((message, i) => 
            <div key={i} className={message.isBot?"chat bot":"chat"}>
            {/* Displaying ChatGPT logo with message and api output to front-end */}
              <img className='chatImg' src={message.isBot?gptImgLogo:userIcon} alt="ChatGPT" /><p className="txt">{ message.text }</p>
            </div>
          )}
          {/* After every message sent, this indicates the last message sent for auto-scroll */}
          <div ref={msgEnd}/>
        </div>
        <div className="chatFooter">
          <div className="inp">
            {/* Displaying prompt query text box and message icon, updating input from api, handling 'Enter' key press, */}
            <input type="text" placeholder='Send a message' value={input} onKeyDown={handleEnter} onChange={(e)=>{setInput(e.target.value)}}/><button className="send" onClick={handleSend}><img src={sendBtn} alt="Send" /></button>
            </div>
            <p>ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT April 2024 Version.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
