import { dataImpulseClient } from './client';

export async function addToBalance(userIdProxy :number,traffic:number  ): Promise<any> {
    let payload = {
    subuser_id: userIdProxy,
    traffic: 100,
}
    const { data } = await dataImpulseClient.post('/sub-user/balance/add', payload);
    return data;
}
