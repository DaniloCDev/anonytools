import { dataImpulseClient } from './client';

export async function createSubUser(payloadLabel :string ): Promise<any> {
    let payload = {
    label: payloadLabel,
    threads: 400,
    pool_type: "residential",
    default_pool_parameters: {
        "countries": ["br"]
    }
}
    const { data } = await dataImpulseClient.post('/reseller/sub-user/create', payload);
    return data;
}
