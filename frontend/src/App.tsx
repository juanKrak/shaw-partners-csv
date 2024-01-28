import { Upload } from './layouts/Upload.tsx'
import { Query } from './layouts/Query.tsx'
import { create } from 'zustand'

interface storeState {
    queryFlag: boolean,
    updateQuery: () => void
}
export const useStore = create<storeState>((set) => ({
    queryFlag: false,
    updateQuery: ()=>set((state)=>({queryFlag: !state.queryFlag}))
}))

function App() {

    return (
        <main>
            <Upload/>
            <Query/>
        </main>
    )
}

export default App

