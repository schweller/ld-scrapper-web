import games from "../../public/games-small.json"

type Game = {
    Id: number;
    Name: string;
    Path: string;
    Body: string;
    Meta: Record<string, string>;
}

export async function getGames(): Promise<Array<Game>> {
    return [...games]
}
