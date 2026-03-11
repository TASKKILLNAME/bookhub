import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

function StarRating({ rating, onChange, size = 20, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (!interactive || !onChange) return;
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    onChange(newRating);
  };

  const handleMouseMove = (e: React.MouseEvent, starIndex: number) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(isHalf ? starIndex + 0.5 : starIndex + 1);
  };

  const filledColor = '#e3b341';
  const emptyColor = '#30363d';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        cursor: interactive ? 'pointer' : 'default',
      }}
      onMouseLeave={() => setHoverRating(0)}
    >
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const filled = displayRating >= starIndex + 1;
        const halfFilled = !filled && displayRating >= starIndex + 0.5;

        return (
          <div
            key={starIndex}
            style={{ position: 'relative', width: size, height: size }}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              handleClick(starIndex, x < rect.width / 2);
            }}
          >
            {filled ? (
              <Star size={size} fill={filledColor} color={filledColor} strokeWidth={1.5} />
            ) : halfFilled ? (
              <div style={{ position: 'relative' }}>
                <Star size={size} fill="none" color={emptyColor} strokeWidth={1.5} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
                  <Star size={size} fill={filledColor} color={filledColor} strokeWidth={1.5} />
                </div>
              </div>
            ) : (
              <Star size={size} fill="none" color={emptyColor} strokeWidth={1.5} />
            )}
          </div>
        );
      })}
      {!interactive && (
        <span
          style={{
            marginLeft: 6,
            fontSize: size * 0.7,
            color: '#e3b341',
            fontWeight: 600,
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
