import DOMPurify from 'dompurify';

export function sanitizeInput(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  const stripped = input.trim().slice(0, maxLength);
  return DOMPurify.sanitize(stripped, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function validateGitHubUsername(username) {
  return /^[a-zA-Z0-9-]{1,39}$/.test(username);
}

export function validateCity(city) {
  return /^[a-zA-Z\s-]+$/.test(city);
}

export function safeObjectMerge(target, source) {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  const clean = {};
  for (const key of Object.keys(source)) {
    if (!dangerousKeys.includes(key)) {
      clean[key] = source[key];
    }
  }
  return { ...target, ...clean };
}

if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};
}
