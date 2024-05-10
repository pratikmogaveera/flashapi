import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { env } from 'hono/adapter'
import { cors } from 'hono/cors'
import { Redis } from '@upstash/redis/cloudflare'

export const runtime = "edge"
export const preferredRegion = ["sin1", "bom1", "gru1"];

type EnvConfig = {
    UPSTASH_REDIS_REST_URL: string,
    UPSTASH_REDIS_REST_TOKEN: string,
}

const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/search', async (ctx) => {
    try {
        const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<EnvConfig>(ctx)
        const redis = new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN
        })

        // For performance metric
        const start = performance.now()

        const results = []

        const query = ctx.req.query("q")?.toUpperCase()
        if (!query) return ctx.json({ message: "Invalid query." }, { status: 400 })

        const rank = await redis.zrank('terms', query)
        if (rank !== null && rank != undefined) {
            const tempRes = await redis.zrange<string[]>('terms', rank, rank + 100)

            for (const res of tempRes) {
                if (!res.startsWith(query)) break;

                if (res.endsWith('*')) {
                    results.push(res.substring(0, res.length - 1))
                }
            }
        }

        // For performance metric
        const end = performance.now()

        return ctx.json({ results, duration: end - start })
    } catch (error) {
        return ctx.json({ results: [], duration: -1 }, { status: 500 })
    }
})



// export default app 

// To bypass Next.js compiler if deploying to CloudFlare Workeres, 
export default app as never

// If you want to deploy to vercel.
export const GET = handle(app)