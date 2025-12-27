"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../ui/pagination";
import { useEvents } from "./eventsContext";
import { serializeSearchParams } from "@/lib/events/serializeSearchParams";

export default function EventsPagination() {
  const {
    data: { page: pagination },
  } = useEvents();

  const searchParams = useSearchParams();
  function getPageUrl(page: number) {
    return `/search${serializeSearchParams(searchParams, { page })}`;
  }

  if (pagination.totalPages <= 1) return;

  return (
    <footer className="border-t p-4">
      <UIPagination>
        <PaginationContent>
          {pagination.number !== 0 && (
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(pagination.number - 1)} />
            </PaginationItem>
          )}

          {pagination.number - 1 > 0 && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(0)}>0</PaginationLink>
            </PaginationItem>
          )}
          {pagination.number - 2 > 0 && <PaginationEllipsis />}

          {Array.from({ length: pagination.totalPages }).map((_, index) => {
            switch (index) {
              case pagination.number:
              case pagination.number - 1:
              case pagination.number + 1:
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={getPageUrl(index)}
                      isActive={pagination.number === index}
                    >
                      {index}
                    </PaginationLink>
                  </PaginationItem>
                );
            }
          })}

          {pagination.number < pagination.totalPages - 3 && (
            <PaginationEllipsis />
          )}
          {pagination.number < pagination.totalPages - 2 && (
            <PaginationItem>
              <PaginationLink href={getPageUrl(pagination.totalPages - 1)}>
                {pagination.totalPages - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {!(pagination.number === pagination.totalPages - 1) && (
            <PaginationItem>
              <PaginationNext href={getPageUrl(pagination.number + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </UIPagination>
    </footer>
  );
}
