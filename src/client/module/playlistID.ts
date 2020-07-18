export function validatePlaylistURL(value: string): boolean {
    return /https:\/\/kuvo\.com\/playlist\/[1-9]+\/?$/.test(value)
}

export function getIDFromURL(value: string): string {
    const match = value.match(/https:\/\/kuvo\.com\/playlist\/([1-9]+)\/?/)
    const playlistID = match.groups[1]

    if (!playlistID) return ''
    return playlistID
}
