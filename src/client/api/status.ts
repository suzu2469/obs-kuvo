import { IAPIClient } from './client'

export async function checkClawlerStatus(client: IAPIClient): Promise<boolean> {
    return await client.get<boolean>('/api/status')
}
