import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaCircle } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '🙏 Namaste! How can Aacharya Jyoti help you today?', sender: 'Aacharya Jyoti', senderType: 'admin', timestamp: new Date().toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('typing:update', ({ isTyping: typing, name }) => {
      setIsTyping(typing);
    });

    return () => {
      socket.off('chat:message');
      socket.off('typing:update');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    socket?.emit('user:join', { name: userName });
    setHasJoined(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;
    socket.emit('chat:message', { text: inputText, sender: userName });
    socket.emit('typing:stop');
    setInputText('');
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    socket?.emit('typing:start', { name: userName });
    clearTimeout(window._typingTimer);
    window._typingTimer = setTimeout(() => socket?.emit('typing:stop'), 1500);
  };

  const fmt = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-widget">
      {/* Toggle Button */}
      <button className={`chat-widget__toggle ${isOpen ? 'chat-widget__toggle--open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaComments />}
        {!isOpen && <span className="chat-widget__badge">Chat</span>}
        <span className={`chat-widget__status ${isConnected ? 'chat-widget__status--online' : ''}`} />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-widget__panel">
          <div className="chat-widget__header">
            <div className="chat-widget__header-info">
              <div className="chat-widget__avatar">🔮</div>
              <div>
                <h4>Aacharya Jyoti</h4>
                <p>
                  <FaCircle className={isConnected ? 'online' : 'offline'} />
                  {isConnected ? ' Online' : ' Offline'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          {!hasJoined ? (
            <form className="chat-widget__join" onSubmit={handleJoin}>
              <p>Enter your name to start chatting</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name..."
                required
                autoFocus
              />
              <button type="submit" className="btn btn-primary">Start Chat</button>
            </form>
          ) : (
            <>
              <div className="chat-widget__messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-widget__msg chat-widget__msg--${msg.senderType}`}>
                    <div className="chat-widget__bubble">
                      <p>{msg.text}</p>
                      <span>{fmt(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-widget__msg chat-widget__msg--admin">
                    <div className="chat-widget__bubble chat-widget__typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-widget__input-area" onSubmit={handleSend}>
                <input
                  type="text"
                  value={inputText}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  autoFocus
                />
                <button type="submit" className="chat-widget__send" disabled={!inputText.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
