'use client';
// N01 — AI chatbot widget powered by Claude API

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function MkChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I am unable to respond right now. Please call us or visit any branch.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <>
      <style>{`
        @keyframes mkChatTyping {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .mk-chat-typing { animation: mkChatTyping 1.2s ease-in-out infinite; }
        .mk-chat-panel  { transition: transform 380ms cubic-bezier(0.4,0,0.2,1), opacity 380ms ease; }
      `}</style>

      {/* Trigger — visible only when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '1.5rem',
            zIndex: 300,
            background: 'rgba(59,24,72,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(223,193,96,0.22)',
            borderRadius: '9999px',
            padding: '0.6rem 1.1rem',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'var(--t-sm)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.72)',
            cursor: 'pointer',
            transition: 'border-color 220ms ease, color 220ms ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = 'rgba(223,193,96,0.5)';
            el.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = 'rgba(223,193,96,0.22)';
            el.style.color = 'rgba(255,255,255,0.72)';
          }}
        >
          Have a question?
        </button>
      )}

      {/* Chat panel — slides up from bottom-left */}
      <div
        role="dialog"
        aria-label="MK Gold chat assistant"
        aria-modal="true"
        aria-hidden={!isOpen}
        className="mk-chat-panel"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 350,
          width: 'min(360px, 100vw)',
          maxHeight: '78vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          boxShadow: '4px 0 40px rgba(28,10,36,0.22)',
          borderTopRightRadius: '16px',
          transform: isOpen ? 'translateY(0)' : 'translateY(110%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--plum-deep)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopRightRadius: '16px',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              aria-label="MK Gold"
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: '1.1rem',
                lineHeight: 1,
                letterSpacing: '0.04em',
                color: '#DFC160',
              }}
            >
              MK{' '}
              <span style={{ color: '#ffffff', letterSpacing: '0.06em' }}>
                GOLD
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-xs)',
                color: 'rgba(255,255,255,0.58)',
                margin: '0.2rem 0 0',
              }}
            >
              Ask us anything
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1.5rem',
              lineHeight: 1,
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              fontFamily: 'Poppins, sans-serif',
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                'rgba(255,255,255,0.55)';
            }}
          >
            ×
          </button>
        </div>

        {/* Messages area */}
        <div
          aria-live="polite"
          aria-relevant="additions"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            background: '#F8F7F8',
            minHeight: '200px',
          }}
        >
          {messages.length === 0 && (
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-xs)',
                color: 'var(--mist)',
                textAlign: 'center',
                marginTop: '2rem',
                lineHeight: 1.6,
              }}
            >
              Ask about gold rates, selling process,
              <br />
              or finding a branch near you.
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent:
                  msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '82%',
                  padding: '0.6rem 0.875rem',
                  borderRadius:
                    msg.role === 'user'
                      ? '12px 12px 2px 12px'
                      : '12px 12px 12px 2px',
                  background:
                    msg.role === 'user' ? 'var(--gold)' : '#ffffff',
                  color:
                    msg.role === 'user' ? 'var(--plum)' : 'var(--ink)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  lineHeight: 1.55,
                  boxShadow: '0 1px 4px rgba(28,10,36,0.07)',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '0.6rem 0.875rem',
                  borderRadius: '12px 12px 12px 2px',
                  background: '#ffffff',
                  boxShadow: '0 1px 4px rgba(28,10,36,0.07)',
                }}
              >
                <span
                  className="mk-chat-typing"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--mist)',
                  }}
                >
                  Typing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input row */}
        <div
          style={{
            padding: '0.875rem 1rem',
            display: 'flex',
            gap: '0.5rem',
            borderTop: '1px solid var(--gallery-dk)',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <input
            className="mk-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            aria-label="Chat message"
            disabled={isLoading}
            style={{ flex: 1, fontSize: 'var(--t-sm)' }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: 'var(--t-sm)',
              padding: '0 1rem',
              height: '100%',
              borderRadius: '9999px',
              background: canSend ? 'var(--gold)' : 'rgba(223,193,96,0.38)',
              color: 'var(--plum)',
              border: 'none',
              cursor: canSend ? 'pointer' : 'not-allowed',
              transition: 'background 200ms ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
