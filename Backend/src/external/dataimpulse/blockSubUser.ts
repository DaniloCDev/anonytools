import { dataImpulseClient } from './client';

export async function blockSubUser(idUser: number, status: boolean): Promise<any> {
    let payload = {
        subuser_id: idUser,
        blocked: status
    }
    const { data } = await dataImpulseClient.post('reseller/sub-user/set-blocked', payload);
    console.log(data)
    return data;
}
