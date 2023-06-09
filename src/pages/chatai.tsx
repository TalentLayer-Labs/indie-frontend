import { event } from "nextjs-google-analytics";
import { useState } from "react";

enum Creator {
    Me = 0,
    Bot = 1
}

interface MessageProps {
    text:string;
    from: Creator;
    key: number;
}

interface InputProps {
 onSend: (input: string) => void;
 disable: boolean;
}

const ChatMessage = ({ text, from}: MessageProps) =>{
    return (
        <>
        {from == Creator.Me &&(
            <div className=" bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
                <p className=" text-gray-700"></p>
        </div>
        )}
        {from == Creator.Bot &&(
            <div className="bg-gray-100 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
                <p className="text-gray-700">{text}</p>
            </div>
        )}
        </>
    );
};

const ChatInput = ({ onSend, disable }: InputProps) => {
    const [input, setInput] = useState('');

    const sendInput = () => {
        onSend(input);
        setInput('');
    };

    const handleKeyDown = (event: any) => {
        if (event.keycode === 13){
            sendInput();
        }
    };

return(
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center">
        <input
            value={input}
            onChange={(ev: any) => setInput(ev.target.value)}
            className="w-full py-2 px-3 text-gray-800 rounded-lg focuse:outline-none"
            type="text"
            placeholder="Ask me anything"
            disabled={disable}
            onKeyDown={(ev) => handleKeyDown(ev)}
        
    />
    {disable && (
        <p>disabled</p>
)}
    {!disable &&(
        <button
        onClick={() => sendInput()}
        className="p-2 rounded-md text-gray-500 bottom-1.5 roght-1"
        >
        <p>send</p>

        </button>
    )}
    </div>
    );
};

export default function Home(){
    const[messages, setMessages] = useState<MessageProps[]>([]);
    const[loading, setLoading] = useState(false);

    const callApi = async (input: string) => {
        setLoading(true);

        const myMessage: MessageProps = {
            text:input,
            from: Creator.Me,
            key:new Date().getTime()
        };
        setMessages([...messages, myMessage]);
        const context = 'we are on a freelance platform, help me generated a proposal';
        const response = await fetch('/api/generate-answers',{
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: context + ' ' + input
            })
        }) .then ((response) => response.json());
        setLoading(false);

        if (response.text) {
            console.log('response.text', response.text)
            const botMessage: MessageProps = {
            text:response.text,
            from: Creator.Bot,
            key: new Date().getTime()
            };
            setMessages([...messages, botMessage]);
        }else{
            //Show error
        }
    };
    return(
        <main className="relative max-w-2xl mx-auto">
            <div className="sticky top-0 w-full pt-10 px-4">
                <ChatInput onSend={(input)=> callApi(input)} disable={loading} />
            </div>
        <div className="mt-10 px-4">
            {messages.map((msg:MessageProps) => (
                <ChatMessage key={msg.key} text={msg.text} from={msg.from}/>
            ))}
            {messages.length == 0 && <p className="text-center text-gray-400">I am at you service</p>}
        </div>
    </main>
    );
}
