'use client'

type Props = {
  children: React.ReactNode;
}

export default function Filters({ children }: Props) {
  return (
    <div className="w-full px-8 py-4 space-y-8">
      {children}
    </div>
  )
}
