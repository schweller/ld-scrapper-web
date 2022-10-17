import { json } from "@remix-run/node"
import { useLoaderData  } from "@remix-run/react"
import { createStitches } from "@stitches/react"
import { violet, blackA, mauve, green, sand, amber, amberDark, sandDark } from "@radix-ui/colors"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { getGames } from "~/models/game.server"
import { getEvents } from "~/models/event.server"
import { getLanguages } from "~/models/language.server"

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
    height: 35,
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

export const loader = async () => {
    return json<LoaderData>({
        games: await getGames(),
        events: await getEvents(),
        languages: await getLanguages()
    })
}

export default function Index() {
    const { games, events, languages } = useLoaderData() as LoaderData;
    return (
        <Box css={{ width: '100%', margin: '0 15px'}}>
            <Box css={{ width: '100%', maxWidth: 300, margin: '0 auto', textAlign: 'center' }}>
                <Text css={{ fontWeight: 700 }}>Ludum Dare Compo Games</Text>
                <Text>A list of LD Compo games entry with their open-source links.</Text>
            </Box>
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
