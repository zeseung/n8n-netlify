import React, { useState } from 'react';

function WebhookForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    localUrl: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '웹훅 이름을 입력해주세요.';
    }

    if (!formData.localUrl.trim()) {
      newErrors.localUrl = '로컬 URL을 입력해주세요.';
    } else if (!isValidUrl(formData.localUrl)) {
      newErrors.localUrl = '올바른 URL 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await onSubmit(formData);
    if (result.success) {
      setFormData({ name: '', localUrl: '', description: '' });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="webhook-form">
      <h3>새 웹훅 추가</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            웹훅 이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="예: 주문 알림 웹훅"
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="localUrl" className="form-label">
            로컬 n8n 웹훅 URL *
          </label>
          <input
            type="url"
            id="localUrl"
            name="localUrl"
            value={formData.localUrl}
            onChange={handleChange}
            className={`form-input ${errors.localUrl ? 'error' : ''}`}
            placeholder="http://localhost:5678/webhook/your-webhook-id"
            disabled={loading}
          />
          {errors.localUrl && <span className="error-message">{errors.localUrl}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            설명 (선택사항)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="이 웹훅의 용도를 설명해주세요"
            rows="3"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? '추가 중...' : '웹훅 추가'}
        </button>
      </form>
    </div>
  );
}

export default WebhookForm;
