import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebhookForm from './WebhookForm';
import WebhookList from './WebhookList';
import StatusIndicator from './StatusIndicator';

function WebhookManager() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 웹훅 목록 불러오기
  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/webhooks');
      setWebhooks(response.data);
      setError(null);
    } catch (err) {
      setError('웹훅 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  // 웹훅 추가
  const addWebhook = async (webhookData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/webhooks', webhookData);
      setWebhooks(prev => [...prev, response.data]);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || '웹훅 추가에 실패했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // 웹훅 삭제
  const deleteWebhook = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/webhooks/${id}`);
      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      setError(null);
    } catch (err) {
      setError('웹훅 삭제에 실패했습니다.');
      console.error('Error deleting webhook:', err);
    } finally {
      setLoading(false);
    }
  };

  // 웹훅 테스트
  const testWebhook = async (id) => {
    try {
      setLoading(true);
      await axios.post(`/api/webhooks/${id}/test`);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || '웹훅 테스트에 실패했습니다.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return (
    <div className="webhook-manager">
      <div className="container">
        <div className="manager-header">
          <h2>웹훅 관리</h2>
          <StatusIndicator loading={loading} />
        </div>

        {error && (
          <div className="error-banner">
            <span>❌ {error}</span>
            <button 
              className="close-btn" 
              onClick={() => setError(null)}
              aria-label="오류 메시지 닫기"
            >
              ×
            </button>
          </div>
        )}

        <div className="manager-content">
          <div className="form-section">
            <WebhookForm onSubmit={addWebhook} loading={loading} />
          </div>

          <div className="list-section">
            <WebhookList 
              webhooks={webhooks}
              onDelete={deleteWebhook}
              onTest={testWebhook}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebhookManager;
