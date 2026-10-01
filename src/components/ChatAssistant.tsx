import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    content:
      'Bonjour ! Je suis l’assistant virtuel officiel du Centre Auto JCR à Bastia.\n\nComment puis-je vous aider ? Je peux vous renseigner sur nos services, vous aider à décrire un bruit ou un voyant, ou préparer avec vous une demande de rendez-vous.',
    timestamp: 'À l’instant',
  },
];

const SUGGESTIONS = [
  'Quels sont vos horaires d’ouverture ?',
  'Je souhaite prendre un rendez-vous',
  'J’ai un voyant allumé sur mon tableau de bord',
  'Combien coûte une révision / vidange ?',
  'Où est situé le garage à Bastia ?',
];

interface ChatAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggleOpen = externalOnToggle || (() => setInternalIsOpen((prev) => !prev));

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('jcr_chat_messages_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Save conversation history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('jcr_chat_messages_v1', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le serveur.');
      }

      const data = await response.json();
      const reply = data.reply || 'Désolé, je n’ai pas pu traiter votre demande pour le moment.';

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'Une erreur temporaire est survenue. Pour toute urgence ou question, contactez directement l’atelier au 04 95 33 47 30.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Voulez-vous effacer l’historique de la conversation ?')) {
      setMessages(INITIAL_MESSAGES);
      sessionStorage.removeItem('jcr_chat_messages_v1');
    }
  };

  // Helper to format messages with markdown support (bold, links, phone buttons)
  const renderMessageContent = (content: string) => {
    // 1. Normalize markdown telephone links [04 95 33 47 30](tel:+33495334730) into simple text for uniform parsing
    let cleanText = content.replace(/\[([^\]]+)\]\((tel:[^)]+)\)/g, '$1');

    // Split paragraphs by double newlines
    const paragraphs = cleanText.split('\n');

    return paragraphs.map((paragraph, pIdx) => {
      if (!paragraph.trim()) {
        return <div key={pIdx} className="h-2" />;
      }

      // Check for bullet lists
      const isBullet = paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ');
      const textToParse = isBullet ? paragraph.trim().replace(/^[-•]\s*/, '') : paragraph;

      // Tokenize bold **text** and phone numbers
      const tokens = textToParse.split(/(\*\*[^*]+\*\*|04\s*95\s*33\s*47\s*30)/g);

      const parsedTokens = tokens.map((token, tIdx) => {
        if (!token) return null;

        // Phone number
        if (token.replace(/\s+/g, '') === '0495334730') {
          return (
            <a
              key={tIdx}
              href="tel:+33495334730"
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white text-white hover:text-black px-2 py-0.5 rounded font-mono text-[13px] font-medium transition-colors my-0.5"
              title="Appeler le Centre Auto JCR"
            >
              <span>📞</span>
              <span>04 95 33 47 30</span>
            </a>
          );
        }

        // Bold text
        if (token.startsWith('**') && token.endsWith('**')) {
          const boldInner = token.slice(2, -2);
          return <strong key={tIdx} className="font-semibold text-white">{boldInner}</strong>;
        }

        return <span key={tIdx}>{token}</span>;
      });

      if (isBullet) {
        return (
          <div key={pIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-white/50 text-[12px] leading-relaxed select-none">•</span>
            <div className="flex-1">{parsedTokens}</div>
          </div>
        );
      }

      return (
        <p key={pIdx} className="my-1.5 leading-relaxed">
          {parsedTokens}
        </p>
      );
    });
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON (Bottom-right) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={toggleOpen}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer border focus:outline-none ${
            isOpen
              ? 'bg-white text-black border-white'
              : 'bg-black/85 hover:bg-black text-white border-white/25 hover:border-white/50 hover:scale-[1.02]'
          }`}
          aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir l’assistant virtuel du Centre Auto JCR'}
        >
          {/* Avatar icon */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-[14px]">
            <span>✳︎</span>
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>

          <span
            className="text-[13px] sm:text-[14px] font-medium tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span>{isOpen ? 'Fermer l’assistant' : 'Assistant JCR'}</span>
            {!isOpen && (
              <span className="relative flex h-2 w-2 items-center justify-center" title="Connecté • En ligne">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
              </span>
            )}
          </span>
        </button>
      </div>

      {/* CHAT WINDOW / MODAL (Compact & streamlined) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Assistant virtuel Centre Auto JCR"
          className="fixed bottom-16 right-4 z-40 w-[calc(100vw-32px)] sm:w-[320px] max-w-[340px] h-[440px] max-h-[calc(100vh-90px)] bg-[#0d0f12] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {/* HEADER */}
          <div className="p-2.5 px-3.5 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[14px] select-none">
                ✳︎
              </div>
              <div>
                <h3
                  className="text-[13.5px] font-medium leading-tight text-white flex items-center gap-1.5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Assistant JCR
                  <span className="relative flex h-2 w-2 items-center justify-center" title="Connecté • En ligne">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                  </span>
                </h3>
                <p className="text-[11px] text-white/50">Atelier Bastia (Furiani)</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="text-white/40 hover:text-white p-1 rounded transition-colors text-[12px]"
                title="Effacer l’historique"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={toggleOpen}
                className="text-white/50 hover:text-white p-1 rounded transition-colors text-[16px] leading-none"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* QUICK DIRECT CALL BANNER FOR EMERGENCIES */}
          <div className="px-3.5 py-1.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-white/60">Urgence dépannage ?</span>
            <a
              href="tel:+33495334730"
              className="text-white underline underline-offset-2 hover:opacity-75 flex items-center gap-1 font-mono font-medium"
            >
              <span>📞</span>
              <span>04 95 33 47 30</span>
            </a>
          </div>

          {/* MESSAGES THREAD */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[13px]">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 whitespace-pre-wrap leading-relaxed ${
                      isUser
                        ? 'bg-white text-black font-normal rounded-tr-none shadow-md'
                        : 'bg-white/10 text-white/95 rounded-tl-none border border-white/10'
                    }`}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                  <span className="text-[10px] text-white/35 mt-0.5 px-1">{message.timestamp}</span>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-white/50 text-[12px] bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 w-fit rounded-tl-none">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="ml-1 text-[11px]">En cours…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS (Chips) */}
          <div className="px-3 py-1.5 border-t border-white/10 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                className="whitespace-nowrap bg-white/5 hover:bg-white/15 border border-white/15 rounded-full px-2.5 py-0.5 text-[11px] text-white/80 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-2.5 border-t border-white/10 bg-black/40 flex items-center gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message…"
              disabled={isLoading}
              className="flex-1 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-[13px] text-white placeholder:text-white/35 outline-none focus:border-white transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:hover:bg-white cursor-pointer flex-shrink-0"
              aria-label="Envoyer"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
