const KAKAO_REST_API_KEY = 'ed9aa2e1bc5104fc9fd30c586e1a051f';

export default async function handler(req: any, res: any) {
  const { q, size } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }

  const params = new URLSearchParams();
  params.set('query', String(q));
  if (size) params.set('size', String(size));

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v3/search/book?${params.toString()}`,
      {
        headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
      }
    );
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(response.status).json(data);
  } catch {
    return res.status(500).json({ error: 'Kakao API request failed' });
  }
}
