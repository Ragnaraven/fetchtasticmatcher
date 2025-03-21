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
      <div className="hero-content flex-col lg:gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content font-title mb-2">
            Welcome to FetchtasticMatch
          </h1>
          <p className="text-base-content/70 font-body">
            Let's find your perfect companion
          </p>
        </div>

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" action={login}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-title">Name</span>
              </label>
              <input 
                name="name"
                type="text"
                placeholder="Enter your name"
                className="input input-bordered text-base-content bg-base-100 font-body"
                required 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-title">Email</span>
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="Enter your email" 
                className="input input-bordered text-base-content bg-base-100 font-body" 
                required 
              />
            </div>
            <div className="form-control mt-8">
              <button 
                type="submit" 
                className="btn btn-primary font-title text-lg"
              >
                Start Matching
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
