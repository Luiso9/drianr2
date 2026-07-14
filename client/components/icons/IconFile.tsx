import type { FileType } from '../../../client/types'

const FILE_COLORS: Record<FileType, [string, string]> = {
  pdf:     ['#BF616A', '#D08770'],
  image:   ['#A3BE8C', '#88C0D0'],
  video:   ['#B48EAD', '#81A1C1'],
  audio:   ['#EBCB8B', '#D08770'],
  code:    ['#88C0D0', '#5E81AC'],
  text:    ['#D8DEE9', '#81A1C1'],
  archive: ['#EBCB8B', '#D08770'],
  data:    ['#A3BE8C', '#5E81AC'],
  folder:  ['#81A1C1', '#5E81AC'],
  unknown: ['#4C566A', '#3B4252'],
}

export default function IconFile({ type }: { type: FileType }) {
  const [fill, stroke] = FILE_COLORS[type]
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2a1 1 0 0 1 1-1h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2z" fill={fill} stroke={stroke} strokeWidth="0.75"/>
      <path d="M9 1v3h3" stroke={stroke} strokeWidth="0.75" fill="none"/>
    </svg>
  )
}
