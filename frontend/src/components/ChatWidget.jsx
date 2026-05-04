import { useState } from 'react';
import { FaComments, FaTimes, FaWhatsapp } from 'react-icons/fa';
import './ChatWidget.css';

const WHATSAPP_NUMBER = '919039941589';

const ChatWidget = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [userName, setUserName] = useState('');

  const handleStartChat = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const message = encodeURIComponent(
      `🙏 Namaste Aacharya Jyoti!\n\nMy name is ${userName}. I would like to seek your guidance. Could you please help me?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsOpen(false);
    setUserName('');
  };

  return (
    <div className="chat-widget">
      {/* Toggle Button */}
      <button
        className={`chat-widget__toggle ${isOpen ? 'chat-widget__toggle--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Aacharya Jyoti on WhatsApp"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
        {!isOpen && <span className="chat-widget__badge">Chat</span>}
        <span className="chat-widget__status chat-widget__status--online" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-widget__panel">
          {/* Header */}
          <div className="chat-widget__header">
            <div className="chat-widget__header-info">
              <div className="chat-widget__avatar">🔮</div>
              <div>
                <h4>Aacharya Jyoti</h4>
                <p><span className="chat-dot-online" /> Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat"><FaTimes /></button>
          </div>

          {/* Body */}
          <div className="chat-widget__join">
            {/* Welcome message */}
            <div className="chat-widget__welcome-bubble">
              🙏 Namaste! I'm Aacharya Jyoti. Enter your name and I'll connect you with me on WhatsApp instantly!
            </div>

            <form onSubmit={handleStartChat}>
              <p>Enter your name to start chatting</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name..."
                required
                autoFocus
              />
              <button type="submit" className="btn chat-widget__wa-btn">
                <FaWhatsapp /> Start Chat on WhatsApp
              </button>
            </form>

            <p className="chat-widget__note">
              You'll be redirected to WhatsApp to chat directly with Aacharya Jyoti
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
