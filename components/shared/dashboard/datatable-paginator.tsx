import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { generatePaginationLinks } from "./datatable-generate-pages";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
}

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: PaginatorProps) {

  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages && currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              isActive={currentPage > 1}
              className="cursor-pointer"
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages && currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              isActive={currentPage < totalPages - 1}
              className="cursor-pointer"
            />
          </PaginationItem>
        ): null}
      </PaginationContent>
    </Pagination>
  )
}