'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils/cn';

/** Corazón sólido de Font Awesome, solo en celeste #547A95. */
export function StreakHeart({
  beat = false,
  className,
}: {
  beat?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex size-7 items-center justify-center',
        beat && 'streak-heart-beat',
        className,
      )}
      aria-hidden
    >
      <FontAwesomeIcon
        icon={faHeart}
        className="text-[#B93636]"
        style={{ width: 22, height: 22 }}
      />
    </span>
  );
}
