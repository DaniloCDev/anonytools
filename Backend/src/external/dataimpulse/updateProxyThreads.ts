import { dataImpulseClient } from './client';

export async function changeProxyThreads(userIdProxy: number, threads: number): Promise<any> {
    let payload = {
        subuser_id: userIdProxy,
        threads: threads,
    }
    const { data } = await dataImpulseClient.post('/reseller/sub-user/update', payload);
    // console.log(data!.password)
    return data;
}
