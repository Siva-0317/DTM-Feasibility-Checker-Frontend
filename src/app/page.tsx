export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center w-full">BIW DTM Compliance Checker</h1>
      </div>
      
      <div className="flex-1 w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Placeholder for Upload & Viewer components */}
        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-center">
          <p className="text-muted-foreground">Viewer / Upload Area</p>
        </div>
        
        {/* Placeholder for Results */}
        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-center">
          <p className="text-muted-foreground">Results / Reports Area</p>
        </div>
      </div>
    </main>
  );
}
