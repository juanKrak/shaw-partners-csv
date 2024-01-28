import { Upload } from './layouts/Upload.tsx'
import { Query } from './layouts/Query.tsx'
import { create } from 'zustand'
import Logo from './components/Logo.tsx'

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
            <header className="max-w-6xl pt-4 px-4 lg:px-0 lg:py-16 absolute top-0 left-0 right-0 w-full mx-auto">
                <Logo/>
            </header>
            <Upload/>
            <Query/>
            <footer className='w-full bg-gray-800 text-gray-300 py-8 px-4 lg:px-0 lg:py-32 rounded-t-xl'>
                <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-3">
                    <Logo dark={true} />
                    <div className="my-4" />
                    <div>
                        <h1 className='text-lg lg:text-2xl font-medium mb-4'><span className='text-xl lg:text-3xl italic font-bold'>"</span>A carefully handcrafted product.<span className='text-xl lg:text-3xl italic font-bold'>"</span></h1>
                        <h2>By <a href="mailto:juan@krak.com.ar" className='text-violet-500 underline font-bold underline-offset-2'>Juan Rolon</a>. For <strong>Shawn & Partners.</strong></h2>
                    </div>
                </div>                    
            </footer>
        </main>
    )
}

export default App

