import { dataImpulseClient } from './client';

export async function changeProxyThreads(userIdProxy: number, threads: number, country:string): Promise<any> {
    let payload = {
        subuser_id: userIdProxy,
        threads: threads,
        default_pool_parameters: {
            countries: [country]
        },
    }
    const { data } = await dataImpulseClient.post('reseller/sub-user/update', payload);
    // console.log(data!.password)
    return data;
}
