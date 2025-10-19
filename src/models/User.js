import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  preferences: {
    defaultModels: [{
      type: String,
      default: ['gemini']
    }],
    compareMode: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'neural-prism'
    }
  },
  usage: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);