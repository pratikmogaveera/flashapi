"use client"

import { Command, CommandInput } from '@/components/ui/command';
import { motion, useAnimate } from 'framer-motion';
import { useEffect } from 'react';

export type Results = {
    results: string[],
    duration: number
}

export const runtime = "edge"

export default function Home() {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        const handleAnimate = async () => {
            await animate('#title', { opacity: 1, y: 0 }, { duration: 0.25, type: "spring", bounce: 0.4 })
            await animate('path', { pathLength: 1, color: '#fff' }, { duration: 0.3 })
            await animate('path', { strokeWidth: 2 }, { delay: 0.1, duration: 0.1 })
            await animate('path', { fill: '#fff' }, { duration: 0.05 })
            await animate('path', { fill: 'transparent' }, { duration: 0.01 })
            await animate('path', { strokeWidth: 0.5 }, { duration: 0.1 })
        }

        handleAnimate()

    }, [animate])

    return (
        <main className="h-svh transition-all bg-background text-foreground w-full p-4 md:p-8 lg:p-12">
            <div className="flex flex-col gap-4 items-center pt-40 pb-12 lg:pt-32 lg:pb-16">
                <div ref={scope} className='flex items-center gap-2'>
                    <motion.h1 id="title" initial={{ opacity: 0, y: -100 }} className="text-5xl lg:text-7xl font-extrabold">
                        FastAPI
                    </motion.h1>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={0.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]"
                        >
                            <motion.path
                                initial={{ pathLength: 0, color: '#000' }}
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                            >
                            </motion.path>
                        </svg>
                    </span>

                </div>

                <p className='text-center text-[0.8rem] md:text-sm leading-none text-muted-foreground'>
                    <span>High-performance API built with Hono, Redis, and Workers.</span>
                    <br />
                    <span className='p-4'>Find any country below and receive your response instantly, measured in milliseconds.</span>
                </p>

                <div className='max-w-md w-full mt-8'>
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder='Search a country names...' className='text-[18px]' />
                    </Command>
                </div>
            </div>
        </main >
    );
}
