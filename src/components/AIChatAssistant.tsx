import React, { useState, useEffect, useRef } from 'react';

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de servicios contables. ¿En qué puedo ayudarte hoy? Puedo ayudarte a identificar qué servicio necesitas según tu situación.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const services = {
    'preparación de impuestos': {
      keywords: ['impuestos', 'taxes', 'planilla', 'reembolso', 'irs', 'hacienda', 'w2', '1099', 'declaración', 'contribuciones', 'deducción', 'crédito contributivo'],
      response: 'Veo que necesitas ayuda con impuestos. Ofrecemos servicios completos de preparación de impuestos, incluyendo:\n\n• Planillas personales y corporativas\n• Maximización de deducciones y créditos\n• Representación ante Hacienda e IRS\n• Planillas enmendadas\n\n¿Te gustaría programar una consulta para discutir tu situación específica?',
      service: 'Preparación de Impuestos'
    },
    'contabilidad': {
      keywords: ['contabilidad', 'libros', 'registros', 'gastos', 'ingresos', 'balance', 'estados financieros', 'factura', 'cuentas por cobrar', 'cuentas por pagar'],
      response: 'Para mantener tus registros financieros al día, nuestro servicio de contabilidad es ideal. Manejamos:\n\n• Registro de transacciones diarias\n• Estados financieros mensuales\n• Conciliaciones bancarias\n• Reportes personalizados\n• Control de cuentas por cobrar y pagar\n\n¿Necesitas ayuda con la organización de tus libros contables?',
      service: 'Contabilidad'
    },
    'planificación financiera': {
      keywords: ['planificación', 'futuro', 'inversión', 'ahorro', 'retiro', 'metas financieras', 'presupuesto', 'patrimonio', '401k', 'ira'],
      response: 'La planificación financiera te ayudará a alcanzar tus metas. Creamos estrategias personalizadas para:\n\n• Planificación de retiro\n• Estrategias de inversión\n• Presupuesto familiar o empresarial\n• Protección de patrimonio\n• Planificación educativa\n\n¿Cuáles son tus principales metas financieras?',
      service: 'Planificación Financiera'
    },
    'consultoría empresarial': {
      keywords: ['negocio', 'empresa', 'corporación', 'llc', 'incorporar', 'estrategia', 'crecimiento', 'expansión', 'startup', 'emprender'],
      response: 'Para hacer crecer tu negocio, nuestra consultoría empresarial ofrece:\n\n• Estructura legal óptima (LLC, Corp, etc.)\n• Análisis de rentabilidad\n• Estrategias de crecimiento\n• Optimización de procesos\n• Planificación estratégica\n\n¿En qué etapa se encuentra tu negocio actualmente?',
      service: 'Consultoría Empresarial'
    },
    'auditoría': {
      keywords: ['auditoría', 'revisión', 'verificación', 'cumplimiento', 'regulaciones', 'control interno', 'fraude'],
      response: 'Nuestros servicios de auditoría aseguran:\n\n• Cumplimiento con regulaciones\n• Detección de irregularidades\n• Mejora de controles internos\n• Verificación de estados financieros\n• Prevención de fraude\n\n¿Qué tipo de auditoría necesita tu empresa?',
      service: 'Servicios de Auditoría'
    },
    'nómina': {
      keywords: ['nómina', 'payroll', 'empleados', 'salarios', 'pagos', 'quincena', 'seguro social', 'retenciones', 'choferil'],
      response: 'Simplifica la gestión de tu nómina. Manejamos:\n\n• Procesamiento quincenal/semanal\n• Cálculo de retenciones\n• Depósitos de Seguro Social\n• Formularios trimestrales\n• Certificaciones W-2 y 1099\n\n¿Cuántos empleados tienes actualmente?',
      service: 'Servicios de Nómina'
    }
  };

  const commonQuestions = [
    '¿Cuándo debo presentar mis impuestos?',
    '¿Qué documentos necesito para mi planilla?',
    '¿Cómo puedo ahorrar en impuestos?',
    '¿Necesito un contador para mi negocio pequeño?'
  ];

  const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/^(hola|hi|hello|buenos días|buenas tardes|saludos|hey|qué tal)/)) {
      return {
        response: '¡Hola! Bienvenido a Servicios Profesionales de Contabilidad. ¿Cómo puedo ayudarte hoy?\n\nPuedo asistirte con:\n• Identificar el servicio que necesitas\n• Responder preguntas sobre impuestos\n• Programar una consulta\n• Información de contacto',
        service: null,
        suggestions: commonQuestions
      };
    }

    // Check for thank you
    if (lowerMessage.match(/(gracias|thanks|thank you|agradezco)/)) {
      return {
        response: '¡De nada! Es un placer ayudarte. Si tienes más preguntas o necesitas programar una consulta, no dudes en preguntarme. Estamos aquí para ayudarte con todas tus necesidades contables.',
        service: null
      };
    }

    // Check for specific service requests
    for (const [key, value] of Object.entries(services)) {
      const hasKeyword = value.keywords.some(keyword => 
        lowerMessage.includes(keyword)
      );
      
      if (hasKeyword) {
        return {
          response: value.response,
          service: value.service,
          showBooking: true
        };
      }
    }

    // Check for when questions
    if (lowerMessage.includes('cuándo') || lowerMessage.includes('fecha límite')) {
      if (lowerMessage.includes('impuesto') || lowerMessage.includes('planilla')) {
        return {
          response: `📅 **Fechas Importantes de Impuestos en Puerto Rico:**\n\n• **15 de abril** - Fecha límite para planillas personales\n• **15 de marzo** - Corporaciones (mes natural)\n• **15° día del 4° mes** - Corporaciones (año fiscal)\n• **Pagos estimados** - Abril, Junio, Sept, Enero\n\n⚠️ Recomendamos comenzar el proceso con anticipación para evitar multas y maximizar deducciones.\n\n¿Necesitas ayuda con tu planilla?`,
          service: 'Preparación de Impuestos',
          showBooking: true
        };
      }
    }

    // Check for document questions
    if (lowerMessage.includes('documento') || lowerMessage.includes('qué necesito')) {
      return {
        response: `📋 **Documentos típicos necesarios:**\n\n**Para Planilla Personal:**\n• W-2 o 1099 (ingresos)\n• Gastos médicos\n• Intereses hipotecarios\n• Donativos\n• Gastos educativos\n\n**Para Negocio:**\n• Estados de cuenta bancarios\n• Facturas de gastos\n• Registro de ingresos\n• Recibos de compras\n\nCada situación es única. ¿Te gustaría una consulta personalizada?`,
        service: null,
        showBooking: true
      };
    }

    // Check for general help requests
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('servicios') || lowerMessage.includes('qué ofrecen')) {
      return {
        response: `Ofrecemos servicios profesionales completos:\n\n📊 **Preparación de Impuestos**\nPlanillas personales y corporativas\n\n📚 **Contabilidad**\nManejo de libros y registros financieros\n\n📈 **Planificación Financiera**\nEstrategias para tu futuro financiero\n\n🏢 **Consultoría Empresarial**\nCrecimiento y estrategia de negocio\n\n✅ **Auditoría**\nRevisión y cumplimiento regulatorio\n\n💰 **Nómina**\nGestión completa de empleados\n\n¿Cuál de estos servicios te interesa más?`,
        service: null,
        suggestions: ['Necesito ayuda con mis impuestos', 'Quiero organizar mi contabilidad', 'Tengo un negocio nuevo']
      };
    }

    // Check for pricing questions
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
      return {
        response: `💰 Nuestros precios varían según el servicio y la complejidad de tu situación.\n\n**Ofrecemos:**\n• Consulta inicial para evaluar tus necesidades\n• Precios competitivos y transparentes\n• Planes de pago disponibles\n• Paquetes personalizados para empresas\n\n¿Te gustaría programar una consulta gratuita para recibir un estimado personalizado?`,
        service: null,
        showBooking: true
      };
    }

    // Check for contact/appointment requests
    if (lowerMessage.includes('cita') || lowerMessage.includes('contacto') || lowerMessage.includes('llamar') || lowerMessage.includes('consulta')) {
      return {
        response: `¡Perfecto! Puedes contactarnos de varias formas:\n\n📞 **Teléfono:** +1 (939) 608-3732\n📧 **Email:** shaddaietp@gmail.com\n📍 **Oficina:** 29 C. Cristina, Ponce, PR 00730\n\n**Horario:**\n• Lunes - Viernes: 8:30 AM - 5:00 PM\n• Sábado (solo PHP): 10:00 AM - 1:00 PM\n\nTambién puedes programar una cita directamente en nuestra página.`,
        service: null,
        showContact: true,
        showBooking: true
      };
    }

    // Check for location questions
    if (lowerMessage.includes('dónde') || lowerMessage.includes('ubicación') || lowerMessage.includes('dirección')) {
      return {
        response: `📍 **Nuestra Oficina:**\n\n29 C. Cristina\nPonce, Puerto Rico 00730\n\n**Cerca de:** [Punto de referencia]\n\nOfrecemos:\n• Estacionamiento disponible\n• Acceso para personas con impedimentos\n• También servicios virtuales\n\n¿Prefieres una consulta presencial o virtual?`,
        service: null,
        showContact: true
      };
    }

    // Default response for unclear queries
    return {
      response: `Entiendo que necesitas ayuda. Para servirte mejor, ¿podrías especificar si necesitas ayuda con:\n\n• 📊 Impuestos o planillas\n• 📚 Organización de contabilidad\n• 💼 Tu negocio o empresa\n• 📈 Planificación financiera\n• 💰 Servicios de nómina\n\nO simplemente escribe tu pregunta específica y te ayudaré a encontrar la solución correcta.`,
      service: null,
      suggestions: commonQuestions
    };
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const analysis = analyzeMessage(currentInput);
      const assistantMessage = {
        role: 'assistant',
        content: analysis.response,
        service: analysis.service,
        showBooking: analysis.showBooking,
        showContact: analysis.showContact,
        suggestions: analysis.suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => handleSubmit(), 100);
  };

  const navigateToSection = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #722f37, #8b4049)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(114, 47, 55, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'}
      >
        {isOpen ? (
          <span style={{ color: 'white', fontSize: '24px' }}>✕</span>
        ) : (
          <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '380px',
          height: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          animation: 'slideUp 0.3s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #722f37, #8b4049)',
            borderRadius: '16px 16px 0 0',
            color: 'white',
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Asistente de Servicios Contables
            </h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
              En línea • Respuesta inmediata
            </p>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #722f37, #8b4049)'
                      : '#f5f0ea',
                    color: msg.role === 'user' ? 'white' : '#2c1810',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.content}
                  </div>
                </div>
                
                {/* Action Buttons */}
                {msg.showBooking && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigateToSection('booking')}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #722f37, #8b4049)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      📅 Programar Cita
                    </button>
                    <button
                      onClick={() => navigateToSection('contact')}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        color: '#722f37',
                        border: '2px solid #722f37',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      📞 Contactar
                    </button>
                  </div>
                )}
                
                {/* Suggestions */}
                {msg.suggestions && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '11px', color: '#6b5648', marginBottom: '8px' }}>
                      Preguntas sugeridas:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '6px 10px',
                            background: 'white',
                            color: '#722f37',
                            border: '1px solid #d4a574',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f0ea';
                            e.currentTarget.style.borderColor = '#722f37';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#d4a574';
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                display: 'flex',
                gap: '5px',
                padding: '12px 16px',
                background: '#f5f0ea',
                borderRadius: '12px',
                width: 'fit-content',
              }}>
                <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0s' }}>•</span>
                <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0.2s' }}>•</span>
                <span style={{ animation: 'bounce 1.4s infinite', animationDelay: '0.4s' }}>•</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e0e0e0',
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta aquí..."
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '25px',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'border 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#722f37'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #722f37, #8b4049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
        
        @media (max-width: 480px) {
          div[style*="width: 380px"] {
            width: calc(100vw - 40px) !important;
            right: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatAssistant;
