export default function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2A93B" />
          <stop offset="1" stopColor="#E8654A" />
        </linearGradient>
      </defs>
      <rect x="6" y="4" width="5" height="40" rx="2" fill="#DDE3DC" />
      <rect x="18" y="4" width="5" height="40" rx="2" fill="#DDE3DC" />
      <rect x="6" y="9" width="17" height="3" rx="1" fill="#DDE3DC" />
      <rect x="6" y="19" width="17" height="3" rx="1" fill="#DDE3DC" />
      <rect x="6" y="29" width="17" height="3" rx="1" fill="#DDE3DC" />
      <rect x="6" y="39" width="17" height="3" rx="1" fill="#DDE3DC" />
      <path d="M23 6 h7 a9 9 0 010 18 h-7 z" fill="url(#logoGrad)" />
      <path d="M23 24 h7 a9.5 9.5 0 010 19 h-7 z" fill="url(#logoGrad)" />
    </svg>
  );
}
