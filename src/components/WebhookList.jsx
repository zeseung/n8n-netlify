import React from 'react';
import WebhookItem from './WebhookItem';

function WebhookList({ webhooks, onDelete, onTest, loading }) {
  if (webhooks.length === 0) {
    return (
      <div className="webhook-list">
        <h3>등록된 웹훅</h3>
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <p>아직 등록된 웹훅이 없습니다.</p>
          <p>위의 폼을 사용해서 첫 번째 웹훅을 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="webhook-list">
      <h3>등록된 웹훅 ({webhooks.length}개)</h3>
      <div className="webhook-grid">
        {webhooks.map(webhook => (
          <WebhookItem
            key={webhook.id}
            webhook={webhook}
            onDelete={onDelete}
            onTest={onTest}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

export default WebhookList;
