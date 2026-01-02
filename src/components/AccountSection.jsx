import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'

function AccountSection() {
  const { user, login, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignIn = () => {
    // Simulate login - in real app, this would be an API call
    login({
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
  }

  if (!user) {
    return (
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleSignIn}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Create Account / Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="p-3 border-t border-gray-200 relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {dropdownOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <button
            onClick={() => {
              setDropdownOpen(false)
              // Navigate to profile
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={() => {
              setDropdownOpen(false)
              // Navigate to settings
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={() => {
              logout()
              setDropdownOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default AccountSection

