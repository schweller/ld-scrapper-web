import { json } from "@remix-run/node"
import { useLoaderData  } from "@remix-run/react"
import { createStitches } from "@stitches/react"
import { violet, blackA, mauve, green, sand, amber, amberDark, sandDark } from "@radix-ui/colors"
import { ExternalLinkIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import * as SelectPrimitive from '@radix-ui/react-select';

import { getGames, Game } from "~/models/game.server"
import { getEvents } from "~/models/event.server"
import { getLanguages } from "~/models/language.server"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    FilterFn,
  } from '@tanstack/react-table'
import { useVirtual } from 'react-virtual'
import { SyntheticEvent, useMemo, useRef, useState } from "react"

type LoaderData = {
    games: Awaited<ReturnType<typeof getGames>>;
    events: Awaited<ReturnType<typeof getEvents>>;
    languages: Awaited<ReturnType<typeof getLanguages>>;
}

const ldRootUrl = "https://ldjam.com/"

const { styled, createTheme } = createStitches({
    theme: {
      colors: {
        ...amber,
        ...sand,
      },
    },
  });
  
  const darkTheme = createTheme({
    colors: {
      ...amberDark,
      ...sandDark,
    },
  });

const Box = styled('div', {});
const Flex = styled('div', { display: 'flex' });
const Text = styled('div', {
    color: '$amber11',
    fontSize: 15,
    lineHeight: '20px',
});

const List = styled('ul', {
    listStyle: "none"
})
const ListItem = styled('li', {
    margin: '15px 0',
    variants: {
        variant: {
            default: {},
            card: {
                border: '1px solid',
                borderColor: "$amber7",
                borderRadius: 10,
            }
        }
    },

    defaultVariants: {
        variant: 'default'
    }
})

const ListItemHeading = styled('div', {
    padding: 15,
    backgroundColor: '$amber6'
})

const Heading = styled('h2', {
    color: '$amber11',
    margin: "0 0 5px 0"
})

const Subheading = styled('h3', {
    color: '$amber11',
    fontSize: 16,
    fontWeight: 300,
})

const Link = styled('a', {
    color: '$amber11',
})

const PillLink = styled('a', {
    display: 'flex',
    color: '$amber11',
    width: 120,
    height: 20,
    fontWeight: 700,
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    background: '$amber1',
    border: '1px solid black',
    borderColor: '$amber7',
    borderRadius: 20,
    textDecoration: 'none',
    '&:hover': {
        background: '$amber5'
    }
})

const Tag = styled('div', {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    border: "1px solid black",
    padding: '0 15px',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 700,
    height: 20,
  
    variants: {
      variant: {
        violet: {
          color: '$sand12',
          backgroundColor: '$amber4',
          borderColor: '$amber10',
        },
      },
    },
  
    defaultVariants: {
      variant: 'violet',
    },
});

const Table = styled('table', {
    borderSpacing: 0,
    border: '1px solid',
    borderColor: '$amber10',
    borderRadius: 11,
    width: '100%',
    tableLayout: 'fixed'
})

const TableHeading = styled('th', {
    width: 60,
    padding: 10,
    backgroundColor: '$amber6',
    textAlign: 'left',
    color: '$amber11',
    '&:first-child': {
        borderTopLeftRadius: 10,
    },
    '&:last-child': {
        borderTopRightRadius: 10,
    },
})

const TableRow = styled('tr', {
    border: '1px solid',
    borderColor: '$amber10',
    '&:hover': {
        background: '$amber3'
    },
    '&:last-child > td': {
        borderBottom: 'none',
    },
})

const TableCell = styled('td', {
    padding: 10,
    borderBottom: '1px solid',
    borderBottomColor: '$amber10'
})

export const loader = async () => {
    return json<LoaderData>({
        games: await getGames(),
        events: await getEvents(),
        languages: await getLanguages()
    })
}

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: '0 15px',
    fontSize: 13,
    lineHeight: 1,
    height: 35,
    gap: 5,
    backgroundColor: '$amber1',
    color: '$amber11',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '$amber7',
    // boxShadow: `0 2px 10px ${blackA.blackA7}`,
    marginBottom: 20,
    '&:hover': { backgroundColor: '$amber5' },
    '&:focus': { boxShadow: `0 0 0 2px black` },
    '&[data-placeholder]': { color: '$amber11' },
  });
  
  const StyledIcon = styled(SelectPrimitive.SelectIcon, {
    color: '$amber11',
  });
  
  const StyledContent = styled(SelectPrimitive.Content, {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow:
      '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  });
  
  const StyledViewport = styled(SelectPrimitive.Viewport, {
    padding: 5,
  });

  const StyledItem = styled(SelectPrimitive.Item, {
    all: 'unset',
    fontSize: 13,
    lineHeight: 1,
    color: '$amber11',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    height: 25,
    padding: '0 35px 0 25px',
    position: 'relative',
    userSelect: 'none',
  
    '&[data-disabled]': {
      color: mauve.mauve8,
      pointerEvents: 'none',
    },
  
    '&[data-highlighted]': {
      backgroundColor: '$amber9',
      color: '$amber3',
    },
  });
  
  const StyledLabel = styled(SelectPrimitive.Label, {
    padding: '0 25px',
    fontSize: 12,
    lineHeight: '25px',
    color: mauve.mauve11,
  });

  function Content({ children, ...props }) {
    return (
      <SelectPrimitive.Portal>
        <StyledContent {...props}>{children}</StyledContent>
      </SelectPrimitive.Portal>
    );
  }

  const scrollButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    backgroundColor: 'white',
    color: violet.violet11,
    cursor: 'default',
  };
  const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
    position: 'absolute',
    left: 0,
    width: 25,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles);
  
  const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles);

