// Path: app/page.tsx
import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth";
import HomeClient from './components/HomeClient';

// Server component to check auth
export default async function Home() {
    const session = await auth();
    
    if (!session) {
        redirect('/login');
    }
    
    return <HomeClient />;
}
