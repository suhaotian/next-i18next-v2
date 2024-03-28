![How next-intl works](how-next-intl-works.jpg)

# How next-intl Works

Understanding how `next-intl` functions is crucial for two key reasons:

1. **Effective Utilization:** By comprehending its inner workings, you can leverage next-intl's capabilities more effectively in your Next.js applications.
2. **Customization:** With this knowledge, you gain the ability to tailor your own internationalization (i18n) library for specific needs, such as dynamically loading locales or custom logics within the Next.js App Router.

## Four Key Aspects of next-intl

### 1. Conditional Exports (default/react-server):

- This mechanism enables separation of code based on where it's executed (client or server).
- The `"default"` export is utilized for all components, while `"react-server"` caters to server components when have.

**Example (`package.json`):**

```json
{
  "name": "conditional-exports-example",
  "version": "1.0.0",
  "exports": {
    ".": {
      "react-server": "./src/hello.server.ts",
      "default": "./src/hello.client.ts"
    }
  }
}
```

**`src/hello.server.ts`:**

```ts
const msg = 'Hi from `src/hello.server.ts`';
export default msg;
```

**`src/hello.client.ts`:**

```ts
const msg = 'Hi from `src/hello.client.ts`';
export default msg;
```

**Testing with Next.js:**

- Create a Next.js project using `pnpx create-next-app@latest`(here using **pnpm**).
- Set up `app/server/page.tsx` and `app/client/page.tsx`.

```tsx
// app/server/page.tsx
import hi from 'conditional-exports-example';

export default function ServerPage() {
  return <div>{hi}</div>;
}
```

```tsx
'use client';

// app/client/page.tsx
import hi from 'conditional-exports-example';

export default function ClientPage() {
  return <div>{hi}</div>;
}
```

Accessing these pages:

- `http://localhost:3000/server` will displays `Hi from src/hello.server.ts`.

- `http://localhost:3000/client` will displays `Hi from src/hello.client.ts`.

### 2. React's `use` hook

The `use` hook is restricted to regular components (client or server components without the `async` prefix). You cannot use it within async server components.

❌ **Incorrect Example:**

> Error: Expected a suspended thenable. This is a bug in React. Please file an issue.

```tsx
export default async function Hello() {
  const msg = use(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('hi');
      }, 1000);
    })
  );

  return <div>{msg}</div>;
}
```

✅ **Correct Example:**

```tsx
export default function Hello() {
  const msg = use(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('hi');
      }, 1000);
    })
  );

  return <div>{msg}</div>;
}
```

In `next-intl`, distinct modules are imported for translation functions based on the component type:

**Example: non-async server component (Server Component without `async` Prefix):**

```tsx
import { useTranslations } from 'next-intl';

export default function UserDetails({ user }) {
  const t = useTranslations('UserProfile');

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('followers', { count: user.numFollowers })}</p>
    </section>
  );
}
```

**Example: client component:**

(Client components are considered non-async components)

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function UserDetails({ user }) {
  const t = useTranslations('UserProfile');

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('followers', { count: user.numFollowers })}</p>
    </section>
  );
}
```

**Example: async server components:**

```tsx
import { getTranslations } from 'next-intl/server';

export default async function UserDetails({ user }) {
  const t = await getTranslations('UserProfile');

  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('followers', { count: user.numFollowers })}</p>
    </section>
  );
}
```

### 3. Customizing `next.config.mjs` for different Runtime-Specific Configurations

Managing configurations for both server and client runtimes can be challenging. `next-intl` addresses this using the `Module Path Aliases` feature to establish a flexible configuration file. For details, refer to the source code:

https://github.com/amannn/next-intl/blob/main/packages/next-intl/src/plugin.tsx

### 4. Redirecting URLs for Language Detection in `middleware.ts`

The core concept for language-based URL redirection can be found in the Official Next.js Internationalization Docs: https://nextjs.org/docs/app/building-your-application/routing/internationalization#routing-overview.

#### **Challenge: Sharing Messages in Client Components**

A key challenge involves sharing i18n messages fetched in server components with client components to avoid redundant fetches and potential hydration errors occur when the server-rendered HTML content and the client-side JavaScript do not match.

**Ideal Resolution:**

- Fetch i18n data messages from an API on the server.
- Serialize and pass them to client components, eliminating the need for client-side fetching.

**Layout.tsx:**

```tsx
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { notFound } from 'next/navigation';

export default function LocaleLayout({ children, params: { locale } }) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Client-Side Provider (`NextIntlClientProvider`):**

It's designed to consume locale and message data on the client:

```tsx
'use client';

export default function NextIntlClientProvider({
  locale,
  resource,
  children,
}: {
  locale: string;
  resource: Record<string, any>;
  children: React.ReactNode;
}) {
  // do something with `locale` / `resource` here
  return children;
}
```

### Next Steps

After gaining a solid understanding of the key aspects of `next-intl`, the next step involves building our own i18n library to meet specific requirements.

We will refer to part of the code of `next-intl` and combine it with the popular i18n library `i18next` to develop a new library that called "next-i18next-v2" for in-depth exploration.

For the example source code, you can refer to:

https://github.com/suhaotian/next-i18next-v2
