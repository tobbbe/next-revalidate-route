import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

type NextRevalidateRouteOptions = {
  auth?: string | (() => Promise<boolean>)
  trustLocalhost?: boolean
}

export async function nextRevalidateRoute(req: NextRequest, options?: NextRevalidateRouteOptions) {
  let trustLocalhost = options?.trustLocalhost === true

  if (
    !options?.auth ||
    (process.env.NODE_ENV === 'development' && trustLocalhost) ||
    (typeof options?.auth === 'string' && req.headers.get('Authorization') === options?.auth) ||
    (typeof options?.auth === 'function' && (await options?.auth()))
  ) {
    return revalidate(req)
  }

  return NextResponse.json({}, { status: 401 })
}

function revalidate(req: NextRequest) {
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
