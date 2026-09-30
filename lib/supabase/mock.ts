// Fallback client for local dev or when Supabase credentials are not provided
// Prevents unhandled server exceptions from crashing the application

export function createFallbackSupabaseClient() {
  const createMockBuilder = (defaultData: any[] = []) => {
    const targetObj: any = {
      then: (resolve: any, reject: any) =>
        Promise.resolve({ data: defaultData, count: defaultData?.length ?? 0, error: null }).then(resolve, reject),
      catch: (reject: any) =>
        Promise.resolve({ data: defaultData, count: defaultData?.length ?? 0, error: null }).catch(reject),
    }

    const handler: ProxyHandler<any> = {
      get(target, prop) {
        if (prop in target) {
          return target[prop]
        }
        if (prop === "single" || prop === "maybeSingle") {
          return () => Promise.resolve({ data: defaultData[0] || null, error: null })
        }
        return (..._args: any[]) => new Proxy(targetObj, handler)
      },
    }

    return new Proxy(targetObj, handler)
  }

  return {
    from: (_table: string) => createMockBuilder([]),
    channel: (_name: string) => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
    removeChannel: (_channel: any) => {},
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: (_bucket: string) => ({
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
        upload: async () => ({ data: null, error: null }),
      }),
    },
  } as any
}
