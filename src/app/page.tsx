"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type Results = {
    results: string[],
    duration: number
}

export const runtime = "edge"

export default function Home() {
    const [input, setInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<Results>()
    const debouncedInput = useDebounce(input)

    const title = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0, opacity: 1,
            transition: { type: "spring", bounce: 0.5, duration: 0.5 }
        }
    }

    const icon = {
        hidden: { pathLength: 0, color: "#000", },
        visible: {
            pathLength: 1, color: "#fff",
            transition: { delay: 0.2, duration: 1 }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!debouncedInput) return setSearchResults(undefined)

            const result = await fetch(`https://flashapi.flashapi.workers.dev/api/search?q=${debouncedInput}`)
            const data = await result.json() as Results
            setSearchResults(data)
        }

        fetchData()

    }, [debouncedInput])

    return (
        <main className="h-svh transition-all bg-background text-foreground w-full p-4 md:p-8 lg:p-12">
            <div className="flex flex-col gap-4 items-center pt-40 pb-12 lg:pt-32 lg:pb-16">
                <div className='flex items-center gap-2'>
                    <motion.h1 variants={title} initial="hidden" animate="visible" className="text-5xl lg:text-7xl font-extrabold">
                        FastAPI
                    </motion.h1>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-zap w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]">
                            <motion.path
                                variants={icon}
                                initial="hidden"
                                animate="visible"
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
                        <CommandInput value={input} onValueChange={setInput} placeholder='Search a country names...' className='text-[18px]' />
                        <CommandList className={`${searchResults?.results.length ? "block" : "hidden"} `}>
                            <ScrollArea className='w-full h-fit'>
                                {searchResults?.results.length === 0 ? <CommandEmpty>No results found.</CommandEmpty> : null}

                                {searchResults?.results.length
                                    ? <CommandGroup heading="Countries">
                                        {searchResults.results.map((result, index) => <CommandItem key={index} value={result} onSelect={setInput}>{result}</CommandItem>)}
                                    </CommandGroup>
                                    : null
                                }

                                <CommandSeparator />

                                {searchResults?.results.length ? <p className='px-3 pb-2 text-sm text-muted-foreground'>
                                    Found <span className='font-semibold'>{searchResults.results.length}</span> results in <span className='font-semibold'>{searchResults?.duration.toFixed(0)}</span>ms
                                </p> : null}
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </div>
            </div>
        </main >
    );
}
