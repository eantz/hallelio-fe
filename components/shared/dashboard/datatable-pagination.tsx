import { Button } from "@/components/ui/button";
import { PaginationEllipsis, PaginationItem, PaginationLink, Pagination, PaginationContent, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { JSX } from "react";

function PaginationPageLink({
  pageNum,
  onPageChange,
  isActive = false,
  
}: {
  pageNum: number,
  onPageChange: (page: number) => void,
  isActive?: boolean
}) {
  return (
    <PaginationItem key={pageNum}>
      {!isActive ? (
        <Button variant="default" disabled className="font-bold disabled:opacity-100">{pageNum}</Button>
      ) : (
        <PaginationLink
          onClick={() => onPageChange(pageNum)}
          isActive={isActive}
          className="cursor-pointer"
        >
          {pageNum}
        </PaginationLink>
      )} 
    </PaginationItem>  
  )
  
}

const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {

  const pages: JSX.Element[] = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationPageLink 
          pageNum={i}
          isActive={currentPage !== i}
          onPageChange={onPageChange}
          key={i}
        />
      );
    }
  } else {
    // always show the first page link
    pages.push(
      <PaginationPageLink 
          pageNum={1}
          isActive={currentPage !== 1}
          onPageChange={onPageChange}
          key={1}
        />
    )

    if (currentPage < 3) {
      for (let i = 2; i <= 3; i++) {
        pages.push(
          <PaginationPageLink 
            pageNum={i}
            isActive={currentPage !== i}
            onPageChange={onPageChange}
            key={i}
          />
        );
      }
    } else {
      if (currentPage > 3) {
        pages.push(<PaginationEllipsis key="ellipsis-before" />)
      }
      
      
      const minMiddleLinks = currentPage - 1 !== 1 ? 
        ((currentPage + 1 === totalPages || currentPage == totalPages) && currentPage - 2 !== 1 ? currentPage - 2 : currentPage - 1) 
        : currentPage
      const maxMiddleLinks = currentPage + 1 !== totalPages ? (currentPage !== totalPages ? currentPage + 1 : currentPage - 1)  : currentPage

      for (let i = minMiddleLinks; i <= maxMiddleLinks; i++) {
        pages.push(
          <PaginationPageLink 
            pageNum={i}
            isActive={currentPage !== i}
            onPageChange={onPageChange}
            key={i}
          />
        );
      }
    }

    if (totalPages > 6 && currentPage + 2 < totalPages) {
      pages.push(<PaginationEllipsis key="ellipsis-after" />)
    }

    // always show the last page link
    pages.push(
      <PaginationPageLink 
        pageNum={totalPages}
        isActive={currentPage !== totalPages}
        onPageChange={onPageChange}
        key={totalPages}
      />
    )
  }
  return pages;
};

type DataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
}

export default function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: DataTablePaginationProps) {

  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && currentPage > 1 ? (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              isActive={true}
              className="cursor-pointer"
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && currentPage < totalPages ? (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              isActive={true}
              className="cursor-pointer"
            />
          </PaginationItem>
        ): null}
      </PaginationContent>
    </Pagination>
  )
}