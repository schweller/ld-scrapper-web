import games from "../../public/games-small.json"

// the scrapper is messing parent attribute :D
// TODO: review this and pass a meaningful name
// instead of "parent"
export type Game = {
    Id: number;
    Name: string;
    Path: string;
    Body: string;
    parent: number;
    Meta: Record<string, string>;
}

export async function getGames(): Promise<Array<Game>> {
    return [...games]
}
