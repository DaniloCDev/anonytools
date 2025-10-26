import { dataImpulseClient } from './client';

export async function addToBalance(userIdProxy: number, traffic: number): Promise<any> {
    let payload = {
        subuser_id: userIdProxy,
        traffic: traffic,
    }
    const { data } = await dataImpulseClient.post('reseller/sub-user/balance/add', payload);
    console.log(data,payload)
    return data;
}
