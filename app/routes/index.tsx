import { json } from "@remix-run/node"
import { useLoaderData  } from "@remix-run/react"
import { createStitches } from "@stitches/react"
import { violet, blackA, mauve, green, sand, amber, amberDark, sandDark } from "@radix-ui/colors"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

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
  

const StyledSeparator = styled(SeparatorPrimitive.Root, {
    backgroundColor: violet.violet6,
    '&[data-orientation=horizontal]': { height: 1, width: '100%' },
    '&[data-orientation=vertical]': { height: '100%', width: 1 },
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
    width: '100%'
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

const gameFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    return true
}

export default function Index() {
    const { games, events, languages } = useLoaderData() as LoaderData;
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [languageFilter, setLanguageFilter] = useState('Select a language')

    const defaultColumns: ColumnDef<Game>[] = [
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
                console.log(value)
                // console.log(row.getValue(columnId))
                const kv = row.getValue(columnId)
                if (kv) {
                    if (kv[value]) {
                        console.log(kv)
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            }
        }
    ]

    // const columns = useMemo<ColumnDef<Game>[]>(
    //     () => [
    //         columnHelper.accessor('firstName'),
    //         {
    //             accessorKey: 'Name',
    //             header: 'Name'
    //         }
    //     ],
    //     []
    // )

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

    const handleSelectChange = (e) => {
        madeWithColumn.setFilterValue(e.target.value)
        setLanguageFilter(e.target.value)
      };

    return (
        <Box css={{ width: '100%', margin: '0 15px'}}>
            <Box css={{ width: '100%', maxWidth: 300, margin: '0 auto 80px', textAlign: 'center' }}>
                <Text css={{ fontWeight: 700 }}>Ludum Dare Compo Games</Text>
                <Text>A list of LD Compo games entry with their open-source links.</Text>
            </Box>
            <select value={languageFilter} onChange={handleSelectChange}>
                <option value="">Select language</option>
                { filterValues.map((filter) => {
                    return (
                        <option value={filter}>
                            {filter}
                        </option>
                    )
                })}
            </select>
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
                            asc: ' 🔼',
                            desc: ' 🔽',
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
          </tbody>
        </Table>
            <List css={{margin: '30px 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gridTemplateRows: 'auto', gridGap: "16px"}}>
                {
                    games.map((game) => {
                        const meta = Object.values(game.Meta)
                        const eventName = events.find(x => x.Id === game.parent)?.Name
                        const languagesList = languages.find(x => x.Id === game.Id)?.Languages[0]

                        return (
                            <ListItem key={game.Id} variant="card">
                                <ListItemHeading>
                                    {eventName}
                                </ListItemHeading>
                                <Box css={{padding: 15}}>                                    
                                    <Heading className={darkTheme}>{game.Name}</Heading>
                                    <Flex css={{ height: 20, alignItems: 'center', display: "none" }}>
                                        <PillLink target="_blank" href={`${ldRootUrl}${game.Path}`}>
                                            <Box>
                                                Game link
                                            </Box>
                                            {/* Dirty hack to make the icon look a bit more aligned */}
                                            <Box css={{marginTop: "3px"}}>
                                                <ExternalLinkIcon/>
                                            </Box>
                                        </PillLink>
                                    </Flex>

                                    <Box css={{ margin: "15px 0 0"}}>
                                        <Box>
                                            Made with
                                        </Box>
                                        <Flex css={{ margin: "10px 0 0", flexFlow: "wrap"}}>
                                            {
                                                languagesList &&
                                                Object.keys(languagesList).map((key, i) => (
                                                    <Tag css={{marginRight: 10}}>{key}</Tag>
                                                ))
                                            }
                                        </Flex>
                                    </Box>
                                    <List>
                                        {
                                            meta.map((link, id) => (
                                                <ListItem key={`${game.Id}-${id}`}  className="ellipsis">
                                                    <Link href={link}>
                                                        {link}
                                                    </Link>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Box>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Box>
    );
}
