import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

export type SearchValuesType = {
  key: string
  value: string
}

type ComboboxProps = {
  onSearch: (val: string) => Promise<SearchValuesType[]>
  onSelectedValueChanged?: (selectedValue: SearchValuesType) => void
  selectItemPlaceholder?: string
  searchItemsPlaceholder?: string
  noItemPlaceholder?: string
  className?: string
  disabled?: boolean
}

const Combobox = React.forwardRef<
  HTMLButtonElement,
  ComboboxProps
>((
  {
    onSearch,
    onSelectedValueChanged = () => {},
    selectItemPlaceholder = 'Select an item',
    searchItemsPlaceholder = 'Search items...',
    noItemPlaceholder = 'No item found',
    className = '',
    ...props
  },
  ref
) => {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const [selectedValue, setSelectedValue] = useState<SearchValuesType | null>(null)
  const [items, setItems] = useState<SearchValuesType[]>([])

  const [searchValue] = useDebounce(
    searchText,
    700,
    { maxWait: 2000 }
  )

  const {data: queryData} = useQuery({
    queryKey: ['search', searchValue],
    queryFn: async () => {
      const searchResults = await onSearch(searchValue)
      return searchResults
    },
  })

  useEffect(() => {
    if (queryData !== undefined) {
      setItems(queryData)
    }
  }, [queryData])

  const popOverStyles = {
    width: "var(--radix-popover-trigger-width)",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200] justify-between', className)}
          {...props}
        >
          {selectedValue ? selectedValue.value : selectItemPlaceholder}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={popOverStyles}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchItemsPlaceholder} 
            className="h-9" 
            onValueChange={(e) => setSearchText(e)}
          />
          <CommandList>
            <CommandEmpty>{noItemPlaceholder}</CommandEmpty>
            <CommandGroup>
              {items.map((el: SearchValuesType, idx: number) => {
                return (
                  <CommandItem 
                    key={idx}
                    value={el.value}
                    onSelect={() => {
                      setSelectedValue(el)
                      setOpen(false)
                      onSelectedValueChanged(el)
                    }}
                  >
                    {el.value}
                    <Check 
                      className={cn(
                        "ml-auto",
                        selectedValue && selectedValue?.key === el.key ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}

            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

Combobox.displayName = 'Combobox'

export { Combobox }