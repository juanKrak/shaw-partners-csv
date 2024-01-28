import React, { useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import {User} from '../types'
import { useStore } from '../App';

export function Query() {
    const parent = useRef(null);
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | "error">('idle');
    const [formMessage, setFormMessage] = useState<null | string>(null);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [requestid, setRequestId] = useState(0)
    const queryFlag = useStore(state=>state.queryFlag)

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (parent.current) {
            autoAnimate(parent.current);
        }
    }, [parent]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(query);
          }, 500);
          return () => clearTimeout(timeoutId);
    }, [query, 500]);

    useEffect(() => {
        getUsers(query, requestid)
    }, [debouncedQuery, queryFlag])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        getUsers(query, requestid)
    };

    const getUsers = async (query: string, id: number) => {
        setFormMessage(null)
        setRequestId(i => i + 1)
        setFormStatus('submitting')
        let res = await fetch((import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000") + '/api/users?'+new URLSearchParams({q: query}), {
            method: 'get',
        })
        if (requestid!== id) return
        setFormStatus(res.ok?"idle":"error")
        let json = await res.json()
        if (json.message) setFormMessage(String(json.message))
        setUsers(json.data as User[])
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormMessage(null)
        setFormStatus('submitting')
        setQuery(e.target.value);
    };

    return (
        <>
        <section className='max-w-6xl mx-auto w-full mb-16 px-2 lg:px-0'>
            <form 
                onSubmit={handleSubmit}
                data-status={formStatus}
                className='border-2 border-black group rounded py-4 px-4 lg:px-8 gap-8 flex flex-col pt-20 lg:py-4 lg:flex-row shadow-lg relative'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 absolute top-6 left-4 lg:left-6 z-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input 
                    type="text"
                    className="absolute lg:placeholder:text-base placeholder:text-sm inset-0 pl-16 lg:pl-20 pr-8 py-4 w-full h-20 lg:h-auto rounded font-medium text-lg"
                    onChange={handleInputChange}
                        value={query}
                        placeholder="Input what you're looking for."
                />
                <button
                disabled={formStatus === "submitting"}
                className='relative w-full lg:w-fit group-submitting:w-fit ml-auto text-xl group-error:whitespace-nowrap group-error:shadow-none group-error:translate-y-0 group-success:shadow-none group-success:translate-y-0 group-error:bg-red-400 flex items-center gap-4 justify-center text-start group-success:text-black group-error:text-black font-semibold tracking-tight bg-violet-600 hover:bg-black transition-all shadow hover:shadow-lg hover:-translate-y-1 text-white px-12 group-submitting:px-3 rounded py-3'
                type='submit'
            >
                <svg className='group-submitting:inline hidden animate-spin h-8 w-8' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z"></path></svg>
                <svg className='group-error:inline hidden h-8 w-8' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                <span className="inline group-submitting:hidden">{formMessage || "Search"}</span>
            </button>
            </form>
            </section>
            <section ref={parent} className="max-w-6xl mx-auto w-full grid lg:grid-cols-3 gap-y-6 gap-x-4 h-fit pb-64 lg:pb-96 px-2 lg:px-0">
                {formStatus === "submitting" ? Array.from({ length: Math.floor((Math.random() * 5)+1) }).map((_, index) => <CardLoader key={index} />) :
                    (
                        users?.length ?
                        users.map(user => <Card key={user.id} user={user} />)
                        :<div className="col-span-3 text-center grid place-content-center h-64">
                        <h1 className="text-xl font-bold">We are really sorry.</h1>
                        <h2 className="text-gray-600 underline font-medium max-w-64">We couldn't find what you were looking for.</h2>
                    </div>
                    )
                }
            </section>
        </>
    );
}

type CardProps = {
    user: User
}

function Card({ user }: CardProps) {
    return <article className="border bg-white group hover:-translate-y-1 hover:shadow-lg transition-all border-black shadow rounded px-6 pt-8 pb-10 relative">
        <h1 className="text-xl lg:text-2xl font-bold underline-offset-2 mb-10">{user.name}</h1>
        <div className="text-sm font-semibold text-gray-800 mb-6">
            <address className='mb-2 flex gap-1 not-italic'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 min-w-6 fill-violet-600 stroke-violet-600">
  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
</svg>

                <span className='pt-0.5'>{user.city}, {user.country}</span>
            </address>
            <h2 className="flex gap-1 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 min-w-6 fill-violet-600 stroke-violet-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
                <span className='pt-0.5 max-w-xs line-clamp-2'>{user.favorite_sport}</span>
            </h2>
            
        </div>
        <div className="flex justify-between">
            <span className="text-xs font-bold text-gray-400">{user.id}</span>
            <span className="text-xs font-bold text-gray-400">{user.created_at}</span>
        </div>
    </article>
}

function CardLoader() {
    return <article className="border bg-white group hover:-translate-y-1 hover:shadow-lg transition-all border-black shadow rounded px-6 pt-8 pb-10 relative">
    <h1 className="text-xl font-semibold animate-pulse bg-gray-400 rounded-full w-64 h-6 underline-offset-2 mb-10"></h1>
    <div className="text-sm font-semibold text-gray-800 mb-4">
        <address className='mb-2 flex gap-1 not-italic'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 min-w-6 fill-violet-600 stroke-violet-600">
<path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
</svg>

            <span className='mt-0.5 w-48 ml-1 h-5 bg-gray-300 animate-pulse rounded-full'></span>
        </address>
        <h2 className="flex gap-1 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 min-w-6 fill-violet-600 stroke-violet-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
            <span className='max-w-xs bg-gray-300 pb-16 animate-pulse h-5 w-64 ml-1 mt-0.5 rounded-xl line-clamp-2'></span>
        </h2>
        
    </div>
        <span className="text-xs absolute font-bold bottom-4 right-4 text-gray-400 underline"></span>
        <span className="text-xs absolute font-bold bottom-4 left-4 text-gray-400 underline"></span>
</article>
}