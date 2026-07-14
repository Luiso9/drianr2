export default function IconFolder({ open }: { open?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 4a1 1 0 0 1 1-1h4l1.5 1.5H14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4z"
        fill={open ? '#88C0D0' : '#81A1C1'}
        stroke="#5E81AC"
        strokeWidth="0.75"
      />
    </svg>
  )
}
