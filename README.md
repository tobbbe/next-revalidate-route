# next-reavalidate-route

Tired of writing Next.js revalidate endpoint every time? Use next-reavalidate-route! It generates a [Next.js route handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) that you can use to revalidate paths and tags through query parameters. Optional allows you to protect it with Authorization header.

## Setup

1. `npm i next-revalidate-route`
2. Create a route `app/revalidate/route.ts`
3. Create the handler

```js
import { nextRevalidateRoute } from 'next-revalidate-route'

// Send GET request to /revalidate?tags=one,two&paths=/blog/[slug],/route
// (with Authorization header) to revalidate
export async function GET(req: NextRequest) {
  return nextRevalidateRoute(req, 'your_secret')
}
```

## Examples

```zsh
curl -H "Authorization: your_secret" https://example.com/revalidate?tags=one,two,three&paths=/about,/blog/[slug],/route
```

```js
fetch('https://example.com/revalidate?tags=one,two,three&paths=/about,/blog/[slug],/route', {
  headers: {
    Authorization: 'your_secret',
  },
})
```
