import { dataImpulseClient } from './client';

export async function getUser(subId :Number ): Promise<any> {
    
    const { data } = await dataImpulseClient.get(`/reseller/sub-user/get?subuser_id=${subId}`);
    return data;
}
