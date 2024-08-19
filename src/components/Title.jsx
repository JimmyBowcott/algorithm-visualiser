import { useState, useEffect } from "react"

const Title = () => {
    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(true);
    const [index, setIndex] = useState(0);
    const fullText = 'title="Algorithm Visualiser"';

    useEffect(() => {
        let timeout
        const interval = setInterval(() => {
            if (isTyping) {
                if (index < fullText.length) {
                    setText((prev) => prev + fullText[index]);
                    setIndex(index + 1);
                } else {
                    clearInterval(interval);
                    timeout = setTimeout(() => setIsTyping(false), 3500);
                }
            } else {
                if (index > 0) {
                    setText((prev) => prev.slice(0, -1));
                    setIndex(index - 1);
                } else { 
                    clearInterval(interval);
                    timeout = setTimeout(() => setIsTyping(true), 1000);
                }
            }
        }, 100);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [index, isTyping]);

    return (
        <div className="flex justify-center m-4 mt-8">
            <span className="text-2xl sm:text-4xl text-orange-600">{text}</span><span className="text-2xl sm:text-4xl text-gray-300 animate-caret">|</span>
        </div>
    )
}

export default Title