async function getHealth() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}

export default async function HealthPage() {
  let data = null;
  let errorMessage: string | null = null;

  try {
    data = await getHealth();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Unknown error.";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Health Check</h1>

      {errorMessage ? (
        <>
          <p className="mt-2 text-expense">Status: Degraded</p>
          <p className="mt-1 text-sm text-slate-600">{errorMessage}</p>
        </>
      ) : (
        <>
          <p className="mt-2 text-income">Status: OK</p>
          <pre className="mt-4 rounded bg-slate-900 p-4 text-xs text-slate-100">
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}