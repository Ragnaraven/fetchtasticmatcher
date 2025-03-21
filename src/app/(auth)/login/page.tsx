import { login } from '@/lib/actions/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get('fetch-access-token')) {
    redirect('/app');
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <h1 className="text-4xl font-bold text-base-content">Login</h1>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" action={login}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Name</span>
              </label>
              <input 
                name="name"
                type="text"
                placeholder="name"
                className="input input-bordered text-base-content bg-base-100"
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="email" 
                className="input input-bordered text-base-content bg-base-100" 
                required 
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
