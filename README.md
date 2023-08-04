# next-reavalidate-route

Tired of writing Next.js revalidate endpoint every time? Use next-reavalidate-route! It generates a [Next.js route handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) that you can use to revalidate paths and tags through query parameters. Optional allows you to protect it with Authorization header.

## Setup

1. `npm i next-revalidate-route`
2. Create a route `app/revalidate/route.ts`
3. Create the handler

```js
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { nextRevalidateRoute } from 'next-revalidate-route'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return nextRevalidateRoute(req, 'secret')
}
```

## Examples

```zsh
curl -H "Authorization: YOUR_TOKEN" https://example.com/revalidate?tags=one,two,three&paths=/about,/blog/[slug],/route
```

```js
fetch('https://example.com/revalidate?tags=one,two,three&paths=/about,/blog/[slug],/route', {
  headers: {
    Authorization: 'YOUR_TOKEN',
  },
})
```
