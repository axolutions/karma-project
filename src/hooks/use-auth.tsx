import { supabase } from "@/integrations/supabase/client";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";


type SessionResponse = Awaited<ReturnType<typeof supabase.auth.getSession>>;
type Session = SessionResponse["data"]["session"];
const authContext = createContext<Session>(null);

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    return (
        <authContext.Provider value={session}>
            {children}
        </authContext.Provider>
    )
}

