import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export type SearchValuesType = {
  key: string
  value: string
}

type ComboboxProps = {
  onSearch: (val: string) => Promise<SearchValuesType[]>
  initialItems?: SearchValuesType[]
  onSelectedValueChanged?: (selectedValue: SearchValuesType) => void
  selectItemPlaceholder?: string
  searchItemsPlaceholder?: string
  noItemPlaceholder?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  onSearch,
  initialItems = [],
  onSelectedValueChanged = () => {},
  selectItemPlaceholder = 'Select an item',
  searchItemsPlaceholder = 'Search items...',
  noItemPlaceholder = 'No item found',
  className = '',
  disabled = false
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<SearchValuesType | null>(null)
  const [items, setItems] = useState(initialItems)

  const searchValue = useDebouncedCallback(
    useCallback(async (val) => {
      const searchResults = await onSearch(val)
      setItems(searchResults)
    }, []),
    700,
    { maxWait: 2000 }
  )

  const popOverStyles = {
    width: "var(--radix-popover-trigger-width)",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200] justify-between', className)}
          disabled={disabled}
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
            onValueChange={(e) => searchValue(e)}
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
}