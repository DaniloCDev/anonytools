import { dataImpulseClient } from './client';

export async function createSubUser(idUser: string): Promise<any> {
    let payload = {
        subuser_id: idUser
    }
    const { data } = await dataImpulseClient.post('/reseller/sub-user/delete', payload);
    return data;
}
