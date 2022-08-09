import { useDeleteSessionMutation } from "@graphql";
import MeContext from "@src/contexts/MeContext"; 
import { useRouter } from "next/router";
import React, { useContext,useEffect } from "react"
import Cookie from 'js-cookie';

const LogoutPage: React.FC = () => {
    // contexts
    const { me, loading } = useContext(MeContext);

    // hooks
    const router = useRouter();
    const [deleteSession] = useDeleteSessionMutation();

    useEffect(() => {
        if (!router.isReady || loading) return;

        if (me === null) router.push("/")

        const session = Cookie.get('session');

        if (typeof session !== 'string') return;

        try {
            async () => await deleteSession({
                variables: {
                    session,
                },
            });
        } catch (err) { }

        Cookie.remove('session');
        router.push("/")
    }, [me, router.isReady])

    return <div>loading</div>
}

export default LogoutPage