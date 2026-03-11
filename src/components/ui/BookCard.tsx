import { Link } from 'react-router-dom';
import { BookOpen, Heart, MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import type { ReadingRecord } from '../../types';

interface BookCardProps {
  record: ReadingRecord;
  variant?: 'grid' | 'horizontal';
}

function BookCard({ record, variant = 'grid' }: BookCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link
        to={`/record/${record.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 160,
          maxWidth: 160,
        }}
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
            <BookOpen size={40} color="#6e7681" />
          )}
        </div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.book.title}
        </h4>
        <StarRating rating={record.rating} size={14} />
      </Link>
    );
  }

  return (
    <Link to={`/record/${record.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="card"
        style={{ overflow: 'hidden', transition: 'border-color 150ms ease', cursor: 'pointer' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#484f58'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
      >
        {/* Cover */}
        <div
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#161b22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {record.book.cover_url ? (
            <img src={record.book.cover_url} alt={record.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <BookOpen size={48} color="#6e7681" />
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 16 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e6edf3', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {record.book.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: 8 }}>
            {record.book.author}
          </p>
          <div style={{ marginBottom: 8 }}>
            <StarRating rating={record.rating} size={14} />
          </div>
          <p style={{
            fontSize: '0.8rem', color: '#8b949e', marginBottom: 12,
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5,
          }}>
            {record.description}
          </p>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: '#6e7681' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Heart size={14} /> {record.like_count}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageCircle size={14} /> {record.comment_count}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>{record.user_name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
