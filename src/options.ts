export type Options = {
    addons: Addon[]
}

export type Addon = {
    bundle(): null | { type: 'src' | 'content' | 'tag', content: 'string' }
}