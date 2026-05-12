'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiArrowLeft } from "react-icons/fi"


export default function ChildLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>){
  const router = useRouter()
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const hasBackHistory: boolean = window.history.length > 1

    if (hasBackHistory) router.back()
    router.push('/users')
  }
    
  return (
    <div className="space-y-8">
        <Link
            href="/users"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
            <FiArrowLeft aria-hidden />
            Back to users
        </Link>
        {children}
    </div>
  )
}