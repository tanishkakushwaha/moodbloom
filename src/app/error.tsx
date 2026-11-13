'use client';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) {
    return <main className="full-loading">
  <h1>Let’s take a little pause.</h1>
  <p>We couldn’t load this page. Please try again.</p>
  <button className="button button-primary" onClick={reset}>Try again</button>
    </main>;
}
