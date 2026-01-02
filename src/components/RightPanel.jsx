import { useState, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import { getRecommendations } from '../data/recommendations'
import { X, ExternalLink } from 'lucide-react'

function RightPanel({ isOpen, onToggle }) {
  const { currentChatId, getCurrentChat } = useChat()
  const [recommendations, setRecommendations] = useState(null)
  const [additionalUrls, setAdditionalUrls] = useState([])

  const currentChat = getCurrentChat()

  useEffect(() => {
    if (currentChat && currentChat.messages.length > 0) {
      // Get the last assistant message for URLs
      const lastAssistantMessage = [...currentChat.messages]
        .reverse()
        .find(msg => msg.role === 'assistant')
      
      if (lastAssistantMessage && lastAssistantMessage.additionalUrls) {
        setAdditionalUrls(lastAssistantMessage.additionalUrls)
      }
      
      // Get the last user message
      const lastUserMessage = [...currentChat.messages]
        .reverse()
        .find(msg => msg.role === 'user')
      
      if (lastUserMessage) {
        const recs = getRecommendations(
          lastUserMessage.content,
          currentChat.category
        )
        setRecommendations(recs)
      } else {
        // Show default recommendations based on category
        const recs = getRecommendations('', currentChat.category)
        setRecommendations(recs)
      }
    } else if (currentChat) {
      // Show default recommendations for the category
      const recs = getRecommendations('', currentChat.category)
      setRecommendations(recs)
      setAdditionalUrls([])
    } else {
      setRecommendations(null)
      setAdditionalUrls([])
    }
  }, [currentChat])

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-2 py-8 rounded-l-lg hover:bg-blue-700 transition-colors z-10"
      >
        <ExternalLink size={20} className="rotate-90" />
      </button>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Related Resources</h3>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {recommendations ? (
          <>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              {recommendations.title}
            </h4>
            <div className="space-y-3">
              {recommendations.items.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    item.type === 'cta'
                      ? 'bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-200'
                  } transition-colors`}
                >
                  {item.type === 'cta' ? (
                    <button className="w-full text-left flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">
                        {item.text}
                      </span>
                      <ExternalLink size={14} className="text-blue-600" />
                    </button>
                  ) : (
                    <p className="text-sm text-gray-700">{item.text}</p>
                  )}
                </div>
              ))}
            </div>
            
            {/* Additional URLs from web search */}
            {additionalUrls.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-gray-700 mb-4 mt-6">
                  Related Articles from BillingParadise
                </h4>
                <div className="space-y-2">
                  {additionalUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1">
                          {url.replace('https://www.billingparadise.com', '')}
                        </span>
                        <ExternalLink size={14} className="text-blue-600 ml-2 flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400 text-center py-8">
            Start a conversation to see relevant resources
          </div>
        )}
      </div>
    </div>
  )
}

export default RightPanel

