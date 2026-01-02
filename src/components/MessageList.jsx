import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, User, Edit2, Check, X, ExternalLink } from 'lucide-react'
import { useChat } from '../context/ChatContext'

function MessageList({ messages, isTyping, onEditSave }) {
  const { currentChatId, editMessage } = useChat()
  const [editingIndex, setEditingIndex] = useState(null)
  const [editContent, setEditContent] = useState('')

  const handleEditClick = (index, content) => {
    setEditingIndex(index)
    setEditContent(content)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditContent('')
  }

  const handleSaveEdit = (index) => {
    console.log('MessageList: handleSaveEdit called', index, editContent)
    if (editContent.trim()) {
      if (onEditSave) {
        console.log('MessageList: Calling onEditSave')
        onEditSave(index, editContent)
      } else {
        console.log('MessageList: onEditSave NOT defined, using fallback editMessage')
        editMessage(currentChatId, index, editContent)
      }
      setEditingIndex(null)
      setEditContent('')
    }
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bot size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to MediAssist AI</h3>
        <p className="max-w-md">
          I can help you with medical coding, RCM, billing questions, and more.
          Ask me anything to get started!
        </p>
      </div>
    )
  }

  // Debug logging
  console.log('MessageList rendering with messages:', messages)
  console.log('Total messages:', messages.length)
  messages.forEach((msg, idx) => {
    console.log(`Message ${idx}:`, msg.role, '-', msg.content.substring(0, 50))
  })

  // Check if messages are being filtered out
  const userMessages = messages.filter(m => m.role === 'user')
  const assistantMessages = messages.filter(m => m.role === 'assistant')
  console.log('User messages count:', userMessages.length)
  console.log('Assistant messages count:', assistantMessages.length)

  return (
    <div className="flex flex-col gap-6 p-4 pb-8">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-4 w-full ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-teal-600 text-white' // Google Gemini-ish teal for bot
              }`}
          >
            {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Content */}
          <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>

            {/* Name Label */}
            <span className="text-xs text-muted-foreground mb-1 px-1">
              {message.role === 'user' ? 'You' : 'MediAssist AI'}
            </span>

            {/* Bubble */}
            <div
              className={`relative group px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${message.role === 'user'
                ? 'bg-primary/10 text-foreground rounded-tr-sm' // Light primary bg for user
                : 'bg-card border border-border text-card-foreground rounded-tl-sm' // Card style for bot
                }`}
            >
              {editingIndex === index ? (
                <div className="flex flex-col gap-2 min-w-[300px]">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Source Links (Bot only) */}
            {message.role === 'assistant' && message.sourceUrl && (
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={message.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors border border-primary/10"
                >
                  <ExternalLink size={12} />
                  Source: {new URL(message.sourceUrl).hostname}
                </a>
                {message.additionalUrls?.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
                  >
                    [{i + 1}]
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex gap-4 w-full">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
            <Bot size={16} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground mb-1 px-1">MediAssist AI</span>
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
