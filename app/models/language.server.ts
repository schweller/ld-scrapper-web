import languages from "../../public/languages.json"

type LanguagesMap<T extends string> = {
    [language in T]: number
} 

type Language = {
    Id: number;
    Languages: LanguagesMap<string>[]
}

export async function getLanguages(): Promise<Array<Language>> {
    return [...languages]
}
