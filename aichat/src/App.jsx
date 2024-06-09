import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);

  async function generateAnswer() {
    const loadingMessage = { type: 'loading', content: 'Loading...' };
    setConversation([...conversation, { type: 'question', content: question }, loadingMessage]);
    setQuestion("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC-W5Qw_5PxPKT38uC5yIvCvDPi-Mmu9DE",
        method: "post",
        data: {
          contents: [
            { parts: [{ text: question }] },
          ],
        },
      });
      const answer = response.data.candidates[0].content.parts[0].text;
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation];
        updatedConversation.pop(); 
        return [...updatedConversation, { type: 'answer', content: answer }];
      });
    } catch (error) {
      setConversation((prevConversation) => {
        const updatedConversation = [...prevConversation];
        updatedConversation.pop(); 
        return [...updatedConversation, { type: 'error', content: 'Error generating answer' }];
      });
      console.error(error);
    }
  }

  return (
    <>
      <div className='container d-flex flex-column'>
        <h1>Chat Ai</h1>
        <div className='conversation'>
          {conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.type === 'loading' ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className='textarea'
        ></textarea>
        <button onClick={generateAnswer}>Generate</button>
      </div>
    </>
  );
}

export default App;
