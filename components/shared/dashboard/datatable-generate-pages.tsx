// this implementation can be a bit jumpy for larger tables, but should be good for most and easily adaptable if not
// this file is where your logic for how when ellipses are shown and other fiddly bits

import { Button } from "@/components/ui/button";
import { PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { JSX } from "react";

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          {currentPage === i ? (
            <Button variant="default" disabled className="font-bold disabled:opacity-100">{i}</Button>
          ) : (
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          )} 
        </PaginationItem>
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={i}>
          {currentPage === i ? (
            <Button variant="ghost" disabled className="font-bold disabled:opacity-100">{i}</Button>
          ) : (
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          )} 
        </PaginationItem>
      );
    }
    if (2 < currentPage && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="ellipsis-before" />)
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink
            onClick={() => onPageChange(currentPage)}
            isActive={true}
            className="cursor-pointer"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
    }
    pages.push(<PaginationEllipsis key="ellipsis-after" />)
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          {currentPage === i ? (
            <Button variant="ghost" disabled className="font-bold disabled:opacity-100">{i}</Button>
          ) : (
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          )} 
        </PaginationItem>
      );
    }
  }
  return pages;
};