export const experimental_ppr = true

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="space-y-12">
      {children}
    </div>
  )
}
