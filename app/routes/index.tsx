import { json } from "@remix-run/node"
import { useLoaderData  } from "@remix-run/react"
import { styled } from "@stitches/react"
import { violet } from "@radix-ui/colors"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { getGames } from "~/models/game.server"
import { getEvents } from "~/models/event.server"

type LoaderData = {
    games: Awaited<ReturnType<typeof getGames>>;
    events: Awaited<ReturnType<typeof getEvents>>;
}

const ldRootUrl = "https://ldjam.com/"

const StyledSeparator = styled(SeparatorPrimitive.Root, {
    backgroundColor: violet.violet6,
    '&[data-orientation=horizontal]': { height: 1, width: '100%' },
    '&[data-orientation=vertical]': { height: '100%', width: 1 },
});

const Box = styled('div', {});
const Flex = styled('div', { display: 'flex' });
const Text = styled('div', {
    color: 'white',
    fontSize: 15,
    lineHeight: '20px',
});

const List = styled('ul', {
    listStyle: "none"
})
const ListItem = styled('li', {
    margin: '15px 0'
})
const Heading = styled('h2', {
    color: 'white',
    margin: "0 0 5px 0"
})

const Subheading = styled('h3', {
    color: 'white',
    fontWeight: 300,
})
const Link = styled('a', {
    color: 'white'
})

export const loader = async () => {
    return json<LoaderData>({
        games: await getGames(),
        events: await getEvents(),
    })
}

export default function Index() {
    const { games, events } = useLoaderData() as LoaderData;
    return (
        <Box css={{ width: '100%', margin: '0 15px'}}>
            <Box css={{ width: '100%', maxWidth: 300, margin: '0 15px' }}>
                <Text css={{ fontWeight: 500 }}>Ludum Dare Compo Games</Text>
                <Text>A list of LD Compo games entry with their open-source links.</Text>
                <StyledSeparator css={{ margin: '15px 0' }} />
            </Box>
            <List css={{margin: '30px 15px', display: 'grid', gridTemplateColumns: '33% 33% 33%', gridTemplateRows: 'auto'}}>
                {
                    games.map((game) => {
                        const meta = Object.values(game.Meta)
                        const eventName = events.find(x => x.Id === game.parent)?.Name
                        return (
                            <ListItem key={game.Id}>
                                <Heading>{game.Name}</Heading>
                                <Flex css={{ height: 20, alignItems: 'center' }}>
                                    <Subheading>{eventName}</Subheading>
                                    <StyledSeparator decorative orientation="vertical" css={{ margin: '0 15px' }} />
                                    <Link target="_blank" href={`${ldRootUrl}${game.Path}`} css={{ display: 'flex', height: 20, alignItems: 'center' }}>
                                        <span>Game link</span>
                                        <ExternalLinkIcon/>
                                    </Link>
                                </Flex>
                                <List>
                                    {
                                        meta.map((link) => (
                                            <ListItem key={`${game.Id}-${link}`}>
                                                <Link href={link}>
                                                    {link}
                                                </Link>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Box>
    );
}
