import React,{ useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const StorybookPage:React.FC = () => {
    const router = useRouter()

    useEffect(()=>{
        if(router.isReady){
            router.replace("/storybook/index.html")
        }
    },[router.isReady])

    return <div>Redirecting to <Link href="/storybook/index.html" >storybook</Link></div>
}

export default StorybookPage