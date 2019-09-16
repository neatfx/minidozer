export function log(prefix: string): Function {
    return (...params: unknown[]): void => {
        if(process.env.NODE_ENV === 'development'){
            const head = params.slice(0, params.length - 1)
            console.log(`[ ${prefix} > ${head.join(' > ')} ]`, params.pop())
        }
    }
}
