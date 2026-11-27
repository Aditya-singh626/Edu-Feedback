import React, { useState } from 'react';

export function StarRatingInput({ label, value, onChange, required = true }) {
  const [hoverVal, setHoverVal] = useState(0);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
        {label} {required && <span className="text-rose-500 text-sm">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverVal || value) >= star;
          return (
            <button
              type="button"
              key={star}
              className={`p-1 text-2xl hover:scale-110 transition cursor-pointer flex flex-col items-center leading-none bg-transparent border-0 ${
                isFilled ? 'text-amber-400' : 'text-slate-300'
              }`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(0)}
              title={`${star} out of 5`}
            >
              ★
              <span className="text-[10px] text-slate-400 mt-0.5">{star}</span>
            </button>
          );
        })}
        <span className="text-xs font-semibold text-slate-500 ml-2.5">
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

  const numberSizeClasses = size === 'large' ? 'text-3xl' : 'text-xl';
  const starSizeClasses = size === 'large' ? 'text-xl' : 'text-base';

  return (
    <div className="flex items-center gap-2">
      <span className={`font-bold text-indigo-600 ${numberSizeClasses}`}>
        {numRating.toFixed(1)}
      </span>
      <div className="flex gap-0.5" aria-label={`Rating: ${numRating} out of ${max}`}>
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          if (starIndex <= fullStars) {
            return <span key={i} className={`text-amber-400 ${starSizeClasses}`}>★</span>;
          } else if (starIndex === fullStars + 1 && hasHalfStar) {
            return <span key={i} className={`text-amber-400 opacity-70 ${starSizeClasses}`}>★</span>;
          } else {
            return <span key={i} className={`text-slate-200 ${starSizeClasses}`}>★</span>;
          }
        })}
      </div>
    </div>
  );
}
