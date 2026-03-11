import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, MessageCircle, Send, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import StarRating from '../components/ui/StarRating';
import { useAuthStore } from '../stores/authStore';
import type { ReadingRecord, Comment } from '../types';

const mockRecord: ReadingRecord = {
  id: '1', user_id: 'demo', user_name: 'LEE',
  book: { id: 'b1', title: '아몬드', author: '손원평', publisher: '창비', cover_url: '',
    description: '편도체가 남들보다 작아 감정을 느끼지 못하는 열여섯 살 소년 윤재의 이야기.' },
  rating: 4.5,
  description: '감정을 느끼지 못하는 소년의 이야기가 역설적으로 가장 깊은 감정을 느끼게 해주었습니다. 윤재가 조금씩 세상과 연결되어가는 과정이 정말 아름답고, 곤이와의 우정이 인상 깊었어요.',
  like_count: 12, comment_count: 3, is_liked: false,
  created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-10T09:00:00Z',
};

const mockComments: Comment[] = [
  { id: 'c1', record_id: '1', user_id: 'user2', user_name: '책벌레', content: '저도 이 책 정말 좋아해요! 윤재의 성장이 감동적이었습니다.', created_at: '2026-03-10T12:00:00Z' },
  { id: 'c2', record_id: '1', user_id: 'user3', user_name: '독서광', content: '리뷰 잘 읽었습니다. 덕분에 다시 읽고 싶어졌어요.', created_at: '2026-03-10T14:30:00Z' },
  { id: 'c3', record_id: '1', user_id: 'user4', user_name: '밤독서', content: '감정을 근육에 비유한 부분, 저도 인상 깊었어요!', created_at: '2026-03-11T08:00:00Z' },
];

function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [record, setRecord] = useState<ReadingRecord | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setRecord(mockRecord); setComments(mockComments); setIsLiked(false); setLikeCount(mockRecord.like_count); setIsLoading(false); }, 300);
  }, [id]);

  const handleLike = () => { setIsLiked(!isLiked); setLikeCount((p) => isLiked ? p - 1 : p + 1); };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((p) => [...p, { id: `c${Date.now()}`, record_id: id || '', user_id: user?.user_id || 'guest', user_name: user?.name || '게스트', content: newComment, created_at: new Date().toISOString() }]);
    setNewComment('');
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div className="skeleton" style={{ width: 40, height: 40 }} />
          <div className="skeleton" style={{ width: 200, height: 40 }} />
        </div>
        <div className="skeleton" style={{ height: 240, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 180, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 140 }} />
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 16px' }}>
        <BookOpen size={48} color="#6e7681" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: '1.1rem', color: '#8b949e' }}>기록을 찾을 수 없습니다</h2>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', backgroundColor: '#21262d', color: '#e6edf3', cursor: 'pointer', transition: 'border-color 150ms' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#484f58'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e6edf3' }}>독서 기록</h1>
      </div>

      {/* Book Info */}
      <div className="card" style={{ padding: 24, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: 110, height: 160, borderRadius: 6, backgroundColor: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {record.book.cover_url
              ? <img src={record.book.cover_url} alt={record.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center', padding: 12 }}><BookOpen size={28} color="#6e7681" style={{ marginBottom: 8 }} /><p style={{ fontSize: '0.7rem', color: '#6e7681' }}>{record.book.title}</p></div>}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e6edf3', lineHeight: 1.3 }}>{record.book.title}</h2>
            <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>{record.book.author}{record.book.publisher && ` · ${record.book.publisher}`}</p>
            <StarRating rating={record.rating} size={18} />
            {record.book.description && <p style={{ fontSize: '0.82rem', color: '#6e7681', lineHeight: 1.5, marginTop: 4 }}>{record.book.description}</p>}
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="card" style={{ padding: 24, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={16} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e6edf3' }}>{record.user_name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#6e7681' }}>
              <Calendar size={11} /> {format(new Date(record.created_at), 'yyyy년 M월 d일', { locale: ko })}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#e6edf3', whiteSpace: 'pre-wrap' }}>{record.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
          <button onClick={handleLike} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--radius-button)',
            border: `1px solid ${isLiked ? 'rgba(248, 81, 73, 0.4)' : 'var(--color-border)'}`,
            backgroundColor: isLiked ? 'rgba(248, 81, 73, 0.1)' : '#21262d',
            color: isLiked ? '#f85149' : '#8b949e', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 150ms', minHeight: 36,
          }}>
            <Heart size={16} fill={isLiked ? '#f85149' : 'none'} /> 좋아요 {likeCount}
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6e7681', fontSize: '0.85rem' }}>
            <MessageCircle size={16} /> 댓글 {comments.length}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 14 }}>댓글 ({comments.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {comments.map((c) => (
            <div key={c.id} style={{ padding: 12, borderRadius: 'var(--radius-button)', backgroundColor: '#161b22', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={12} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#e6edf3' }}>{c.user_name}</span>
                <span style={{ fontSize: '0.72rem', color: '#6e7681' }}>{format(new Date(c.created_at), 'M월 d일 HH:mm', { locale: ko })}</span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#e6edf3', paddingLeft: 32 }}>{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 16px', color: '#6e7681' }}>
              <MessageCircle size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem' }}>첫 번째 댓글을 남겨보세요</p>
            </div>
          )}
        </div>
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
          <input type="text" className="input-field" placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글 작성 가능'} value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={!user} />
          <button type="submit" className="btn-primary" disabled={!user || !newComment.trim()} style={{ flexShrink: 0, padding: '10px 16px', opacity: !user || !newComment.trim() ? 0.5 : 1 }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecordDetailPage;
