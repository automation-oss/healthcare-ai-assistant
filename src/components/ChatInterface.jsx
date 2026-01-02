import { useState, useRef, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import CategorySelector from './CategorySelector'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import EmailPromptModal from './EmailPromptModal'
import { generateAIResponse } from '../services/aiService'

function ChatInterface() {
  const { currentChatId, chats, addMessage, createChat, getCurrentChat, updateChat } = useChat()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [localMessages, setLocalMessages] = useState([])
  const currentChat = getCurrentChat()
  const messagesEndRef = useRef(null)
  const lastSyncedIdRef = useRef(currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages, isTyping])

  // Sync local messages with context ONLY when chat changes (switching chats)
  // This prevents race conditions where context update lags behind local state
  useEffect(() => {
    // Only sync if the chat ID has actually changed
    if (currentChatId !== lastSyncedIdRef.current) {
      console.log('ChatInterface: Chat changed, syncing from context', currentChatId)
      if (currentChat) {
        setLocalMessages(currentChat.messages || [])
      } else {
        setLocalMessages([])
      }
      lastSyncedIdRef.current = currentChatId
    }
  }, [currentChatId, currentChat])

  useEffect(() => {
    if (currentChat) {
      setSelectedCategory(currentChat.category)
      // Count user messages in current chat
      const userMessages = currentChat.messages?.filter(m => m.role === 'user') || []
      setQuestionCount(userMessages.length)
    } else {
      setSelectedCategory(null)
      setQuestionCount(0)
    }
  }, [currentChatId]) // Depend on ID to reset counts when switching

  const handleCategorySelect = (category) => {
    const chatId = createChat(category)
    setSelectedCategory(category)
    setQuestionCount(0)
  }

  const handleEmailSubmit = (email) => {
    // Email has been submitted, reset question count
    setQuestionCount(0)
  }

  const handleSendMessage = async (content) => {
    // Check if user needs to provide email (after 2 questions and not logged in)
    const newQuestionCount = questionCount + 1
    if (newQuestionCount > 2 && !user && !localStorage.getItem('user_email')) {
      setShowEmailPrompt(true)
      return
    }

    let chatId = currentChatId
    let chatCategory = selectedCategory || 'General Healthcare Knowledge'

    if (!currentChatId || currentChat?.isDemo) {
      // If no chat exists or it's a demo chat, create a new one
      chatId = createChat(chatCategory)
      chatCategory = selectedCategory || 'General Healthcare Knowledge'
    } else {
      chatCategory = currentChat?.category || 'General Healthcare Knowledge'
    }

    // Create user message object
    const userMessage = { role: 'user', content }

    // 1. Update local state IMMEDIATELY for UI feedback
    setLocalMessages(prev => [...prev, userMessage])

    // 2. Persist to context/storage
    addMessage(chatId, userMessage)

    setQuestionCount(newQuestionCount)
    setIsTyping(true)

    try {
      // Build history from local state to ensure we have the latest
      // We use the functional update pattern's previous state concept conceptually here
      // but since we just updated it, we can construct it manually
      const history = [...localMessages, userMessage]

      const aiResponse = await generateAIResponse(content, chatCategory, history)

      // Add assistant message with source URL if available
      const messageData = {
        role: 'assistant',
        content: aiResponse.text,
        sourceUrl: aiResponse.sourceUrl,
        additionalUrls: aiResponse.additionalUrls
      }

      // 3. Update local state with AI response
      setLocalMessages(prev => [...prev, messageData])

      // 4. Persist to context/storage
      addMessage(chatId, messageData)
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again."
      }
      setLocalMessages(prev => [...prev, errorMessage])
      addMessage(chatId, errorMessage)
    } finally {
      setIsTyping(false)
    }
  }

  // Show category selector if no category selected or no chat
  if (!selectedCategory && !currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <CategorySelector onSelect={handleCategorySelect} />
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <MessageList
            messages={localMessages}
            isTyping={isTyping}
          />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>
      {showEmailPrompt && (
        <EmailPromptModal
          onClose={() => setShowEmailPrompt(false)}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
    </>
  )
}

export default ChatInterface
