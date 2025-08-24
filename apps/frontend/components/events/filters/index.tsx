'use client'

type Props = {
  children: React.ReactNode;
}

export default function Filters({ children }: Props) {
  return (
    <div className="w-full px-8 py-4 bg-background border-b border-input">
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-center">
        {children}
      </div>
    </div>
  )
}
