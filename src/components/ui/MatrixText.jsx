import React, { useState, useEffect, useRef } from 'react';

const POOL = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}|&^%$#@!';

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

export default function MatrixText({ text, className, ...props }) {
  const [display, setDisplay] = useState(() => ' '.repeat(text.length));
  const [resolved, setResolved] = useState(false);
  const [version, setVersion] = useState(0);
  const mountedRef = useRef(true);

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

    chars.forEach((_, i) => {
      const startAt = i * 80;
      const scrambles = 6 + Math.floor(Math.random() * 6);
      const endAt = startAt + scrambles * 70;
      totalTimings.push(endAt);
    });

    const maxEnd = Math.max(...totalTimings);

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
