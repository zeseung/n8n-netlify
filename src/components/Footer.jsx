import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>n8n 웹훅 고정기</h4>
            <p>로컬 n8n 웹훅을 안정적인 URL로 변환하여 외부 서비스에서 사용할 수 있도록 도와줍니다.</p>
          </div>
          
          <div className="footer-section">
            <h4>사용법</h4>
            <ul>
              <li>1. 로컬 n8n 웹훅 URL을 입력하세요</li>
              <li>2. 고정된 URL을 외부 서비스에서 사용하세요</li>
              <li>3. 모든 요청이 자동으로 로컬 n8n으로 전달됩니다</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>기술 스택</h4>
            <ul>
              <li>React 18</li>
              <li>Netlify Functions</li>
              <li>Parcel</li>
              <li>Sass</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 n8n 웹훅 고정기. MIT License.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
