export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold">MyHealth</h1>
      <p className="text-neutral-600 mt-2">
        Health ingest webhook: POST /api/hooks/health-ingest
      </p>
    </main>
  );
}
