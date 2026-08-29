async function getHealth() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export default async function HealthPage() {
  const data = await getHealth();
  return (
    <div>
      <h1 className="text-2xl font-bold">Health Check</h1>
      <p className="mt-2 text-slate-600">Status: OK</p>
      <pre className="mt-4 rounded bg-slate-900 p-4 text-xs text-slate-100">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}