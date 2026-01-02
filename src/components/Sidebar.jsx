import { useState } from 'react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import AccountSection from './AccountSection'
import { Plus, MoreVertical, Trash2, Share2, Search } from 'lucide-react'

function Sidebar() {
  const { chats, currentChatId, setCurrentChatId, createChat, deleteChat, demoChats, loadDemoChat } = useChat()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(null)

  const handleNewChat = () => {
    setCurrentChatId(null)
  }

  const handleChatClick = (chatId) => {
    setCurrentChatId(chatId)
    setMenuOpen(null)
  }

  const handleDelete = (e, chatId) => {
    e.stopPropagation()
    deleteChat(chatId)
    setMenuOpen(null)
  }

  const handleShare = (e, chatId) => {
    e.stopPropagation()
    // Share functionality - could copy to clipboard
    navigator.clipboard.writeText(window.location.origin + '/chat/' + chatId)
    alert('Chat link copied to clipboard!')
    setMenuOpen(null)
  }

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="m-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
      >
        <Plus size={18} />
        New Chat
      </button>

      {/* Search Bar */}
      <div className="px-3 mb-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
          Recent Chats
        </div>
        {filteredChats.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-4">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={`group relative mb-1 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${currentChatId === chat.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {chat.title}
                  </div>
                  {chat.category && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {chat.category}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === chat.id ? null : chat.id)
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {menuOpen === chat.id && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={(e) => handleShare(e, chat.id)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, chat.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {/* Demo Chats Section */}
        {demoChats.length > 0 && (
          <>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4 px-1">
              Sample Chats
            </div>
            <div className="text-xs text-gray-400 mb-2 px-1">
              Click to load example conversations
            </div>
            {demoChats.map((demoChat) => (
              <div
                key={demoChat.id}
                onClick={() => loadDemoChat(demoChat.id)}
                className="mb-1 p-2 rounded-lg cursor-pointer hover:bg-gray-100 border border-dashed border-gray-300"
              >
                <div className="text-sm font-medium text-gray-700 truncate">
                  {demoChat.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {demoChat.category}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Account Section */}
      <AccountSection />
    </div>
  )
}

export default Sidebar
