import { getEvents } from '@/app/lib/events';
import { Pagination as UIPagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '../ui/pagination';

type Props = {
  pagination: Awaited<ReturnType<typeof getEvents>>['page']
}

export default function Pagination({ pagination }: Props) {
  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href="#" isActive>{pagination.number + 1}</PaginationLink>
        </PaginationItem>

        {pagination.totalPages >= pagination.number + 2 && (
          <PaginationItem>
            <PaginationLink href="#">{pagination.number + 2}</PaginationLink>
          </PaginationItem>
        )}

        {pagination.totalPages >= pagination.number + 3 && (
          <PaginationItem>
            <PaginationLink href="#">{pagination.number + 3}</PaginationLink>
          </PaginationItem>
        )}

        {pagination.totalPages > pagination.number + 4 && (
          <>
            <PaginationItem>
              <PaginationLink href="#">{pagination.totalPages + 1}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}


        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  )
}
