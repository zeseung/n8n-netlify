const axios = require('axios');

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// 웹훅 프록시 핸들러
exports.handler = async (event, context) => {
  // CORS preflight 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const { httpMethod, path, body, headers } = event;
  
  // URL에서 웹훅 ID 추출
  const pathParts = path.split('/');
  const webhookId = pathParts[pathParts.length - 1];

  if (!webhookId || isNaN(webhookId)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: '유효하지 않은 웹훅 ID입니다.',
        path: path,
        webhookId: webhookId
      })
    };
  }

  try {
    // 웹훅 정보 조회 (실제로는 데이터베이스에서 조회해야 함)
    // 여기서는 간단히 메모리에서 조회
    const webhookData = await getWebhookData(webhookId);
    
    if (!webhookData) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: '웹훅을 찾을 수 없습니다.',
          webhookId: webhookId
        })
      };
    }

    // 로컬 n8n으로 요청 전달
    const response = await axios({
      method: httpMethod,
      url: webhookData.localUrl,
      data: body,
      headers: {
        'Content-Type': headers['content-type'] || 'application/json',
        // 원본 요청의 모든 헤더 전달 (보안상 민감한 헤더 제외)
        ...Object.keys(headers)
          .filter(key => {
            const lowerKey = key.toLowerCase();
            return lowerKey.startsWith('x-') || 
                   lowerKey === 'authorization' ||
                   lowerKey === 'user-agent' ||
                   lowerKey === 'accept';
          })
          .reduce((acc, key) => {
            acc[key] = headers[key];
            return acc;
          }, {})
      },
      timeout: 30000, // 30초 타임아웃
      maxRedirects: 5
    });

    // 응답을 클라이언트에게 전달
    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers['content-type'] || 'application/json',
        // 필요한 경우 다른 응답 헤더도 전달
        ...Object.keys(response.headers)
          .filter(key => {
            const lowerKey = key.toLowerCase();
            return lowerKey === 'content-type' ||
                   lowerKey === 'cache-control' ||
                   lowerKey.startsWith('x-');
          })
          .reduce((acc, key) => {
            acc[key] = response.headers[key];
            return acc;
          }, {})
      },
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('웹훅 프록시 오류:', {
      webhookId,
      error: error.message,
      stack: error.stack,
      request: {
        method: httpMethod,
        path: path,
        headers: headers
      }
    });

    // 오류 유형에 따른 적절한 응답
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({
          error: '로컬 n8n 서버에 연결할 수 없습니다.',
          message: 'n8n 서버가 실행 중인지 확인해주세요.',
          webhookId: webhookId,
          localUrl: webhookData?.localUrl
        })
      };
    }

    if (error.code === 'ETIMEDOUT') {
      return {
        statusCode: 504,
        headers: corsHeaders,
        body: JSON.stringify({
          error: '요청 시간이 초과되었습니다.',
          message: '로컬 n8n 서버의 응답이 너무 느립니다.',
          webhookId: webhookId
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: '웹훅 처리 중 오류가 발생했습니다.',
        message: error.message,
        webhookId: webhookId
      })
    };
  }
};

// 웹훅 데이터 조회 함수 (실제로는 데이터베이스에서 조회)
async function getWebhookData(webhookId) {
  // 실제 구현에서는 데이터베이스에서 조회
  // 여기서는 간단한 예시 데이터 반환
  const sampleWebhooks = [
    {
      id: 1,
      name: '테스트 웹훅',
      localUrl: 'http://localhost:5678/webhook/test',
      description: '테스트용 웹훅'
    }
  ];

  return sampleWebhooks.find(w => w.id === parseInt(webhookId));
}
