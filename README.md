# Healthcare AI Assistant

A ChatGPT-like web interface tailored for a healthcare-focused AI assistant. This application provides specialized assistance in medical coding, healthcare RCM, claims & denials, career guidance, and general healthcare knowledge.

## Features

### 🎯 Core Functionality

- **Left Sidebar (Chat Management)**
  - New Chat button
  - Scrollable chat history with search
  - Three-dot menu for each chat (delete/share)
  - Demo/sample chats section
  - Account section with login/logout

- **Main Chat Interface**
  - Clean ChatGPT-like message UI
  - Category selector on new chats
  - Healthcare-focused AI responses
  - Light theme design

- **Right Side Panel**
  - Dynamic contextual recommendations
  - Updates based on user queries
  - Collapsible panel
  - Category-specific resources

### 🏥 Healthcare Categories

1. **Medical Coding** - ICD-10, CPT, HCPCS guidance
2. **Healthcare RCM** - Revenue cycle management
3. **Claims & Denials** - Claim processing and denial management
4. **Career Guidance** - Medical Coding / RCM careers
5. **General Healthcare Knowledge** - Healthcare operations

## Tech Stack

- **React 18** - UI framework
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **FastAPI + LangChain (Python)** - AI/embeddings backend
- **Express (Node.js)** - legacy scraping/email backend (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.10+ (for the LangChain backend)
- Chrome/Chromium (only if you still run the legacy Node backend)

### Installation

#### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, defaults to `http://localhost:3001`):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

#### Backend Setup

You can choose between the new Python backend (recommended for AI) and the original Node backend (for scraping/email workflows). Running both is optional.

##### Option A – Python (FastAPI + LangChain)

```bash
cd py_backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Set the frontend `.env` to `VITE_API_URL=http://localhost:8000`.

##### Option B – Node.js (legacy services)

```bash
cd server
npm install
npm run dev
# or npm start
```

This server continues to run on `http://localhost:3001`.

**Note**: Ensure the frontend is pointed to the backend you have running.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.jsx     # Left sidebar with chat management
│   ├── ChatInterface.jsx  # Main chat area
│   ├── CategorySelector.jsx  # Category selection UI
│   ├── MessageList.jsx     # Message display
│   ├── MessageInput.jsx    # Message input field
│   ├── RightPanel.jsx      # Right recommendations panel
│   └── AccountSection.jsx  # Account/login section
├── context/            # React context providers
│   ├── AuthContext.jsx     # Authentication state
│   └── ChatContext.jsx     # Chat state management
├── pages/              # Page components
│   └── ChatPage.jsx        # Main chat page
├── services/           # Business logic
│   └── aiService.js        # AI response generation
├── data/               # Static data
│   └── recommendations.js  # Content recommendations
└── main.jsx            # App entry point
```

## Features in Detail

### Chat Management
- Create new chats with category selection
- View and search chat history
- Delete or share individual chats
- Load demo conversations
- Persistent storage using localStorage

### AI Responses
- Category-specific responses
- Professional healthcare tone
- Domain authority in medical coding, billing, RCM, and compliance
- Contextual recommendations

### Authentication
- Simple authentication UI (can be extended with JWT)
- Local storage fallback for non-logged-in users
- User profile dropdown with settings

## Customization

### Adding New Categories
Edit `src/components/CategorySelector.jsx` to add new categories.

### Modifying AI Responses
Update `src/services/aiService.js` to customize response generation.

### Changing Recommendations
Modify `src/data/recommendations.js` to update contextual recommendations.

## Backend API

The application includes a backend server for:
- **Web Scraping**: Real-time scraping of billingparadise.com
- **Database Storage**: SQLite database for user emails
- **CORS Handling**: Properly configured for frontend integration

See [README_BACKEND.md](./README_BACKEND.md) for detailed backend documentation.

## Future Enhancements

- JWT-based authentication
- Real AI model integration (OpenAI, Anthropic, etc.)
- Advanced search functionality
- Export chat functionality
- Multi-language support
- PostgreSQL/MySQL database migration
- Rate limiting and caching

## License

MIT License

