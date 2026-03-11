import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Star,
  Trophy,
  Medal,
  Award,
  ChevronRight,
  Plus,
  User as UserIcon,
  Flame,
  TrendingUp,
  GitCommitHorizontal,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../stores/authStore';
import StarRating from '../components/ui/StarRating';
import ReadingGrass from '../components/ui/ReadingGrass';
import { searchBooks, kakaoBookToBook } from '../lib/kakao';
import type { ReadingRecord, ReadingActivity, GenreCount } from '../types';

// Mock data
function generateMockActivities(): ReadingActivity[] {
  const activities: ReadingActivity[] = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = subDays(today, i);
    const rand = Math.random();
    let count = 0;
    if (rand > 0.85) count = 3;
    else if (rand > 0.7) count = 2;
    else if (rand > 0.5) count = 1;
    if (count > 0) activities.push({ date: format(date, 'yyyy-MM-dd'), count });
  }
  return activities;
}

const defaultBooks: ReadingRecord[] = [
  { id: '1', user_id: 'demo', user_name: 'LEE', book: { id: 'b1', title: '아몬드', author: '손원평', cover_url: '' }, rating: 4.5, description: '감정을 느끼지 못하는 소년의 이야기', like_count: 12, comment_count: 3, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: '2', user_id: 'demo', user_name: 'LEE', book: { id: 'b2', title: '달러구트 꿈 백화점', author: '이미예', cover_url: '' }, rating: 4.0, description: '꿈을 파는 백화점 이야기', like_count: 8, comment_count: 2, created_at: '2026-03-08', updated_at: '2026-03-08' },
  { id: '3', user_id: 'demo', user_name: 'LEE', book: { id: 'b3', title: '불편한 편의점', author: '김호연', cover_url: '' }, rating: 4.5, description: '편의점에서 일하는 노숙자의 따뜻한 이야기', like_count: 15, comment_count: 5, created_at: '2026-03-05', updated_at: '2026-03-05' },
  { id: '4', user_id: 'demo', user_name: 'LEE', book: { id: 'b4', title: '역행자', author: '자청', cover_url: '' }, rating: 3.5, description: '인생을 바꾸는 습관들', like_count: 6, comment_count: 1, created_at: '2026-03-01', updated_at: '2026-03-01' },
  { id: '5', user_id: 'demo', user_name: 'LEE', book: { id: 'b5', title: '흔한남매', author: '백난도', cover_url: '' }, rating: 5.0, description: '재미있는 남매의 일상', like_count: 20, comment_count: 7, created_at: '2026-02-28', updated_at: '2026-02-28' },
];

const mockGenres: GenreCount[] = [
  { genre: '소설', count: 15 },
  { genre: '자기계발', count: 8 },
  { genre: '에세이', count: 6 },
  { genre: '인문', count: 4 },
  { genre: '과학', count: 3 },
  { genre: '경제', count: 2 },
];

const genreColors = ['#3fb950', '#58a6ff', '#bc8cff', '#f778ba', '#e3b341', '#8b949e'];

