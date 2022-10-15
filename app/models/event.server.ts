import events from "../../public/events.json"

type Event = {
    Id: number;
    Name: string;
    Path: string;
    Body: string;
}

export async function getEvents(): Promise<Array<Event>> {
    return [...events]
}
