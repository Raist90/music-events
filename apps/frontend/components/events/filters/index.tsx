'use client'

type Props = {
  children: React.ReactNode;
}

export default function Filters({ children }: Props) {
  return (
    <div className="w-full px-8 py-4 sticky top-0 bg-background border-b border-input">
      <div className="flex gap-x-8 items-center">
        {children}
      </div>
    </div>
  )
}
