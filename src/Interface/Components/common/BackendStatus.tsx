import React, { useState, useEffect } from 'react';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        setStatus('checking');
        setError(null);
        
        // Try a simple HEAD request to test connectivity
        const response = await fetch('/api', {
          method: 'HEAD'
        });
        
        if (response.ok || response.status === 404) {
          // 404 is expected since /api doesn't exist, but it means the server is responding
          setStatus('online');
        } else {
          setStatus('offline');
          setError(`HTTP ${response.status}`);
        }
      } catch (err) {
        setStatus('offline');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkBackend();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed top-16 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
        🔍 Checking backend...
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="fixed top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
        ❌ Backend offline: {error}
      </div>
    );
  }

  return (
    <div className="fixed top-16 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
      ✅ Backend online
    </div>
  );
};

export default BackendStatus;