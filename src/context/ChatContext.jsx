import { createContext, useContext, useState, useEffect } from 'react'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [viewingDemoChat, setViewingDemoChat] = useState(null)
  const [demoChats] = useState([
    {
      id: 'demo-1',
      title: 'ICD-10 Coding Question',
      category: 'Medical Coding',
      messages: [
        { role: 'user', content: 'What is the difference between Z codes and V codes in ICD-10?' },
        { role: 'assistant', content: 'Great question! In ICD-10-CM, Z codes (Z00-Z99) are used for encounters for circumstances other than a disease or injury, such as health status examinations, screening, and follow-up care. V codes were part of ICD-9-CM but have been largely replaced by Z codes in ICD-10. Z codes are essential for documenting factors influencing health status and contact with health services. For example, Z00.00 is used for a general health examination without abnormal findings.' }
      ]
    },
    {
      id: 'demo-2',
      title: 'RCM Workflow Optimization',
      category: 'Healthcare RCM',
      messages: [
        { role: 'user', content: 'How can I reduce claim denials in my practice?' },
        { role: 'assistant', content: 'Reducing claim denials requires a multi-faceted approach. First, ensure accurate patient registration with complete insurance verification before services. Second, implement real-time eligibility checks. Third, use automated coding validation tools to catch errors before submission. Fourth, train staff on payer-specific requirements and guidelines. Fifth, establish a denial management workflow to track, analyze, and appeal denials systematically. Most denials occur due to missing information, incorrect codes, or lack of prior authorization - address these proactively.' }
      ]
    },
    {
      id: 'demo-3',
      title: 'CPT Modifier Usage',
      category: 'Medical Coding',
      messages: [
        { role: 'user', content: 'When should I use modifier 25?' },
        { role: 'assistant', content: 'Modifier 25 is used to indicate that a significant, separately identifiable evaluation and management (E/M) service was provided on the same day as a procedure or other service. Key requirements: 1) The E/M service must be above and beyond the usual pre- and post-operative care, 2) It must be documented separately in the medical record, 3) It must be medically necessary. Common scenarios include addressing a new problem during a procedure visit or managing a separate condition. Always ensure your documentation clearly supports the separate nature of the E/M service.' }
      ]
    },
    {
      id: 'demo-4',
      title: 'Career Path in Medical Coding',
      category: 'Career Guidance',
      messages: [
        { role: 'user', content: 'What certifications should I pursue for a career in medical coding?' },
        { role: 'assistant', content: 'The most recognized certifications in medical coding are: 1) **CPC (Certified Professional Coder)** from AAPC - ideal for physician-based coding, 2) **CCS (Certified Coding Specialist)** from AHIMA - good for hospital/inpatient coding, 3) **CCS-P (Certified Coding Specialist-Physician-based)** from AHIMA. For RCM roles, consider **CPB (Certified Professional Biller)** or **CRCR (Certified Revenue Cycle Representative)**. Start with CPC as it\'s the most versatile. Continuing education units (CEUs) are required to maintain certification. Consider specializing in areas like oncology, cardiology, or orthopedics for career advancement.' }
      ]
    }
  ])

  useEffect(() => {
    // Load chats and current session from localStorage
    const storedChats = localStorage.getItem('healthcare_chats')
    const storedCurrentChatId = localStorage.getItem('healthcare_current_chat_id')

    if (storedChats) {
      setChats(JSON.parse(storedChats))
    }
    if (storedCurrentChatId) {
      setCurrentChatId(storedCurrentChatId)
    }
  }, [])

  const saveChats = (updatedChats) => {
    setChats(updatedChats)
    localStorage.setItem('healthcare_chats', JSON.stringify(updatedChats))
  }

  // Wrapper for setCurrentChatId to also save to localStorage
  const handleSetCurrentChatId = (id) => {
    setCurrentChatId(id)
    if (id) {
      localStorage.setItem('healthcare_current_chat_id', id)
    } else {
      localStorage.removeItem('healthcare_current_chat_id')
    }
  }

  const createChat = (category) => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: `New ${category} Chat`,
      category,
      messages: [],
      createdAt: new Date().toISOString()
    }
    const updatedChats = [newChat, ...chats]
    saveChats(updatedChats)
    saveChats(updatedChats)
    handleSetCurrentChatId(newChat.id)
    return newChat.id
  }

  const updateChat = (chatId, updates) => {
    const updatedChats = chats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    )
    saveChats(updatedChats)
  }

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    saveChats(updatedChats)
    if (currentChatId === chatId) {
      handleSetCurrentChatId(null)
    }
  }

  const addMessage = (chatId, message) => {
    // Don't save messages to demo chats - they're view-only
    if (chatId?.startsWith('demo-view-')) {
      if (viewingDemoChat) {
        const updatedMessages = [...(viewingDemoChat.messages || []), message]
        setViewingDemoChat({
          ...viewingDemoChat,
          messages: updatedMessages
        })
      }
      return
    }

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, message]
        // Update title from first user message if it's still default
        const title = chat.title.startsWith('New ') && chat.messages.length === 0
          ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
          : chat.title
        return { ...chat, messages: updatedMessages, title }
      }
      return chat
    })
    saveChats(updatedChats)
  }

  const editMessage = (chatId, messageIndex, newContent) => {
    // Handle demo chat editing
    if (chatId?.startsWith('demo-view-')) {
      if (viewingDemoChat) {
        const updatedMessages = [...viewingDemoChat.messages]
        if (updatedMessages[messageIndex]) {
          updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent }
          setViewingDemoChat({
            ...viewingDemoChat,
            messages: updatedMessages
          })
        }
      }
      return
    }

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages]
        if (updatedMessages[messageIndex]) {
          updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent }
          return { ...chat, messages: updatedMessages }
        }
      }
      return chat
    })
    saveChats(updatedChats)
  }

  const loadDemoChat = (demoChatId) => {
    // Demo chats are view-only and should not be stored in chat history
    // They are displayed temporarily for reference only
    const demoChat = demoChats.find(chat => chat.id === demoChatId)
    if (demoChat) {
      // Create a temporary chat that won't be saved
      const tempChat = {
        ...demoChat,
        id: `demo-view-${Date.now()}`,
        isDemo: true, // Mark as demo so it won't be saved
        createdAt: new Date().toISOString()
      }
      setViewingDemoChat(tempChat)
      handleSetCurrentChatId(tempChat.id)
      // Don't save to chats array - it's view-only
      return tempChat.id
    }
  }

  const getCurrentChat = () => {
    // Check if we're viewing a demo chat
    if (currentChatId?.startsWith('demo-view-') && viewingDemoChat) {
      return viewingDemoChat
    }
    // If we switched away from demo, clear it
    if (!currentChatId?.startsWith('demo-view-')) {
      setViewingDemoChat(null)
    }
    return chats.find(c => c.id === currentChatId)
  }

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      setCurrentChatId: handleSetCurrentChatId,
      createChat,
      updateChat,
      deleteChat,
      addMessage,
      editMessage,
      demoChats,
      loadDemoChat,
      getCurrentChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}

