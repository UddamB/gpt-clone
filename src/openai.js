import OpenAI from 'openai';
// import {REACT_APP_API_KEY} from './creds.jsx'

// Storing OpenAI API Key
const openai = new OpenAI({apiKey: process.env.REACT_APP_API_KEY, dangerouslyAllowBrowser: true});

// Handling messages sent to API with parameters like model and messages, returning API output
export async function sendMsgToOpenAI(message){
    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', 
        messages: [{"role": "user", 
                    "content": message}],   
    });
    return res.choices[0].message.content;   
}
