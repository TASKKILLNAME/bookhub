import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, BookOpen, Loader2 } from 'lucide-react';
import BookCard from '../components/ui/BookCard';
import { useAuthStore } from '../stores/authStore';
import { searchBooks, kakaoBookToBook } from '../lib/kakao';
import type { ReadingRecord } from '../types';

const mockRecords: ReadingRecord[] = [
  { id: '1', user_id: 'user1', user_name: 'LEE', book: { id: 'b1', title: '아몬드', author: '손원평', cover_url: '' }, rating: 4.5, description: '감정을 느끼지 못하는 소년의 이야기가 역설적으로 가장 깊은 감정을 느끼게 해주었습니다.', like_count: 12, comment_count: 3, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-10T09:00:00Z' },
  { id: '2', user_id: 'user2', user_name: '책벌레', book: { id: 'b2', title: '달러구트 꿈 백화점', author: '이미예', cover_url: '' }, rating: 4.0, description: '꿈을 파는 백화점이라는 독특한 설정이 매력적이었습니다.', like_count: 8, comment_count: 2, created_at: '2026-03-09T15:00:00Z', updated_at: '2026-03-09T15:00:00Z' },
  { id: '3', user_id: 'user3', user_name: '독서광', book: { id: 'b3', title: '불편한 편의점', author: '김호연', cover_url: '' }, rating: 4.5, description: '편의점이라는 일상적인 공간에서 펼쳐지는 따뜻한 이야기.', like_count: 15, comment_count: 5, created_at: '2026-03-08T10:00:00Z', updated_at: '2026-03-08T10:00:00Z' },
  { id: '4', user_id: 'user4', user_name: '밤독서', book: { id: 'b4', title: '역행자', author: '자청', cover_url: '' }, rating: 3.5, description: '자기계발서 중에서 실용적인 조언이 많았습니다.', like_count: 6, comment_count: 1, created_at: '2026-03-07T20:00:00Z', updated_at: '2026-03-07T20:00:00Z' },
  { id: '5', user_id: 'user1', user_name: 'LEE', book: { id: 'b5', title: '미드나잇 라이브러리', author: '매트 헤이그', cover_url: '' }, rating: 5.0, description: '삶의 선택에 대해 깊이 생각하게 만드는 소설.', like_count: 20, comment_count: 7, created_at: '2026-03-06T11:00:00Z', updated_at: '2026-03-06T11:00:00Z' },
  { id: '6', user_id: 'user5', user_name: '페이지터너', book: { id: 'b6', title: '작은 아씨들', author: '루이자 메이 올컷', cover_url: '' }, rating: 4.0, description: '시대를 초월한 자매들의 성장 이야기.', like_count: 10, comment_count: 4, created_at: '2026-03-05T14:00:00Z', updated_at: '2026-03-05T14:00:00Z' },
];

type SortTab = 'latest' | 'popular';

function SharePage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SortTab>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<ReadingRecord[]>(mockRecords);

  // Fetch covers
  useEffect(() => {
    let cancelled = false;
    async function fetchCovers() {
      const updated = await Promise.all(
        mockRecords.map(async (record) => {
          try {
            const results = await searchBooks(record.book.title, 1);
            if (results.length > 0 && !cancelled) {
              const kb = kakaoBookToBook(results[0]);
              return { ...record, book: { ...record.book, cover_url: kb.cover_url, author: kb.author || record.book.author } };
            }
          } catch { /* keep default */ }
          return record;
        })
      );
      if (!cancelled) { setRecords(updated); setIsLoading(false); }
    }
    fetchCovers();
    return () => { cancelled = true; };
  }, []);

  const filteredRecords = records
    .filter((r) => !searchQuery || r.book.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.book.author.toLowerCase().includes(searchQuery.toLowerCase()) || r.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (activeTab === 'popular') return b.like_count - a.like_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>책 경험 공유</h1>
        <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>다른 독서인들의 경험을 둘러보고, 나의 독서 기록도 공유해보세요</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#6e7681" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" className="input-field" placeholder="책 제목, 작가, 사용자로 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, padding: 3, backgroundColor: '#21262d', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', width: 'fit-content' }}>
        {([{ key: 'latest' as SortTab, label: '최신순' }, { key: 'popular' as SortTab, label: '인기순' }]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 18px', borderRadius: 4, border: 'none', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 150ms',
              backgroundColor: activeTab === tab.key ? '#30363d' : 'transparent',
              color: activeTab === tab.key ? '#e6edf3' : '#8b949e',
              minHeight: 32,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <Loader2 size={32} color="#58a6ff" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
          <p style={{ color: '#6e7681', fontSize: '0.9rem' }}>불러오는 중...</p>
        </div>
      )}

      {!isLoading && filteredRecords.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filteredRecords.map((record) => (<BookCard key={record.id} record={record} />))}
        </div>
      )}

      {!isLoading && filteredRecords.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: '#6e7681' }}>
          <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: '#8b949e' }}>{searchQuery ? '검색 결과가 없습니다' : '아직 공유된 기록이 없습니다'}</h3>
          <p style={{ fontSize: '0.9rem' }}>{searchQuery ? '다른 검색어로 시도해보세요' : '첫 번째 독서 기록을 공유해보세요!'}</p>
        </div>
      )}

      {/* FAB */}
      {user && (
        <Link
          to="/record/new"
          style={{
            position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
            backgroundColor: '#238636', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', transition: 'all 150ms', zIndex: 40,
            border: '1px solid rgba(240, 246, 252, 0.1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2ea043'; e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#238636'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Plus size={24} />
        </Link>
      )}
    </div>
  );
}

export default SharePage;
