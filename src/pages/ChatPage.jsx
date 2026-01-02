import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ChatInterface from '../components/ChatInterface'
import RightPanel from '../components/RightPanel'
import { useChat } from '../context/ChatContext'
import { useEffect } from 'react'

function ChatPage() {
  const { chatId } = useParams()
  const { currentChatId, setCurrentChatId, chats } = useChat()
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  useEffect(() => {
    if (chatId && chats.find(c => c.id === chatId)) {
      setCurrentChatId(chatId)
    }
  }, [chatId, chats, setCurrentChatId])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>
      <RightPanel isOpen={rightPanelOpen} onToggle={() => setRightPanelOpen(!rightPanelOpen)} />
    </div>
  )
}

export default ChatPage

