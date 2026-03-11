import { useState } from 'react';
import { MessageSquare, Heart, MessageCircle, PenLine, User as UserIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../stores/authStore';
import type { Story } from '../types';

const mockStories: Story[] = [
  { id: 's1', user_id: 'user1', user_name: 'LEE', title: '올해 독서 목표를 세워봤습니다', content: '올해는 50권을 목표로 잡았는데, 벌써 3월이 되었네요. 현재 12권 정도 읽었는데 여러분은 어떠신가요?', like_count: 8, comment_count: 5, created_at: '2026-03-10T18:00:00Z' },
  { id: 's2', user_id: 'user2', user_name: '책벌레', title: '전자책 vs 종이책, 여러분의 선택은?', content: '저는 원래 종이책파였는데 최근에 전자책으로 갈아탔어요. 눈이 편하고 어디서든 읽을 수 있어서 좋더라고요.', like_count: 15, comment_count: 12, created_at: '2026-03-09T09:30:00Z' },
  { id: 's3', user_id: 'user3', user_name: '독서광', title: '독서 습관 만들기 팁 공유합니다', content: '매일 30분씩 읽기를 시작한 지 6개월이 됐어요. 처음에는 힘들었지만 지금은 습관이 되었습니다.\n\n1. 정해진 시간에 읽기\n2. 핸드폰 대신 책 들기\n3. 독서 기록 남기기\n4. 너무 어려운 책은 과감히 포기하기', like_count: 23, comment_count: 8, created_at: '2026-03-08T14:00:00Z' },
  { id: 's4', user_id: 'user4', user_name: '밤독서', title: '추천 좀 해주세요! SF 소설 입문', content: 'SF 소설에 관심이 생겼는데 뭐부터 읽어야 할지 모르겠어요. 입문용으로 좋은 SF 소설 추천해주시면 감사하겠습니다!', like_count: 6, comment_count: 14, created_at: '2026-03-07T22:00:00Z' },
];

function StoriesPage() {
  const { user } = useAuthStore();
  const [stories] = useState<Story[]>(mockStories);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setShowWriteForm(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>자유 이야기</h1>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>독서에 관한 자유로운 이야기를 나눠보세요</p>
        </div>
        {user && (
          <button className="btn-primary" onClick={() => setShowWriteForm(!showWriteForm)} style={{ fontSize: '0.9rem' }}>
            <PenLine size={18} /> 글쓰기
          </button>
        )}
      </div>

      {showWriteForm && (
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 14 }}>새 글 작성</h3>
          <form onSubmit={handleSubmitStory} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="text" className="input-field" placeholder="제목을 입력하세요" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <textarea className="input-field" placeholder="내용을 입력하세요..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={5} style={{ resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowWriteForm(false)}>취소</button>
              <button type="submit" className="btn-primary">등록</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stories.map((story) => (
          <div
            key={story.id}
            style={{
              padding: '16px 20px', cursor: 'pointer', transition: 'background-color 150ms',
              borderBottom: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#161b22'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserIcon size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e6edf3' }}>{story.user_name}</span>
              <span style={{ fontSize: '0.75rem', color: '#6e7681' }}>
                {format(new Date(story.created_at), 'M월 d일', { locale: ko })}
              </span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6, color: '#e6edf3' }}>{story.title}</h3>

            <p style={{
              fontSize: '0.85rem', color: '#8b949e', lineHeight: 1.6,
              overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 10,
            }}>
              {story.content}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: '#6e7681' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} /> {story.like_count}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageCircle size={14} /> {story.comment_count}</span>
            </div>
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: '#6e7681' }}>
          <MessageSquare size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: '#8b949e' }}>아직 이야기가 없습니다</h3>
          <p style={{ fontSize: '0.9rem' }}>첫 번째 이야기를 시작해보세요!</p>
        </div>
      )}
    </div>
  );
}

export default StoriesPage;
