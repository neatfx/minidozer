import { Action, ActionStatus } from './Dispatcher'

let suspenseQueue: Action[] = []

export function useSuspense(): [(action: Action, destroy?: boolean) => Action[]] {
    const suspend = (action: Action, destroy = false): Action[] => { 
        suspenseQueue = [...suspenseQueue].filter((item): boolean => item.createdAt !== action.createdAt)
        if(!destroy){
            if(action.status === ActionStatus.PENDING) {
                suspenseQueue.push({
                    type: action.type,
                    status: action.status,
                    createdAt: action.createdAt
                })

            }
            if(action.status === ActionStatus.SUCCESS && action.response) {
                suspenseQueue.push({
                    type: action.type,
                    status: action.status,
                    response: action.response,
                    createdAt: action.createdAt
                })
            }
            if(action.status === ActionStatus.FAILED) {
                suspenseQueue.push({
                    type: action.type,
                    status: action.status,
                    failure: action.failure,
                    createdAt: action.createdAt
                })
            }
        }

        return suspenseQueue
    }

    return [suspend]
}