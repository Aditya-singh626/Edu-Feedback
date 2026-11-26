import React, { useState } from 'react';

export function StarRatingInput({ label, value, onChange, required = true }) {
  const [hoverVal, setHoverVal] = useState(0);

  return (
    <div className="rating-container">
      <label className="rating-label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <div className="star-picker">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverVal || value) >= star;
          return (
            <button
              type="button"
              key={star}
              className={`star-picker-btn ${isFilled ? 'active' : ''}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(0)}
              title={`${star} out of 5`}
            >
              ★
              <span className="star-num">{star}</span>
            </button>
          );
        })}
        <span className="rating-selection-text">
          {value ? `${value} / 5` : 'Rate 1 to 5'}
        </span>
      </div>
    </div>
  );
}

export function StarDisplay({ rating, max = 5, size = 'medium' }) {
  const numRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = (numRating - fullStars) >= 0.5;

  return (
    <div className={`rating-display-wrapper ${size}`}>
      <span className="rating-number">{numRating.toFixed(1)}</span>
      <div className="rating-stars" aria-label={`Rating: ${numRating} out of ${max}`}>
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          if (starIndex <= fullStars) {
            return <span key={i} className="star full">★</span>;
          } else if (starIndex === fullStars + 1 && hasHalfStar) {
            return <span key={i} className="star half">★</span>;
          } else {
            return <span key={i} className="star empty">★</span>;
          }
        })}
      </div>
    </div>
  );
}
