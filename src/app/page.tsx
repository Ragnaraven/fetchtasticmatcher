import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Fetch Takehome Test</h1>
      <Link 
        href="/login" 
        className="btn btn-primary"
      >
        Login
      </Link>
    </div>
  );
}
