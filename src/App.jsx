import React, { useState, useEffect } from 'react';
import WebhookManager from './components/WebhookManager';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {!isOnline && (
          <div className="offline-banner">
            <span>⚠️ 오프라인 상태입니다. 인터넷 연결을 확인해주세요.</span>
          </div>
        )}
        <WebhookManager />
      </main>
      <Footer />
    </div>
  );
}

export default App;
