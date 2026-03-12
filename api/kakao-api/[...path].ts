import type { VercelRequest, VercelResponse } from '@vercel/node';

const KAKAO_REST_API_KEY = 'ed9aa2e1bc5104fc9fd30c586e1a051f';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const kakaoPath = Array.isArray(path) ? path.join('/') : path || '';
  const queryString = new URLSearchParams(req.query as Record<string, string>);
  queryString.delete('path');

  const url = `https://dapi.kakao.com/${kakaoPath}?${queryString.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Kakao API proxy failed' });
  }
}
