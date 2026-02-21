import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-cyan-300 font-semibold tracking-wider mb-3">MUSIC GAME</p>
        <h2 className="text-5xl font-black mb-6">ラップの韻クイズへようこそ</h2>
        <p className="text-gray-300 text-lg mb-10">
          問題文と同じ母音パターンを選んで、ラップの押韻感覚を磨こう。UI は HTTP API
          を使う構成なので、将来 Hono + Turso + Drizzle に分離しやすい実装です。
        </p>

        <Link
          to="/quiz"
          className="inline-flex items-center rounded-lg bg-cyan-400 px-6 py-3 text-lg font-bold text-black hover:bg-cyan-300"
        >
          クイズを始める
        </Link>
      </div>
    </main>
  )
}
