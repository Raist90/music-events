'use client'

import { getEvents } from '@/app/lib/events';
import { Pagination as UIPagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '../ui/pagination';
import { useSearchParams } from 'next/navigation';

type Props = {
  pagination: Awaited<ReturnType<typeof getEvents>>['page']
}

export default function Pagination({ pagination }: Props) {
  const searchParams = useSearchParams()
  const city = searchParams.getAll('city') || [];
  const country = searchParams.get('country') || "";

  const cityParam = city.map((c) => `&city=${c}`).join('')
  return (
    <UIPagination>
      <PaginationContent>
        {(pagination.number !== 0) && (
          <PaginationItem>
            <PaginationPrevious href={`/search?country=${country}${cityParam}&page=${pagination.number - 1}`} />
          </PaginationItem>
        )}

        {pagination.number - 1 > 0 && (
          <PaginationItem>
            <PaginationLink href={`/search?country=${country}${cityParam}&page=0`}>
              0
            </PaginationLink>
          </PaginationItem>
        )}
        {pagination.number - 2 > 0 && (
          <PaginationEllipsis />
        )}

        {Array.from({ length: pagination.totalPages }).map((_, index) => {
          switch (index) {
            case pagination.number:
            case pagination.number - 1:
            case pagination.number + 1:
              return (
                <PaginationItem key={index}>
                  <PaginationLink href={`/search?country=${country}${cityParam}&page=${index}`} isActive={pagination.number === index}>
                    {index}
                  </PaginationLink>
                </PaginationItem>
              )
          }
        })}

        {pagination.number < (pagination.totalPages - 3) && (
          <PaginationEllipsis />
        )}
        {pagination.number < (pagination.totalPages - 2) && (
          <PaginationItem>
            <PaginationLink href={`/search?country=${country}${cityParam}&page=${pagination.totalPages - 1}`}>
              {pagination.totalPages - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {!(pagination.number === pagination.totalPages - 1) && (
          <PaginationItem>
            <PaginationNext href={`/search?country=${country}${cityParam}&page=${pagination.number + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </UIPagination>
  )
}
