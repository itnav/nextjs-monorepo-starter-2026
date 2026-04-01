import { Button } from ":/libs/shadcn/components/button";

/**
 * Content アプリのトップページ。
 *
 * @jsx
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to Content</h1>
      <p className="text-muted-foreground max-w-2xl text-lg">
        This is a starter template. Edit{" "}
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
          src/app/(page)/(home)/page.tsx
        </code>{" "}
        to get started.
      </p>
      <div className="flex gap-3">
        <Button variant="ghost" size="sm">
          About
        </Button>
        <Button variant="ghost" size="sm">
          Contact
        </Button>
      </div>
    </div>
  );
}
