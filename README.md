# 概要
できるだけ **「最初はTanStack Startで全部」→「後でHono+Turso+Drizzleに分離」**を楽にするなら、最初から **“境界（API契約・ドメインロジック）を別置き”**にしておくのが一番効きます。
さらに「AIにコードを書かせて、ちゃんと動くか」を担保するには、**完了条件（実行コマンド＋動作スモーク）をプロンプトに埋め込む**のがコツです。

---

## 推奨ディレクトリ構造（分離しやすい形）

### いちばんおすすめ：最初から “軽いモノレポ風” にする（後で分離が最短）

Web（TanStack Start）と将来のAPI（Hono）で **同じドメイン/契約を共有**できます。

```txt
apps/
  web/                         # TanStack Start
    app/
      routes/
        quiz/
          index.tsx            # /quiz（薄い）
        api/
          quiz/
            next.ts            # GET /api/quiz/next
            submit.ts          # POST /api/quiz/submit
    src/
      features/
        quiz/
          ui/                  # shadcn + hooks + store
          apiClient/           # fetcher（TanStack Queryが使う）
    public/
      images/
        tora.png               # 虎画像（最初は固定でもOK）
    package.json

packages/
  quiz-core/                   # フレームワーク非依存（ここが“移植しやすさ”の核）
    src/
      contracts/               # zod schema + types（API契約の唯一の真実）
      domain/                  # 純粋関数（判定、スコアなど）
      application/             # service（repo + domainのオーケストレーション）
      ports/                   # repository interface
    package.json

  quiz-infra/                  # “実装”だけ（JSON→Drizzle差し替えがここ）
    src/
      data/
        quizData.ts            # 最初のベタ書き（内部データの唯一の真実）
      repositories/
        quizRepository.json.ts
        quizRepository.drizzle.ts   # 後で追加
      db/
        client.ts              # libsql client（Workers前提ならweb版）
        schema.ts              # Drizzle schema
      compose.ts               # getQuizService() などDI組み立て
    package.json

pnpm-workspace.yaml
```

**なぜこれが強い？**

* 将来 **apps/api**（Hono）を足すとき、`packages/quiz-core` と `packages/quiz-infra` をほぼそのまま使える
* Web側は最初から `/api/...` を叩く作りにすれば、分離しても **UI側ほぼ無変更**（baseURL変える程度）

> もし「モノレポは重い」と感じるなら、今の `src/features/quiz` に置いたままでもOK。ただ、**“core（契約＋ドメイン）だけは packages に分ける”**のが将来いちばん楽です。

---

## API設計（2本でOK、これが分離の背骨）

UIは **server function直呼び禁止**にして、必ずHTTPで。

* `GET /api/quiz/next`

  * 返す：`QuizQuestionPublic`（問題文＋選択肢＋画像情報、正解/母音は返さない）
* `POST /api/quiz/submit`

  * 送る：`quizId`, `selectedChoiceIds`
  * 返す：`QuizResult`（正誤、解説、選択肢の母音、正解IDなど）

画像は `image: { kind: "assetKey", value: "tora" }` みたいにしておくと、Webは `public/images/tora.png`、RNはCDN URLにマップしやすいです。

---

## “ちゃんと動くか” の確認方法（AIに強制するチェック手順）

### 最低限これを「完了条件」にする（devだけは弱い）

1. `pnpm install`
2. `pnpm typecheck`（なければ追加）
3. `pnpm test`（純粋関数だけでOK。なければ追加）
4. `pnpm build`
5. `pnpm dev` 起動
6. **スモーク確認**（curl or Playwright）

#### スモーク確認（curlで十分）

* `GET /api/quiz/next` が 200 で JSON
* `POST /api/quiz/submit` が 200 で JSON
* `/quiz` が表示され、選択→解答→結果表示まで通る

---

## Claude Code / Codex に貼る「指示テンプレ」（コピペ用）

### 1) 実装依頼テンプレ（共通）

```txt
目的: TanStack Start + shadcn + zustand + TanStack Queryで、韻クイズを実装する。
将来: React Native + Hono + Turso + Drizzleに分離するので、UIはHTTP API(/api/...)だけを叩くこと（server function直呼び禁止）。
API契約は packages/quiz-core/contracts（zod）を唯一の真実にする。

機能:
- GET /api/quiz/next: 問題文/選択肢/画像情報のみ返す（正解や母音は返さない）
- POST /api/quiz/submit: DB/JSONから母音・正解情報を取得して判定し、正誤/解説/選択肢母音/正解IDを返す
- UI(/quiz): チェック形式で選択→解答→結果表示（解説、母音、正誤）

データ:
- 最初は quizData.ts（内部データの唯一の真実）に、questionVowels/choiceVowels/isCorrect/explanation/image を含めて持つ
- クライアントへ返すDTOは必ずpublic用に変換して返す

完了条件（必須）:
- pnpm install
- pnpm typecheck（無ければ追加して実行）
- pnpm test（judge関数など純粋関数のテスト。無ければ追加して実行）
- pnpm build
- pnpm dev 起動
- curlで /api/quiz/next と /api/quiz/submit を叩いて 200 を確認
- /quiz をブラウザで開き、選択→解答→結果表示まで確認
エラーが出たら原因を特定して修正し、完了条件を最初から再実行して全て通るまで完了にしない。
最後に実行したコマンドと結果を箇条書きで報告する。
```

### 2) Claude Code向け（フェーズ分割を強制すると成功率UP）

```txt
フェーズ1: contracts(domain/application/ports) と JSON repo だけ作り、APIがcurlで動くところまで
フェーズ2: /quiz のUI（最低限）を作り、結果表示まで
フェーズ3: shadcnで見た目、画像枠、zustand(進捗/スコア)を追加
各フェーズの終わりに「完了条件」を必ず全部実行して通すこと
```

### 3) Codex向け（差分修正ループを強制）

```txt
変更は小さなコミット単位で進め、各ステップで pnpm typecheck && pnpm test && pnpm build を必ず通す。
エラーが出たらログの先頭20行＋原因＋修正方針を短く書いてから修正し、同じコマンドを再実行する。
```

---

## 追加で1つだけ：純粋関数テストは最初に作ると壊れにくい

`judgeAnswer(promptVowels, choiceVowels)` と `calculateScore` だけでも `vitest` でテストを先に作らせると、AI実装のブレが一気に減ります。

---

もし今のリポジトリが **単一プロジェクト（モノレポじゃない）**で始めたいなら、その前提で「packages無し版」の最適ツリーも出せます。
どっちで行くかだけ決めたい場合は、今のプロジェクトのルート構成（`app/` があるか `src/` だけか）を1画面分貼ってくれれば、それに合わせて最短の形に落とします。









Welcome to your new TanStack Start app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `pnpm add @tailwindcss/vite tailwindcss --dev`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