const Select = SelectPrimitive.Root;
const SelectTrigger = StyledTrigger;
const SelectValue = SelectPrimitive.Value;
const SelectIcon = StyledIcon;
const SelectContent = Content;
const SelectViewport = StyledViewport;
const SelectGroup = SelectPrimitive.Group;
const SelectItem = StyledItem;
const SelectItemText = SelectPrimitive.ItemText;
const SelectItemIndicator = StyledItemIndicator;
const SelectLabel = StyledLabel;
const SelectScrollUpButton = StyledScrollUpButton;
const SelectScrollDownButton = StyledScrollDownButton;

const SelectDemo = ({data, handler}) => (
    <Box>
      <Select onValueChange={handler}>
        <SelectTrigger aria-label="Food">
          <SelectValue placeholder="Select a language" />
          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectGroup>
                {data.map((lang: string) => {
                    return (
                    <SelectItem value={lang}>
                        <SelectItemText>{lang}</SelectItemText>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                      </SelectItem>
                    )
                })}
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </Select>
    </Box>
  );

export default function Index() {
    const { games, events, languages } = useLoaderData() as LoaderData;
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [languageFilter, setLanguageFilter] = useState('Select a language')

    const defaultColumns = useMemo<ColumnDef<Game>[]>(
        () => [
            {
                accessorKey: 'Name',
                header: 'Name'
            },
            {
                accessorFn: (row, i) => {
                    return `${ldRootUrl}${row.Path}`
                },
                cell: (data) => {
                    return <PillLink target="_blank" href={data.getValue() as string}>Game Link</PillLink>
                },
                header: 'Link'
            },
            {
                accessorFn: (row, i) => {
                    const languagesList = languages.find(x => x.Id === row.Id)?.Languages[0]
                    return languagesList
                },
                cell: (data) => {
                    const list = data.getValue() as Object
                    return !list ? null : Object.keys(list).map((key, i) => (
                        <Tag css={{marginRight: 10}}>{key}</Tag>
                    ))
                },
                size: 380,
                header: 'Made with',
                enableColumnFilter: true,
                filterFn: (row, columnId, value: string) => {
                    // console.log(row.getValue(columnId))
                    const kv = row.getValue(columnId)
                    if (kv) {
                        if (kv[value]) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                }
            },
            {
                accessorFn: (row) => {
                    const event = events.find(x => {
                        return x.Id === row.parent
                    })
                    return event?.Name
                },
                header: 'Event',
                cell: (data) => {
                    return <>{ data.getValue()}</>
                }
            }
        ],
        [] 
    ) 

    let filterValues:string[] = []
    languages.forEach((obj) => {
        const innerLang = obj.Languages[0]
        Object.keys(innerLang).forEach((key) => {
            if (filterValues.indexOf(key) === -1) {
                filterValues = [key, ...filterValues]
            }
        })
    })

    const table = useReactTable({
        data: games,
        columns: defaultColumns,
        enableColumnFilters: true,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
    })

    const tableContainerRef = useRef<HTMLDivElement>(null)
    const { rows } = table.getRowModel()
    const rowVirtualizer = useVirtual({
      parentRef: tableContainerRef,
      size: rows.length,
      overscan: 100,
    })

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer
    const madeWithColumn = table.getColumn("Made with")

    const handleSelectChange = (value) => {
        madeWithColumn.setFilterValue(value)
        setLanguageFilter(value)
      };

    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const paddingBottom =
    virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0

    return (
        <Box css={{ width: '100%', margin: '0 15px'}}>
            <Box css={{ width: '100%', maxWidth: 300, margin: '0 auto 80px', textAlign: 'center' }}>
                <Text css={{ fontWeight: 700 }}>Ludum Dare Compo Games</Text>
                <Text>A list of LD Compo games entry with their open-source links.</Text>
            </Box>
            <SelectDemo data={filterValues} handler={handleSelectChange} />
            <Box css={{overflow: 'auto', height: 500}} ref={tableContainerRef}>
                <Table style={{borderSpacing: 0}}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                    return (
                        <TableHeading
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                        >
                        {header.isPlaceholder ? null : (
                            <div
                            {...{
                                className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                                onClick: header.column.getToggleSortingHandler(),
                            }}
                            >
                            {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                            {{
                                asc: ' ????',
                                desc: ' ????',
                            }[header.column.getIsSorted() as string] ?? null}
                            </div>
                        )}
                        </TableHeading>
                    )
                    })}
                </tr>
                ))}
                </thead>
                <tbody>
                {paddingTop > 0 && (
                    <tr>
                        <td style={{ height: `${paddingTop}px` }} />
                    </tr>
                )}                  
                {virtualRows.map(virtualRow => {
                    const row = rows[virtualRow.index] as Row<Game>
                    return (
                        <TableRow key={row.id}>
                        {row.getVisibleCells().map(cell => {
                            return (
                            <TableCell key={cell.id}>
                                {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                                )}
                            </TableCell>
                            )
                        })}
                        </TableRow>
                    )
                    })}
                    {paddingBottom > 0 && (
                    <tr>
                        <td style={{ height: `${paddingBottom}px` }} />
                    </tr>
                    )}                    
                </tbody>
                </Table>
            </Box>
        </Box>
    );
}
