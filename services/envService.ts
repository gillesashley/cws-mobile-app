import { z } from "zod";

const envs = {
    // api_url: z.string().parse(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080')
    api_url: z.string().parse(process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api"),
    //api_url: z.string().parse(process.env.EXPO_PUBLIC_API_URL ?? 'campaignwithus.com/public/api')
};

export default envs;
