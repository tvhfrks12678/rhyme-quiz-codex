Welcome to your new TanStack Start app! 

## `src/features` の構成（ヘキサゴナルアーキテクチャ風）

このプロジェクトのクイズ機能は、`src/features/quiz` 配下を中心に、責務を分けた構成になっています。

### ディレクトリごとの役割

- `src/features/quiz/domain`
  - ビジネスルールの中核。
  - 例: `judge.ts` で「選択肢の正誤判定」や「スコア計算」の純粋関数を提供。
- `src/features/quiz/application`
  - ユースケース層。
  - 例: `quizService.ts` で「次の問題を作る」「解答を採点する」を実装し、`domain` と `infra` を組み合わせる。
- `src/features/quiz/infra`
  - データ提供層（インフラ層）。
  - 例: `quizData.ts` に内部用の問題データ（正解フラグや母音情報など）を保持。
- `src/features/quiz/contracts`
  - 層の境界で使う型定義。
  - 例: クライアントへ返す公開問題型、解答リクエスト型、結果型を定義。
- `src/features/quiz/api-client`
  - フロントエンド側の API 呼び出しアダプタ。
  - 例: `/api/quiz/next`, `/api/quiz/submit` への `fetch` を隠蔽。
- `src/features/quiz/store`
  - フロントエンドのセッション状態管理。
  - 例: 回答回数・正解数の保持、更新、リセット。

### 処理の流れ（概要）

1. 画面（`src/routes/quiz.tsx`）が `api-client` を使って「次の問題取得」APIを呼ぶ。
2. API ルート（`src/routes/api/quiz/next.ts`）が `application` 層の `getNextQuestion` を実行。
3. `application` 層が `infra` の問題データを参照し、`contracts` の公開型に変換して返す。
4. ユーザーが回答し、画面から `api-client` 経由で「解答送信」APIを呼ぶ。
5. API ルート（`src/routes/api/quiz/submit.ts`）が `application` 層の `submitAnswer` を実行。
6. `submitAnswer` は `infra` の正解データと `domain` の判定ロジック（`judgeAnswer`）を使って結果を作る。
7. 返却結果を画面に表示し、同時に `store` でセッションスコアを更新する。

このように、`domain`（ルール）を中心に、`application`（ユースケース）が `infra`（データ）や `api-client` / ルート層（入出力）をつなぐ形で、変更に強い構造を目指しています。

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
