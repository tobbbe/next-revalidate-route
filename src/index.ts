import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function nextRevalidateRoute(req: NextRequest, secret?: string) {
  if (
    process.env.NODE_ENV !== 'development' &&
    secret &&
    req.headers.get('Authorization') !== secret
  ) {
    return NextResponse.json({}, { status: 401 })
  }

  const revalidated: { param: RevalidateParam; value: string }[] = []

  for (const item of [
    ...getSearchParamValues(req, 'paths'),
    ...getSearchParamValues(req, 'tags'),
  ]) {
    if (item.param === 'paths') {
      const path = !item.value.startsWith('/') ? `/${item.value}` : item.value
      revalidatePath(path)
    } else {
      revalidateTag(item.value)
    }

    revalidated.push(item)
  }

  if (revalidated.length > 0) {
    return NextResponse.json({
      message: '🚨 The invalidation only happens when the path is visited next time',
      revalidated: revalidated.reduce<{ paths: string[]; tags: string[] }>(
        (acc, item) => {
          acc[item.param].push(item.value)
          return acc
        },
        { paths: [], tags: [] }
      ),
    })
  }

  return NextResponse.json({ error: 'No path or tag specified' })
}

function getSearchParamValues(req: NextRequest, param: RevalidateParam) {
  return (
    req.nextUrl.searchParams
      .get(param)
      ?.split(',')
      .map((x) => ({ param, value: x.trim() })) || []
  ).filter((item) => item.value !== '')
}

type RevalidateParam = 'paths' | 'tags'
