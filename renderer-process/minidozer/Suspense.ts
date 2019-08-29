import { Action, Status } from './Dispatcher'

let suspenseQueue: Status[] = []

export function useSuspense(): [(action: Action, destroy?: boolean) => Status[]] {
    const suspend = (action: Action, destroy: boolean = false): Status[] => { 
        suspenseQueue = [...suspenseQueue].filter((item): boolean => item.createdAt !== action.createdAt)
        if(!destroy){
            if(action.status === 'PENDING') {
                suspenseQueue.push({
                    type: action.type,
                    createdAt: action.createdAt
                })

            }
            if(action.status === 'SUCCESS' && action.response) {
                suspenseQueue.push({
                    type: action.type,
                    response: action.response,
                    createdAt: action.createdAt
                })
            }
            if(action.status === 'FAILED') {
                suspenseQueue.push({
                    type: action.type,
                    failure: action.failure,
                    createdAt: action.createdAt
                })
            }
        }

        return suspenseQueue
    }

    return [suspend]
}