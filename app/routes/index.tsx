import { json } from "@remix-run/node"
import { useLoaderData  } from "@remix-run/react"
import { styled } from "@stitches/react"
import { violet } from "@radix-ui/colors"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { getGames } from "~/models/game.server"

type LoaderData = {
    games: Awaited<ReturnType<typeof getGames>>;
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
    color: 'white'
})
const Link = styled('a', {
    color: 'white'
})

export const loader = async () => {
    return json<LoaderData>({
        games: await getGames()
    })
}

export default function Index() {
    const { games } = useLoaderData() as LoaderData;
    return (
        <Box css={{ width: '100%', maxWidth: 300, margin: '0 15px' }}>
            <Text css={{ fontWeight: 500 }}>Ludum Dare Compo Games</Text>
            <Text>A list of LD Compo games entry with their open-source links.</Text>
            <StyledSeparator css={{ margin: '15px 0' }} />
            <List css={{margin: '30px 0'}}>
                {
                    games.map((game) => {
                        const meta = Object.values(game.Meta)

                        return (
                            <ListItem key={game.Id}>
                                <Heading>{game.Name}</Heading>
                                <Link href={`${ldRootUrl}${game.Path}`}>Ludum Dare link</Link>
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
