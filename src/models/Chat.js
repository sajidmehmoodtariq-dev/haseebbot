import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  model: {
    type: String,
    enum: ['gemini', 'grok', 'custom'],
  },
  tokens: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  isArchived: {
    type: Boolean,
    default: false
  },
  metadata: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    modelsUsed: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);