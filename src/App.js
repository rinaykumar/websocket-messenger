import React from 'react';
import './App.css';

// Do this 1 time for entire app (in index.js usually)
const webSocket = new WebSocket('ws://localhost:4000');

function App() {
  const [userName, setUserName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([]);

  const handleLogIn = () => {
    const data = {
      userName,
      actionType: 'logIn',
    };
    webSocket.send(JSON.stringify(data)); // Send plain string
    setIsLoggedIn(true);
  };

  const handleSubmit = () => {
    console.log(message);
    const data = {
      userName,
      message,
      actionType: 'sendChatMessage',
    };
    webSocket.send(JSON.stringify(data)); // Send plain string
    setMessage('');
  }

  const handleWebSocketMessage = (rawData) => {
    console.log(rawData.data);
    const data = JSON.parse(rawData.data);
    switch(data.actionType) {
      case 'updateChatMessages':
        // Store chat messages
        setChatMessages(data.chatMessages);
        break;
      default:
    }
  }

  React.useEffect(() => {
    // When component mounts
    webSocket.addEventListener('message', handleWebSocketMessage);
  }, []);

  return (
    <div className="App">
      {!isLoggedIn && (
        <div>
          <input value={userName} onChange={e => setUserName(e.target.value)} />
          <button onClick={handleLogIn}>Log In</button>
        </div>
      )}
      {isLoggedIn && (
        <div>
          <h2>Welcome {userName}</h2>
          <textarea value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </div>    
      )}
      <div>
        <table>
          <tbody>
            {chatMessages.map(chatMessage => (
              <tr>
                <td>
                  {chatMessage.userName}
                </td>
                <td>
                  {chatMessage.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;
