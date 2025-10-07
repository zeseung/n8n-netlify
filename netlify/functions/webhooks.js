const axios = require('axios');

// 메모리 기반 저장소 (실제 프로덕션에서는 데이터베이스 사용 권장)
let webhooks = [];
let nextId = 1;

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// 웹훅 프록시 함수
const proxyWebhook = async (webhookId, event) => {
  const webhook = webhooks.find(w => w.id === parseInt(webhookId));
  
  if (!webhook) {
    throw new Error('웹훅을 찾을 수 없습니다.');
  }

  try {
    // 로컬 n8n으로 요청 전달
    const response = await axios({
      method: event.httpMethod,
      url: webhook.localUrl,
      data: event.body,
      headers: {
        'Content-Type': event.headers['content-type'] || 'application/json',
        ...Object.keys(event.headers)
          .filter(key => key.toLowerCase().startsWith('x-'))
          .reduce((acc, key) => {
            acc[key] = event.headers[key];
            return acc;
          }, {})
      },
      timeout: 10000 // 10초 타임아웃
    });

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: response.data,
        originalStatus: response.status
      })
    };
  } catch (error) {
    console.error('웹훅 프록시 오류:', error.message);
    
    return {
      statusCode: 502,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: '로컬 n8n 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.',
        details: error.message
      })
    };
  }
};

// 웹훅 관리 API
exports.handler = async (event, context) => {
  // CORS preflight 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const { httpMethod, path, pathParameters, body } = event;
  const webhookId = pathParameters?.id;

  try {
    switch (httpMethod) {
      case 'GET':
        if (webhookId) {
          // 특정 웹훅 조회
          const webhook = webhooks.find(w => w.id === parseInt(webhookId));
          if (!webhook) {
            return {
              statusCode: 404,
              headers: corsHeaders,
              body: JSON.stringify({ error: '웹훅을 찾을 수 없습니다.' })
            };
          }
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(webhook)
          };
        } else {
          // 모든 웹훅 조회
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(webhooks)
          };
        }

      case 'POST':
        if (webhookId && path.includes('/test')) {
          // 웹훅 테스트
          const webhook = webhooks.find(w => w.id === parseInt(webhookId));
          if (!webhook) {
            return {
              statusCode: 404,
              headers: corsHeaders,
              body: JSON.stringify({ error: '웹훅을 찾을 수 없습니다.' })
            };
          }

          // 테스트 요청을 로컬 n8n으로 전달
          const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            source: 'n8n-webhook-fixer'
          };

          try {
            const response = await axios.post(webhook.localUrl, testData, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 5000
            });

            return {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify({
                success: true,
                message: '웹훅 테스트가 성공적으로 전달되었습니다.',
                response: response.data
              })
            };
          } catch (error) {
            return {
              statusCode: 502,
              headers: corsHeaders,
              body: JSON.stringify({
                success: false,
                error: '로컬 n8n 서버에 연결할 수 없습니다.',
                details: error.message
              })
            };
          }
        } else {
          // 새 웹훅 생성
          const webhookData = JSON.parse(body);
          const { name, localUrl, description } = webhookData;

          if (!name || !localUrl) {
            return {
              statusCode: 400,
              headers: corsHeaders,
              body: JSON.stringify({ error: '이름과 로컬 URL은 필수입니다.' })
            };
          }

          // URL 유효성 검사
          try {
            new URL(localUrl);
          } catch {
            return {
              statusCode: 400,
              headers: corsHeaders,
              body: JSON.stringify({ error: '올바른 URL 형식이 아닙니다.' })
            };
          }

          const newWebhook = {
            id: nextId++,
            name,
            localUrl,
            description: description || '',
            fixedUrl: `${event.headers.host}/api/webhook/${nextId - 1}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          webhooks.push(newWebhook);

          return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(newWebhook)
          };
        }

      case 'DELETE':
        if (!webhookId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: '웹훅 ID가 필요합니다.' })
          };
        }

        const webhookIndex = webhooks.findIndex(w => w.id === parseInt(webhookId));
        if (webhookIndex === -1) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: '웹훅을 찾을 수 없습니다.' })
          };
        }

        webhooks.splice(webhookIndex, 1);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: '웹훅이 삭제되었습니다.' })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: '지원하지 않는 HTTP 메서드입니다.' })
        };
    }
  } catch (error) {
    console.error('API 오류:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' })
    };
  }
};
