import React from 'react';

function StatusIndicator({ loading }) {
  return (
    <div className="status-indicator">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>처리 중...</span>
        </div>
      ) : (
        <div className="status-dot online">
          <span>온라인</span>
        </div>
      )}
    </div>
  );
}

export default StatusIndicator;
