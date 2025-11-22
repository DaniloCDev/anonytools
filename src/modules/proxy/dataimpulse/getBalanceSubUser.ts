import { dataImpulseClient } from './client';

export async function getBalanceUser(userIdProxy :number ): Promise<any> {

    const { data } = await dataImpulseClient.get(`/reseller/sub-user/balance/get?subuser_id=${userIdProxy}`);
    return data;
}
