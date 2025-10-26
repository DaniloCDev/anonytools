import { dataImpulseClient } from './client';

export async function changePasswordExternalApi(userIdProxy :number ): Promise<any> {
    let payload = {
    subuser_id: userIdProxy,
}
    const { data } = await dataImpulseClient.post('/reseller/sub-user/reset-password', payload);
   // console.log(data!.password)
    return data;
}
