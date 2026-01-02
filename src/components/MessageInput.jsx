import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, Image as ImageIcon } from 'lucide-react'

function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-muted/30 border border-input rounded-[28px] p-2 pl-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-sm hover:shadow-md"
      >
        {/* Action Buttons */}
        <div className="flex gap-1 pb-1.5">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            title="Upload image"
          >
            <ImageIcon size={20} />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please wait..." : "Message MediAssist AI..."}
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3.5 max-h-[150px] min-h-[24px] text-base outline-none text-foreground placeholder:text-muted-foreground/70"
          rows={1}
        />

        {/* Send/Mic Button */}
        <div className="pb-1.5 pr-1">
          {input.trim() ? (
            <button
              type="submit"
              disabled={disabled}
              className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              className="p-2.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-colors"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </form>

      <div className="text-center mt-2">
        <p className="text-[10px] text-muted-foreground">
          MediAssist AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}

export default MessageInput
