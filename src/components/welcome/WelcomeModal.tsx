'use client';

export function WelcomeModal() {
  return (
    <dialog id="welcome_modal" className="modal">
      <div className="modal-box">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary text-center">
          🐾 Fetch Your Perfect Match
        </h1>
        <p className="py-4 text-base-content/70 text-center">
          Browse through our lovable dogs and find your new best friend. 
          Each one is unique and waiting for their forever home.
        </p>
        <div className="flex flex-wrap items-center gap-3 justify-center text-sm text-base-content/60 mb-4">
          <span className="badge badge-primary badge-md">♥ Click to Favorite</span>
          <span className="hidden sm:inline">•</span>
          <span className="badge badge-ghost badge-md">Filter by Breed</span>
          <span className="hidden sm:inline">•</span>
          <span className="badge badge-ghost badge-md">Sort by Age</span>
        </div>
        <div className="modal-action justify-center">
          <form method="dialog">
            <button className="btn btn-primary btn-lg">Get Started</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
} 