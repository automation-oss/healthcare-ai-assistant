import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatProvider } from './context/ChatContext'
import { AuthProvider } from './context/AuthContext'
import ChatPage from './pages/ChatPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
