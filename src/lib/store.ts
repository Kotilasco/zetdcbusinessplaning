import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/features/counter/counterSlice'
import applicationReducer from '@/features/application/applicationSlice'
import revalidateReducer from '@/features/application/revalidate'

export const makeStore = () => {
    return configureStore({
        reducer: {
            counter: counterReducer,
            application: applicationReducer,
            revalidating: revalidateReducer
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']