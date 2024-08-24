import { z } from 'zod';

const envs = {
    api_url: z.string().parse(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080')
};

export default envs;
