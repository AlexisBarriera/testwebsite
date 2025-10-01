import React, { useState, useRef, useEffect } from 'react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de contabilidad. ¿Cómo puedo ayudarte hoy? Puedo ayudarte a encontrar el servicio perfecto para tus necesidades financieras.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Eres un asistente virtual experto en contabilidad que trabaja para una firma de servicios contables en Puerto Rico. Tu trabajo es ayudar a los clientes a entender qué servicio necesitan basándote en sus preguntas o problemas.

Los servicios disponibles son:
1. Preparación de Impuestos - Para declaraciones de impuestos personales y empresariales
2. Contabilidad (Bookkeeping) - Mantenimiento de registros financieros diarios
3. Planificación Financiera - Estrategias para el futuro financiero
4. Consultoría Empresarial - Asesoría para negocios y decisiones empresariales
5. Servicios de Auditoría - Revisión y verificación de registros financieros
6. Servicios de Nómina (Payroll) - Procesamiento de nómina y cumplimiento

IMPORTANTE:
- Responde SIEMPRE en español
- Sé amable, profesional y conciso
- Haz preguntas de seguimiento si necesitas más información
- Recomienda el servicio específico que mejor se ajuste a su necesidad
- Si no estás seguro, sugiere una consulta para discutir en detalle
- Mantén las respuestas breves (2-3 oraciones máximo)
- Al final de tu respuesta, si has identificado un servicio específico, menciona: "Te recomiendo nuestro servicio de [NOMBRE DEL SERVICIO]"

Pregunta del cliente: ${userMessage}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error calling Claude API:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error procesando tu mensaje. Por favor, intenta de nuevo o contáctanos directamente.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <style>{`
        .chat-widget-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          font-family: 'Lato', sans-serif;
        }

        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #722f37, #8b4049);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(114, 47, 55, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-toggle-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(114, 47, 55, 0.5);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 550px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #722f37, #8b4049);
          color: white;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .chat-header-text h3 {
          font-size: 1rem;
          margin: 0;
          font-weight: 600;
        }

        .chat-header-text p {
          font-size: 0.75rem;
          margin: 0;
          opacity: 0.9;
          color: #d4a574;
        }

        .chat-close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .chat-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #faf8f5;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-message {
          display: flex;
          gap: 0.75rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .message-avatar.assistant {
          background: linear-gradient(135deg, #722f37, #8b4049);
          color: white;
        }

        .message-avatar.user {
          background: #d4a574;
          color: white;
        }

        .message-content {
          max-width: 70%;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .chat-message.assistant .message-content {
          background: white;
          color: #2c1810;
          border-bottom-left-radius: 4px;
        }

        .chat-message.user .message-content {
          background: linear-gradient(135deg, #722f37, #8b4049);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 0.875rem 1rem;
          background: white;
          border-radius: 12px;
          border-bottom-left-radius: 4px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #722f37;
          animation: typingAnimation 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-6px);
          }
        }

        .chat-input-container {
          padding: 1rem;
          background: white;
          border-top: 1px solid rgba(114, 47, 55, 0.1);
        }

        .chat-input-wrapper {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid rgba(114, 47, 55, 0.1);
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: 'Lato', sans-serif;
          resize: none;
          max-height: 100px;
          min-height: 40px;
        }

        .chat-input:focus {
          outline: none;
          border-color: #722f37;
        }

        .chat-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #722f37, #8b4049);
          border: none;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #d32f2f;
          color: white;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 2rem);
            height: calc(100vh - 120px);
            right: 1rem;
            bottom: 80px;
          }

          .chat-widget-container {
            right: 1rem;
            bottom: 1rem;
          }
        }
      `}</style>

      <div className="chat-widget-container">
        {!isOpen && (
          <button 
            className="chat-toggle-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir chat"
          >
            💬
          </button>
        )}

        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-avatar">🤖</div>
                <div className="chat-header-text">
                  <h3>Asistente Virtual</h3>
                  <p>En línea ahora</p>
                </div>
              </div>
              <button 
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.role}`}>
                  <div className={`message-avatar ${message.role}`}>
                    {message.role === 'assistant' ? '🤖' : '👤'}
                  </div>
                  <div className="message-content">
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="chat-message assistant typing-indicator">
                  <div className="message-avatar assistant">🤖</div>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta aquí..."
                  rows={1}
                  disabled={isLoading}
                />
                <button 
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  aria-label="Enviar mensaje"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIChatWidget;
