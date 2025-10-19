'use client';

import { useSession } from 'next-auth/react';
import ChatInterface from '@/components/chat/ChatInterface';
import SignIn from '@/app/auth/signin/page';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center glow-strong">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <SignIn />;
  }

  return <ChatInterface />;
}
