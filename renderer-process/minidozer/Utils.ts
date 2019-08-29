export class Tracer {
    private readonly logger: Console = console
    private readonly prefix: string = ''

    public constructor(prefix: string) {
        this.prefix = prefix
    }
   
    public log(...params: unknown[]): void {
        if(process.env.NODE_ENV === 'development'){
            const head = params.slice(0, params.length - 1)
            this.logger.log(`[ ${this.prefix} > ${head.join(' > ')} ]`, params.pop())
        }
    }
}