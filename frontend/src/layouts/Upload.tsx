import { useEffect, useRef, useState } from 'react'
import Dropzone from '../components/Dropzone.tsx'
import autoAnimate from '@formkit/auto-animate'
import { useStore } from '../App.tsx'

export function Upload() {
    const parent = useRef(null)
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [formMessage, setFormMessage] = useState<null | string>(null)
    const updateQuery = useStore(state=>state.updateQuery)

    useEffect(() => {
        if (parent.current) {
            autoAnimate(parent.current)
        }
    }, [parent])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormMessage(null)
        if (formStatus === "success") {
            setFormStatus('idle')
            return e.currentTarget.reset()
        } else {
            setFormStatus('submitting')
        }
        let form = new FormData(e.currentTarget)
        await new Promise((res) => {
            setTimeout(res, 1000)
        })
        

        let res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/files', {
            body: form,
            method: 'post',
        })

        setFormStatus(res.ok ? "success" : "error")
        if (res.ok) updateQuery()
        let json = await res.json()
        setFormMessage(String(json.message))
    }


    return <section className='max-w-6xl mx-auto w-full min-h-screen grid lg:grid-cols-2 mb-16 px-2 lg:px-0'>
    <div className='p-4 flex flex-col h-full justify-center'>
        <div className='pt-24 pb-32 lg:py-0 text-center lg:text-left'>
            <h1 className='text-4xl lg:text-6xl font-bold mb-8'>We love <span className="text-violet-600 drop-shadow-2xl">CSVs.</span></h1>
            <h2 className='lg:text-2xl leading-tight font-medium text-gray-600'>
                We are the chosen ones to handle<br /> that CSV,{' '}
                <span className='italic font-bold text-violet-500'>ain't that awesome!</span>
            </h2>
        </div>
    </div>
    <div className='flex flex-col h-full justify-center'>
        <form
            ref={parent}
            onSubmit={handleSubmit}
            data-status={formStatus}
            // data-status="submitting"
            className='border-2 border-black group success:from-violet-700 success:to-violet-400 success:bg-gradient-to-bl rounded pt-8 pb-10 px-4 lg:pt-12 lg:pb-16 lg:px-8 flex flex-col shadow-lg transition-all'
        >
            <h1 className='font-bold lg:text-2xl mb-10'>
                CSV Loading Form
            </h1>
                <div className='group-submitting:animate-pulse transition-all overflow-x-hidden relative'>
                    <div className="group-submitting:bg-gray-500 transition-all group-submitting:z-10 -z-10 absolute inset-0 rounded"></div>
                
                <div className='group-success:translate-x-full transition-all'>
                    <Dropzone key={String(formStatus==="success")} required={formStatus !== "success"} />
                </div>
            </div>
            <button
                disabled={formStatus === "submitting"}
                className='relative ml-auto mt-6 text-xl group-success:text-lg group-success:pb-10 group-error:pb-10 group-error:text-lg group-success:bg-transparent group-error:shadow-none group-error:translate-y-0 group-success:shadow-none group-success:translate-y-0 group-error:bg-red-400 flex items-center gap-4 justify-center text-start group-success:text-black group-error:text-black font-semibold tracking-tight bg-violet-600 hover:bg-black transition-all shadow hover:shadow-lg hover:-translate-y-1 text-white px-12 group-submitting:px-3 rounded py-3'
                type='submit'
            >
                <svg className='group-submitting:inline hidden animate-spin h-8 w-8' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z"></path></svg>
                <svg className='group-success:inline hidden h-8 w-8' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <svg className='group-error:inline hidden h-8 w-8' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                <span className="inline group-submitting:hidden">{formMessage || "Upload"}</span>
                <span className="hidden group-success:inline group-error:inline absolute text-sm font-bold bottom-3 right-12">Click to retry</span>
            </button>
        </form>
    </div>
</section>
}