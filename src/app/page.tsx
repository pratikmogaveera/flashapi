"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDebounce } from '@/lib/hooks';

export type Results = {
    results: string[],
    duration: number
}

export const runtime = "edge"

export default function Home() {
    const [input, setInput] = useState<string>("")
    const [searchResults, setSearchResults] = useState<Results>()
    const debouncedInput = useDebounce(input)

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
        <main className="h-svh transition-all bg-background text-foreground w-full p-8 md:p-8 lg:p-12">
            <div className="flex flex-col gap-4 items-center pt-40 pb-12 lg:pt-32 lg:pb-16">
                <h1 className="text-5xl lg:text-7xl font-extrabold inline flex items-center gap-2">
                    <span className=''>FastAPI</span>
                    <span>
                        <Zap strokeWidth={1} className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]' />
                    </span>
                </h1>

                <p className='text-center text-[0.8rem] md:text-sm leading-none text-muted-foreground'>
                    High-performance API built with Hono, Redis, Cloudflare Workers, and Next.js.
                    <br />Find any country below and receive your response instantly, measured in milliseconds.
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
