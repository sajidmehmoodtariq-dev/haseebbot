# 🤖 HaseebBot - Multi-AI Neural Assistant

A stunning, mobile-friendly chatbot interface that allows you to interact with multiple AI models simultaneously. Built with Next.js, featuring a unique "Neural Prism" glassmorphic design with animated neural network backgrounds.

## ✨ Features

- **Multi-AI Support**: Chat with Gemini Pro, Grok, and custom models
- **Compare Mode**: Get responses from multiple AI models side-by-side
- **Neural Prism Theme**: Beautiful glassmorphic design with animated backgrounds
- **OAuth Authentication**: Sign in with Google or GitHub
- **MongoDB Integration**: Store chat history and user preferences
- **Mobile-First Design**: Fully responsive with touch gestures
- **Real-time Chat**: Smooth animations and typing indicators

## 🎨 Design Philosophy

The "Neural Prism" design features:
- Deep space theme with gradient overlays
- Glassmorphic cards with backdrop blur
- Animated neural network background patterns
- Floating UI elements with micro-interactions
- Custom scrollbars and loading animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Google OAuth credentials
- GitHub OAuth credentials
- AI API keys (Gemini, Grok)

### Installation

1. **Install dependencies**:
```bash
npm install @google/generative-ai framer-motion react-hot-toast sonner @radix-ui/react-avatar @radix-ui/react-button @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-textarea @radix-ui/react-switch @radix-ui/react-select @hookform/resolvers react-hook-form zod
```

2. **Setup environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/haseebbot
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

GEMINI_API_KEY=your-gemini-api-key
GROK_API_KEY=your-grok-api-key
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:3000`

## 🔧 Configuration

### OAuth Setup

**Google OAuth**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirects

**GitHub OAuth**:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### MongoDB Setup

**Local MongoDB**:
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**MongoDB Atlas** (Recommended):
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster
3. Get connection string
4. Add your IP to whitelist

### AI API Keys

**Gemini API**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key

**Grok API**:
1. Contact X/Twitter for Grok API access

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   └── chat/               # Chat API endpoints
│   ├── auth/signin/            # Custom sign-in page
│   └── globals.css             # Neural Prism theme styles
├── components/
│   ├── chat/                   # Chat interface components
│   │   ├── ChatInterface.jsx   # Main chat component
│   │   ├── ChatMessage.jsx     # Message bubbles
│   │   ├── ModelSelector.jsx   # AI model selector
│   │   └── TypingIndicator.jsx # Loading animations
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── mongodb.js              # Database connection
│   └── utils.js                # Utility functions
└── models/
    ├── User.js                 # User schema
    └── Chat.js                 # Chat schema
```

## 🎯 Features Breakdown

### Chat Interface
- **Multi-pane view**: Compare responses from different AI models
- **Message threading**: Maintain conversation context
- **Rich text support**: Markdown rendering for AI responses
- **Real-time typing**: Beautiful typing indicators with animations

### Neural Prism Design
- **Glassmorphic cards**: Translucent containers with backdrop blur
- **Animated gradients**: Moving background patterns
- **Custom animations**: Float, glow, and shimmer effects
- **Responsive design**: Mobile-first approach with touch gestures

### Authentication
- **Multiple providers**: Google and GitHub OAuth
- **Session management**: JWT with database sync
- **User preferences**: Store model preferences and settings

### Database Models
- **User model**: OAuth data, preferences, usage stats
- **Chat model**: Conversation history with metadata
- **Message schema**: Individual messages with AI model tracking

## 🔮 Extending the Bot

### Adding New AI Models

1. Update the `AI_MODELS` array in `ChatInterface.jsx`:
```javascript
{
  id: 'claude',
  name: 'Claude',
  icon: MessageCircle,
  color: 'orange',
  description: 'Anthropic\'s helpful AI'
}
```

2. Add API integration in `/api/chat/route.js`:
```javascript
case 'claude':
  // Add Claude API call
  break;
```

3. Add styling in `globals.css`:
```css
.model-claude {
  box-shadow: 0 0 20px rgba(251, 146, 60, 0.5);
}
```

### Custom Themes

Modify CSS variables in `globals.css` to create new themes:
```css
:root {
  --neural-blue: #your-color;
  --neural-purple: #your-color;
  /* Add custom colors */
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database solutions
- All AI providers for their APIs

---

**Built with ❤️ and cutting-edge technology**