function MainPage() {
  const { user } = useAuthStore();
  const [activities] = useState<ReadingActivity[]>(generateMockActivities);
  const [recentBooks, setRecentBooks] = useState<ReadingRecord[]>(defaultBooks);

  // Fetch real covers from Kakao API
  useEffect(() => {
    let cancelled = false;
    async function fetchCovers() {
      const updated = await Promise.all(
        defaultBooks.map(async (record) => {
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
      if (!cancelled) setRecentBooks(updated);
    }
    fetchCovers();
    return () => { cancelled = true; };
  }, []);

  const topBooks = useMemo(() => {
    return [...recentBooks].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [recentBooks]);

  const totalBooks = 38;
  const avgRating = 4.2;
  const maxGenreCount = Math.max(...mockGenres.map((g) => g.count));
  const displayName = user?.name || '독서인';

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero Section - GitHub style gradient */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 139, 253, 0.15), transparent)',
          }}
        />
        <div
          style={{
            position: 'relative',
            padding: '32px 28px',
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3fb950, #58a6ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '3px solid var(--color-border)',
            }}
          >
            <UserIcon size={40} color="#fff" />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e6edf3', marginBottom: 4, lineHeight: 1.2 }}>
              {displayName}
            </h1>
            <p style={{ color: '#8b949e', fontSize: '0.95rem', marginBottom: 10 }}>
              책 한 권이 인생을 바꿀 수 있다
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: '#8b949e' }}>
                <BookOpen size={15} /> <strong style={{ color: '#e6edf3' }}>{totalBooks}</strong> books
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: '#8b949e' }}>
                <Star size={15} fill="#e3b341" color="#e3b341" /> <strong style={{ color: '#e6edf3' }}>{avgRating.toFixed(1)}</strong> avg
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: '#8b949e' }}>
                <Flame size={15} color="#f85149" /> <strong style={{ color: '#e6edf3' }}>{activities.length}</strong> days
              </span>
            </div>
          </div>

          {/* Action */}
          <Link
            to={user ? '/record/new' : '/login'}
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: '0.9rem' }}
          >
            <Plus size={18} />
            독서 기록
          </Link>
        </div>
      </div>

      {/* Reading Grass - GitHub 잔디 */}
      <ReadingGrass activities={activities} />

      {/* Stats + Genre Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Genre Distribution */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e6edf3', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} /> 장르 분포
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockGenres.map((genre, i) => (
              <div key={genre.genre} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 56, fontSize: '0.8rem', color: '#8b949e', flexShrink: 0, textAlign: 'right' }}>
                  {genre.genre}
                </span>
                <div style={{ flex: 1, height: 8, backgroundColor: '#21262d', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(genre.count / maxGenreCount) * 100}%`,
                      height: '100%',
                      backgroundColor: genreColors[i % genreColors.length],
                      borderRadius: 4,
                      transition: 'width 500ms ease-out',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6e7681', width: 24, textAlign: 'right' }}>
                  {genre.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Books */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e6edf3', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={16} color="#e3b341" /> 나만의 책 순위
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topBooks.map((record, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const colors = ['#e3b341', '#8b949e', '#da7b33'];
              return (
                <Link
                  key={record.id}
                  to={`/record/${record.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: '#21262d',
                      border: '1px solid transparent',
                      transition: 'border-color 150ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#30363d'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: colors[index], width: 20, textAlign: 'center' }}>
                      {index + 1}
                    </span>
                    <div
                      style={{
                        width: 36,
                        height: 48,
                        borderRadius: 4,
                        backgroundColor: '#161b22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {record.book.cover_url ? (
                        <img src={record.book.cover_url} alt={record.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <BookOpen size={16} color="#6e7681" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {record.book.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#6e7681' }}>{record.book.author}</p>
                    </div>
                    <StarRating rating={record.rating} size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e6edf3', display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitCommitHorizontal size={16} /> 최근 읽은 책
          </h3>
          <Link
            to="/share"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#58a6ff',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
          {recentBooks.map((record) => (
            <Link
              key={record.id}
              to={`/record/${record.id}`}
              style={{ textDecoration: 'none', color: 'inherit', scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <div
                style={{ width: 160, transition: 'transform 200ms ease-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div
                  style={{
                    width: 160,
                    height: 220,
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    backgroundColor: '#161b22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {record.book.cover_url ? (
                    <img src={record.book.cover_url} alt={record.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, textAlign: 'center' }}>
                      <BookOpen size={32} color="#6e7681" />
                      <span style={{ fontSize: '0.75rem', color: '#6e7681', lineHeight: 1.3 }}>{record.book.title}</span>
                    </div>
                  )}
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                  {record.book.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#6e7681', marginBottom: 4 }}>{record.book.author}</p>
                <StarRating rating={record.rating} size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
