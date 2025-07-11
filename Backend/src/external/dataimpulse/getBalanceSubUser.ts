import { dataImpulseClient } from './client';

export async function getBalanceUser(userIdProxy :number ): Promise<any> {

    const { data } = await dataImpulseClient.get(`/sub-user/balance/get?subuser_id=440720`);
    return data;
}
