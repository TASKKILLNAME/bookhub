import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Send, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import StarRating from '../components/ui/StarRating';
import api from '../lib/api';
import { searchBooks, kakaoBookToBook } from '../lib/kakao';
import type { Book } from '../types';

function NewRecordPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError('');
    try {
      const kakaoResults = await searchBooks(searchQuery, 8);
      if (kakaoResults.length > 0) {
        setSearchResults(kakaoResults.map(kakaoBookToBook));
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) { setError('책을 선택해주세요.'); return; }
    if (rating === 0) { setError('평점을 선택해주세요.'); return; }
    if (!description.trim()) { setError('감상을 작성해주세요.'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/records', { book_id: selectedBook.id, book_title: selectedBook.title, book_author: selectedBook.author, book_cover_url: selectedBook.cover_url, rating, description });
      navigate('/share');
    } catch {
      setError('기록 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', backgroundColor: '#21262d', color: '#e6edf3', cursor: 'pointer', transition: 'border-color 150ms' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#484f58'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e6edf3' }}>독서 기록 등록</h1>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-input)', backgroundColor: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!selectedBook ? (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>책 검색</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input type="text" className="input-field" placeholder="책 제목 또는 ISBN을 입력하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())} />
              <button type="button" className="btn-primary" onClick={handleSearch} disabled={isSearching} style={{ flexShrink: 0, padding: '10px 16px' }}>
                {isSearching ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {searchResults.map((book) => (
                  <button
                    key={book.id} type="button"
                    onClick={() => { setSelectedBook(book); setSearchResults([]); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', backgroundColor: '#21262d', color: '#e6edf3', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 150ms' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#58a6ff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                  >
                    <div style={{ width: 44, height: 62, borderRadius: 4, backgroundColor: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {book.cover_url ? <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} /> : <BookOpen size={18} color="#6e7681" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6e7681' }}>{book.author}</div>
                      {book.publisher && <div style={{ fontSize: '0.75rem', color: '#484f58' }}>{book.publisher}</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchResults.length === 0 && !isSearching && (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#6e7681' }}>
                <Search size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: '0.9rem' }}>읽은 책을 검색해보세요</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3' }}>선택된 책</h3>
              <button type="button" onClick={() => setSelectedBook(null)} style={{ background: 'none', border: 'none', color: '#58a6ff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>변경</button>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 12, borderRadius: 'var(--radius-button)', backgroundColor: '#161b22', border: '1px solid var(--color-border)' }}>
              <div style={{ width: 52, height: 72, borderRadius: 4, backgroundColor: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {selectedBook.cover_url ? <img src={selectedBook.cover_url} alt={selectedBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} /> : <BookOpen size={20} color="#6e7681" />}
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1rem', color: '#e6edf3' }}>{selectedBook.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#6e7681' }}>{selectedBook.author}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>평점</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StarRating rating={rating} onChange={setRating} size={32} interactive />
            {rating > 0 && <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e3b341' }}>{rating.toFixed(1)}</span>}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>독서 감상</h3>
          <textarea className="input-field" placeholder="책을 읽고 느낀 점을 자유롭게 적어주세요..." value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={{ resize: 'vertical', minHeight: 120, lineHeight: 1.6 }} />
          <div style={{ textAlign: 'right', marginTop: 6, fontSize: '0.8rem', color: '#6e7681' }}>{description.length}자</div>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '12px 20px', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? '등록 중...' : <><Send size={18} /><span>기록 등록</span></>}
        </button>
      </form>
    </div>
  );
}

export default NewRecordPage;
