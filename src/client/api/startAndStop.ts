import { IAPIClient } from './client'

export async function start(client: IAPIClient): Promise<void> {
    await client.post('/api/start', {})
}

export async function stop(client: IAPIClient): Promise<void> {
    await client.post('/api/stop', {})
}
