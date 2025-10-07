import React, { useState } from 'react';
import axios from 'axios';

function WebhookItem({ webhook, onDelete, onTest, loading }) {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    const result = await onTest(webhook.id);
    setTesting(false);
    
    if (result.success) {
      alert('웹훅 테스트가 성공적으로 전송되었습니다!');
    }
  };

  const handleDelete = () => {
    if (window.confirm('이 웹훅을 삭제하시겠습니까?')) {
      onDelete(webhook.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className="webhook-item">
      <div className="webhook-header">
        <h4 className="webhook-name">{webhook.name}</h4>
        <div className="webhook-actions">
          <button
            className="action-btn test-btn"
            onClick={handleTest}
            disabled={loading || testing}
            title="웹훅 테스트"
          >
            {testing ? '테스트 중...' : '🧪 테스트'}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={loading}
            title="웹훅 삭제"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>

      {webhook.description && (
        <p className="webhook-description">{webhook.description}</p>
      )}

      <div className="webhook-urls">
        <div className="url-group">
          <label className="url-label">고정된 웹훅 URL:</label>
          <div className="url-input-group">
            <input
              type="text"
              value={webhook.fixedUrl}
              readOnly
              className="url-input"
            />
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(webhook.fixedUrl)}
              title="URL 복사"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        <div className="url-group">
          <label className="url-label">로컬 URL:</label>
          <div className="url-input-group">
            <input
              type="text"
              value={webhook.localUrl}
              readOnly
              className="url-input local-url"
            />
            <button
              className="copy-btn"
              onClick={() => copyToClipboard(webhook.localUrl)}
              title="로컬 URL 복사"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>
      </div>

      <div className="webhook-meta">
        <span className="created-date">
          생성일: {formatDate(webhook.createdAt)}
        </span>
        <span className="webhook-id">
          ID: {webhook.id}
        </span>
      </div>
    </div>
  );
}

export default WebhookItem;
