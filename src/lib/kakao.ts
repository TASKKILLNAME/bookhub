import axios from 'axios';

const KAKAO_REST_API_KEY = 'ed9aa2e1bc5104fc9fd30c586e1a051f';

export interface KakaoBook {
  title: string;
  authors: string[];
  publisher: string;
  isbn: string;
  thumbnail: string;
  contents: string;
  datetime: string;
  price: number;
  sale_price: number;
  url: string;
}

interface KakaoBookResponse {
  meta: { total_count: number; pageable_count: number; is_end: boolean };
  documents: KakaoBook[];
}

export async function searchBooks(query: string, size = 10): Promise<KakaoBook[]> {
  try {
    if (import.meta.env.DEV) {
      // 로컬: Vite 프록시 사용
      const res = await axios.get<KakaoBookResponse>('/kakao-api/v3/search/book', {
        params: { query, size },
        headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
      });
      return res.data.documents;
    } else {
      // 배포: Vercel serverless function 사용
      const res = await axios.get<KakaoBookResponse>('/api/kakao-proxy', {
        params: { q: query, size },
      });
      return res.data.documents;
    }
  } catch (err) {
    console.error('Kakao book search failed:', err);
    return [];
  }
}

export function kakaoBookToBook(kb: KakaoBook) {
  const isbn13 = kb.isbn.split(' ').find((s) => s.length === 13) || kb.isbn.split(' ')[0] || '';
  return {
    id: isbn13 || kb.title,
    isbn: isbn13,
    title: kb.title.replace(/<[^>]*>/g, ''),
    author: kb.authors.join(', '),
    publisher: kb.publisher,
    cover_url: kb.thumbnail,
    description: kb.contents,
  };
}
