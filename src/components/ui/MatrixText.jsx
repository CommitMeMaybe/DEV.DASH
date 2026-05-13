import React, { useState, useEffect, useRef } from 'react';

// Katakana + symbols used as filler during the scramble phase, giving it
// that "code being typed" look.
const POOL = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}|&^%$#@!';

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

// Animates text by cycling each character position through random characters
// before resolving to the final letter. Re-triggers on hover.
export default function MatrixText({ text, className, ...props }) {
  const [display, setDisplay] = useState(() => ' '.repeat(text.length));
  const [resolved, setResolved] = useState(false);
  const [version, setVersion] = useState(0);
  const mountedRef = useRef(true);

  // Increment version on hover so the useEffect re-runs the animation.
  const handleMouseEnter = () => {
    setVersion(v => v + 1);
  };

  useEffect(() => {
    mountedRef.current = true;
    setDisplay(' '.repeat(text.length));
    setResolved(false);

    const timers = [];
    const chars = text.split('');
    const totalTimings = [];

    // Pre-compute total timing per character to know when all are done.
    chars.forEach((_, i) => {
      const startAt = i * 80;
      const scrambles = 6 + Math.floor(Math.random() * 6);
      const endAt = startAt + scrambles * 70;
      totalTimings.push(endAt);
    });

    const maxEnd = Math.max(...totalTimings);

    // Each character: scramble N times, then lock in the final character.
    chars.forEach((char, i) => {
      const startAt = i * 80;
      const scrambles = 6 + Math.floor(Math.random() * 6);

      for (let s = 0; s < scrambles; s++) {
        timers.push(setTimeout(() => {
          if (!mountedRef.current) return;
          setDisplay(prev => {
            const arr = prev.split('');
            arr[i] = randomChar();
            return arr.join('');
          });
        }, startAt + s * 70));
      }

      timers.push(setTimeout(() => {
        if (!mountedRef.current) return;
        setDisplay(prev => {
          const arr = prev.split('');
          arr[i] = char;
          return arr.join('');
        });
      }, startAt + scrambles * 70));
    });

    // Mark resolved once all characters have settled.
    timers.push(setTimeout(() => {
      if (mountedRef.current) setResolved(true);
    }, maxEnd + 300));

    return () => {
      mountedRef.current = false;
      timers.forEach(clearTimeout);
    };
  }, [text, version]);

  return (
    <span
      className={className}
      {...props}
      onMouseEnter={handleMouseEnter}
      style={{
        cursor: 'pointer',
        // Green glow during scramble, clean text once resolved.
        textShadow: resolved
          ? 'none'
          : '0 0 8px rgba(0,255,153,0.4), 0 0 20px rgba(0,255,153,0.1)',
        color: resolved ? undefined : 'var(--accent)',
        transition: 'color 0.5s ease, text-shadow 0.5s ease',
        ...props.style,
      }}
    >
      {display}
    </span>
  );
}
