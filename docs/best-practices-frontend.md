
# Frontend Best Practices and Project Structure

This document outlines the best practices and project structure for our Next.js application following proper standards. The goal is a consistent, scalable, and maintainable codebase across projects.

## 1. Project Structure

Proper projects use a feature-first layout with strict separation of concerns and colocation of UI, state, and server actions per feature.

Top-level under src:
- app: Next.js App Router (server-first)
- components and components/ui: global components and shadcn/ui primitives
- hooks: shared React hooks (no domain logic)
- lib: client-side helpers (config, jwt, pagination, rbac, session, utils, lightweight API clients if needed)
- models: shared models and primitives (e.g., paginated, TextField)
- redux: global store, typed hooks, and cross-feature/global slices only
- schemas: validation schemas (zod/yup) and DTOs
- server: BFF/service layer and fetch wrappers (no React)
  - server/services: one service per domain (auth, clients, tasks, admin, etc.)
  - server/fetch-*.ts: wrappers that attach auth/session and caching hints
- types: shared types and interfaces

Per-feature convention inside app:
- app/(protected)/[feature]
  - _components: feature-local client components only used by this feature
  - _redux: feature slice and actions (UI state only; no side-effects)
  - _sections: composed UI, page-specific providers, and layouted parts
  - page.tsx and layout.tsx: server components rendering feature UI

Example:
- app/(protected)/admin
  - server/actions/admin.actions.ts (server)
  - _components/users-table.tsx, filter-bar.tsx
  - _redux/admin.slice.ts
  - _sections/providers.tsx (client provider that syncs URL → state and calls server actions)

## 2. Server Actions and Services 

- Server Actions live centrally under server/actions/*, one file per domain (admin.actions.ts, tasks.actions.ts, etc.).
- Server Actions are thin: validate inputs, call the service layer, map/shape data for UI, and handle revalidation.
- Service layer lives in server/services/* and owns HTTP/IO to backend (FastAPI, etc.). It:
  - Accepts primitives/DTOs and optional token/session.
  - Returns Response or parsed data (decide per domain; be consistent).
  - Contains no React, no window, no localStorage, etc.
- Use next: { tags, revalidate } and revalidateTag in server actions to keep caches fresh.

Example flow:
- UI event in client component → calls a function from a page provider (_sections) → invokes server action → calls server/services → returns shaped data → dispatch to slice or update UI state → optional revalidateTag.

## 3. State Management (Redux)

- Global Redux store (redux/store.ts) with typed hooks (redux/hooks.ts).
- Feature slices live under app/(protected)/[feature]/_redux/*.slice.ts and manage UI state only (filters, pagination, loading flags, transient errors).
- Do not put async side-effects in slices. Prefer:
  - Client provider (in _sections) with useEffect that calls server actions and dispatches results.
  - Or direct server component data fetching when UI doesn’t need client interactivity.
- Use TextField model for form inputs where applicable.

## 4. Data Loading Pattern (URL as source of truth)

- Filter/search/pagination values live in the URL query string.
- A feature provider (client component under _sections) reads URL via useSearchParams, dispatches UI state to the slice, and calls server actions to load data.
- On user interaction (filter change, search), push/replace the URL; the provider reacts, reloads data, and updates the slice.

## 5. Components: Server vs Client

- Default to Server Components for pages/layouts and static UI where possible.
- Use Client Components for interactive controls (useState/useEffect), event handlers, and anything that depends on browser APIs.
- Keep client components as small leaves that receive data from server components or providers.

## 6. Auth and RBAC (BFF)

- Tokens live in HttpOnly cookies managed by the BFF; never expose tokens to client JS.
- Use server/fetch-with-auth.ts (or equivalent) to attach Authorization when calling backend services.
- Add an auth guard at app/(protected)/_components/auth-guard.tsx for role checks, or perform checks in server components and redirect when unauthorized.

## 7. File/Folder Naming and Conventions

- Use kebab-case for filenames (except React components in PascalCase when appropriate).
- Keep one domain per service file: server/services/admin-service.ts, tasks-service.ts, etc.
- Name server action files under server/actions: admin.actions.ts, tasks.actions.ts, etc.
- Keep types in types/* and feature-specific types near the feature when narrowly scoped.

## 8. Caching and Revalidation

- Read-heavy lists: use next: { tags: ['feature-list'], revalidate: N }.
- After mutations: call revalidateTag('feature-list') in the server action to invalidate caches.
- Prefer tag-based invalidation to broad time-based revalidation when UX expects fresh lists immediately.

## 9. Error Handling and UX

- Services: catch network/HTTP errors and return meaningful messages (or bubble up Response to actions).
- Server Actions: map backend errors to user-friendly messages and structured results { success, data?, message? }.
- UI: disable buttons during isProcessing, show toasts/snackbars, avoid optimistic updates unless trivial or reversible.

## 10. Example: Admin feature (CRUD wiring)

- server/actions/admin.actions.ts (server):
  - fetchUsers(params) → calls server/services/admin-service.index(params)
  - approveUser(id, role), updateUserRole(id, role), toggleUserActivation(id, isActive), deleteUser(id)
  - Each mutation calls revalidateTag('admin-users')
- _sections/providers.tsx (client):
  - Sync URL → slice (searchQuery, roleFilter, statusFilter, page, pageSize)
  - Call fetchUsers and dispatch setPaginatedData
- _components/users-table.tsx (client):
  - Renders from slice; buttons call respective server actions via small handler functions
- _redux/admin.slice.ts: UI state only (loading/processing/errors, filters, pagination, paginatedData)

## 11. Checklist for new features

1) Create app/(protected)/[feature] with:
- _components/*
- _redux/[feature].slice.ts
- _sections/providers.tsx
- page.tsx (server) and optional layout.tsx
And add/extend server/actions/[feature].actions.ts

2) Create/extend server/services/[feature]-service.ts with typed calls.

3) Wire URL → provider → server action → service → slice.

4) Add tags and revalidation strategy.

5) Add RBAC guard where needed.

## 12. Linting, Types, and Principles

- TypeScript strict mode; prefer explicit return types for server actions and services.
- ESLint/Prettier consistent with configs.
- Apply KISS/DRY/SOLID pragmatically.

This document reflects proper folder structure and implementation patterns and should be used as the source of truth for this codebase going forward.

The project follows a feature-based structure, where each page or major feature has its own dedicated folder. This promotes modularity and makes it easier to locate and work on specific parts of the application.

### 1.1. Global Folders

These folders are located at the root of the `src` directory and contain code that is shared across the entire application.

-   **/app**: The main application folder, following the Next.js App Router conventions.
-   **/components/ui**: Reserved for `shadcn/ui` components. This ensures a clear separation between our custom UI components and the `shadcn` library.
-   **/components**: Global components that are used across multiple pages, but are not part of the `shadcn/ui` library.
-   **/hooks**: Custom React hooks that can be reused throughout the application.
-   **/lib/auth.ts**: Server-side configuration for `better-auth`.
-   **/lib/auth-client.ts**: Client-side configuration for `better-auth`.
-   **/models**: Data models like TextField for form state management.
-   **/schemas**: TypeScript schemas for data validation (e.g., SignInSchemaType).
-   **/services**: API service functions that communicate with the backend.
-   **/server/actions**: Contains all of our Server Actions.
-   **/server/services**: Contains our server-side business logic.
-   **/redux**: Global Redux setup, including the store, root reducer, and any middleware.
-   **/types**: Global TypeScript types and interfaces.
-   **/utils**: Utility functions that are not specific to any single component or feature.

### 1.2. Page-Specific Structure

Each page or feature will have its own folder within the `/app` directory, following this convention:

```
/app
|-- /[page-name]
|   |-- /_components      // Local components, only used within this page
|   |-- /_redux           // Redux slice, actions, and selectors for this page
|   |-- /_sections        // Larger sections of the page, composed of multiple components
|   |-- layout.tsx        // Layout for the page
|   `-- page.tsx          // The main page component
```

-   **`_components`**: Contains smaller, reusable components that are specific to this page.
-   **`_redux`**: Holds the Redux slice, actions, and selectors for the page-specific state.
-   **`_sections`**: Larger, more complex components that make up a distinct section of the page.
-   **`layout.tsx`**: The layout for the page, which can be used to provide a consistent structure for the page and its children.
-   **`page.tsx`**: The main page component, which brings together the different sections and components.

## 2. State Management with Redux

We use Redux for global state management with a TextField pattern for form state. The global Redux setup is in the `/redux` folder, while page-specific Redux logic is co-located with the page.

-   **Global State**: The `/redux` folder contains the main Redux store, root reducer, and any middleware.
-   **Page-Specific State**: Each page can have its own Redux slice in the `_redux` folder. This keeps the state management modular and easier to maintain.
-   **TextField Pattern**: Forms use the TextField model for consistent state management with value, errorText, and errorType properties.
-   **Direct State Access**: We access state directly without selectors: `useAppSelector((state) => state.signIn)`.

## 3. Component Strategy

We have a clear distinction between global and local components:

-   **Global UI Components (`/components/ui`)**: These are from the `shadcn/ui` library and are used for building the basic UI elements of the application.
-   **Global Custom Components (`/components`)**: These are custom components that are used across multiple pages.
-   **Local Components (`/[page-name]/_components`)**: These are components that are only used within a specific page.

## 4. Data Fetching with Server Actions

We use Next.js Server Actions for data fetching and mutations. This allows us to write our data fetching logic directly in our server components, which simplifies the codebase and improves performance.

-   **Server Actions**: Server Actions are defined centrally under `server/actions` and imported by features.
-   **`fetch` with Revalidation**: We use the `fetch` API with the `next: { revalidate: ... }` option for time-based revalidation of our data. This ensures that our data is always fresh, while still allowing us to benefit from caching.
-   **`revalidateTag`**: For on-demand revalidation, we use the `revalidateTag` function. This is useful for situations where we need to update the cache immediately after a mutation.

## 5. Authentication with FastAPI JWT via Next.js BFF

We use FastAPI as the source of truth for authentication and issue JWT access tokens. The Next.js Backend-for-Frontend (BFF) proxies auth and API calls while keeping tokens in a secure HttpOnly cookie to prevent exposure to client JavaScript.

-   User Authentication: The Next.js API routes `/api/auth/sign-in` and `/api/auth/sign-up` proxy to FastAPI. If FastAPI returns a `Set-Cookie`, it is forwarded. If FastAPI returns `{ access_token }` (or `{ token }`), Next.js sets an `auth_token` HttpOnly cookie.
-   Session Validation: The BFF exposes `/api/auth/me`. Server components/layouts call this route to validate sessions. The route reads the `auth_token` cookie and forwards `Authorization: Bearer <token>` to FastAPI.
-   BFF to FastAPI Communication: All application requests from the frontend should go through `/api/proxy/*`. The proxy attaches `Authorization: Bearer <token>` using the HttpOnly cookie and forwards the request to FastAPI, avoiding CORS and preventing token leakage.
-   Sign-out: `/api/auth/sign-out` proxies to FastAPI and also clears the `auth_token` cookie.

## 6. Backend and Database

Authentication, user persistence, and authorization are owned by FastAPI. JWTs are signed and validated in FastAPI. The Next.js BFF remains stateless regarding auth and only stores the JWT in an HttpOnly cookie. All database operations are handled by FastAPI (e.g., SQLAlchemy/ORM of choice).



## 7. Dynamic Routing

We use dynamic routing to create pages with dynamic content. This allows us to create a single page that can display different content based on the URL.

-   **`[folder]`**: We use square brackets to create a dynamic route segment.
-   **`[...folder]`**: We use square brackets with an ellipsis to create a catch-all route segment.
-   **`[[...folder]]`**: We use double square brackets with an ellipsis to create an optional catch-all route segment.
-   **Parallel Routes**: We use parallel routes to render multiple pages in the same layout. This is useful for creating dashboards and other complex layouts.

## 8. Component-centric Client-Server Interaction

To maintain a clear separation of concerns and optimize performance:

-   **Global Providers (Root Layout)**: Global providers, such as the Redux `StoreProvider`, should wrap the entire application in the root `layout.tsx`. These providers will typically be client components (marked with `'use client'`) as they manage client-side state and context.
-   **Server Components**: `page.tsx` and `layout.tsx` files should remain Server Components whenever possible, fetching data directly on the server.
-   **Client Components**: Components requiring client-side interactivity (e.g., `useState`, `useEffect`, event listeners) should be created in a separate `.tsx` file and marked with the `'use client'` directive.
-   **Page-Specific Providers**: For components that need to fetch data specific to a page or section, we create dedicated providers within `_sections/_providers`. These providers will use the `useEffect` hook to call a Server Action, which in turn will call the appropriate service to fetch data from the Go backend.

## 10. Implementation Guide

This section provides a step-by-step guide on how to implement the architecture we've defined in this document.

### 10.1. Folder Structure

First, create the following folder structure in your `src` directory:

```
/src
|-- /app
|-- /components
|   |-- /ui
|-- /hooks
|-- /lib
|-- /models        // TextField and other data models
|-- /schemas       // TypeScript schemas for validation
|-- /services      // API service functions
|-- /redux
|-- /server
|   |-- /actions
|   `-- /services
`-- /types
```

### 10.2. Auth Setup (FastAPI JWT + Next.js BFF)

1.  **Create `/lib/auth.ts`**:

```ts
// Next.js API proxy routes
// /src/app/api/auth/sign-in/route.ts, sign-up, sign-out, me
// - read and set HttpOnly cookie 'auth_token'
// /src/app/api/proxy/[...path]/route.ts
// - attaches Authorization: Bearer <token> from cookie

// Session helper
// /src/lib/session.ts
// - getServerSession(): calls /api/auth/me
// - requireServerSession(): redirects when not authenticated
```

2.  **Create `/lib/auth-client.ts`**:

```ts
// Client calls should go through /api/proxy/* so the BFF adds Authorization.
// Example client fetch:
// await fetch('/api/proxy/users/me')
```

3.  **Create `/app/api/auth/[...nextauth]/route.ts`**:

```ts
// No longer applicable. Auth is handled by FastAPI with JWT and proxied by Next.js.
```

### 10.3. Server Actions and Services

1.  **Create a service in `/services`**:

    ```typescript
    // /services/user-service.ts
    export async function signIn({ email, password }: SignInRequest) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        // Handle response and return structured data
    }
    ```

2.  **Create an action in `/server/actions`**:

    ```typescript
    // /server/actions/auth.actions.ts
    'use server';

    import { signIn as signInService } from "@/services/user-service";
    import { SignInSchemaType } from "@/schemas/account";

    // Export pattern for Server Actions
    export const signInActions = {
        signIn: async (data: SignInSchemaType) => {
            // Validation and business logic
            const result = await signInService(data);
            // Handle authentication
            return { success: true, message: "Success" };
        }
    };
    ```

### 10.4. Redux with TextField Pattern

1.  **Define the TextField model**:

    ```typescript
    // /models/text-field.ts
    export enum ErrorType {
        NONE = 'NONE',
        CLIENT = 'CLIENT',
        SERVER = 'SERVER'
    }

    export interface TextField<T> {
        value?: T;
        errorText?: string;
        errorType?: ErrorType;
    }
    ```

2.  **Update Redux store to include page slices**:

    ```typescript
    // /redux/store.ts
    import { configureStore } from '@reduxjs/toolkit';
    import userReducer from './user.slice';
    import signInReducer from '@/app/auth/sign-in/_redux/sign-in.slice';
    import signUpReducer from '@/app/auth/sign-up/_redux/sign-up.slice';

    export const makeStore = () =>
        configureStore({
            reducer: {
                user: userReducer,
                signIn: signInReducer,
                signUp: signUpReducer,
            },
            devTools: process.env.NODE_ENV !== 'production',
        });

    export type AppStore = ReturnType<typeof makeStore>;
    export type AppDispatch = AppStore['dispatch'];
    export type RootState = ReturnType<AppStore['getState']>;
    ```

3.  **Create a Redux slice with TextField**:

    ```typescript
    // /app/auth/sign-in/_redux/sign-in.slice.ts
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
    import { TextField, ErrorType } from '@/models/text-field';

    export interface SignInState {
        email: TextField<string>;
        password: TextField<string>;
        isLoading: boolean;
    }

    const initialState: SignInState = {
        email: { value: '', errorText: '', errorType: ErrorType.NONE },
        password: { value: '', errorText: '', errorType: ErrorType.NONE },
        isLoading: false,
    };

    const signInSlice = createSlice({
        name: 'signIn',
        initialState,
        reducers: {
            setEmail(state, action: PayloadAction<TextField<string>>) {
                state.email = action.payload;
            },
            setPassword(state, action: PayloadAction<TextField<string>>) {
                state.password = action.payload;
            },
            setIsLoading(state, action: PayloadAction<boolean>) {
                state.isLoading = action.payload;
            },
            clearErrors(state) {
                state.email.errorText = '';
                state.email.errorType = ErrorType.NONE;
                state.password.errorText = '';
                state.password.errorType = ErrorType.NONE;
            },
            resetForm(state) {
                return initialState;
            },
        },
    });

    export const { setEmail, setPassword, setIsLoading, clearErrors, resetForm } = signInSlice.actions;
    export default signInSlice.reducer;
    ```

3.  **Create AuthInput component**:

    ```typescript
    // /components/auth-input.tsx
    import { TextField, ErrorType } from '@/models/text-field';

    interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label: string;
        field: TextField<string>;
        onFieldChange: (value: TextField<string>) => void;
    }

    export function AuthInput({ label, field, onFieldChange, ...props }: AuthInputProps) {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onFieldChange({
                ...field,
                value: e.target.value,
                errorText: '',
                errorType: ErrorType.NONE,
            });
        };

        const hasError = field.errorType !== ErrorType.NONE && field.errorText;

        return (
            <div className="space-y-2">
                <Label htmlFor={props.id}>{label}</Label>
                <Input
                    {...props}
                    value={field.value || ''}
                    onChange={handleChange}
                    className={hasError ? 'border-destructive' : ''}
                />
                {hasError && <p className="text-sm text-destructive">{field.errorText}</p>}
            </div>
        );
    }
    ```

4.  **Use in a form component**:

    ```typescript
    // /app/auth/sign-in/_components/sign-in-form.tsx
    'use client';

    import { useAppDispatch, useAppSelector } from '@/redux/hooks';
    import { setEmail, setPassword, setIsLoading } from '../_redux/sign-in.slice';
    import { signInActions } from '@/server/actions/auth-actions';

    export function SignInForm() {
        const dispatch = useAppDispatch();
        const { email, password, isLoading } = useAppSelector((state) => state.signIn);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            dispatch(setIsLoading(true));
            
            const result = await signInActions.signIn({
                email: email.value || '',
                password: password.value || '',
            });

            if (result.success) {
                window.location.href = '/dashboard';
            }
            dispatch(setIsLoading(false));
        };

        return (
            <form onSubmit={handleSubmit}>
                <AuthInput
                    label="Email"
                    field={email}
                    onFieldChange={(field) => dispatch(setEmail(field))}
                />
                <AuthInput
                    label="Password"
                    type="password"
                    field={password}
                    onFieldChange={(field) => dispatch(setPassword(field))}
                />
                <Button type="submit" disabled={isLoading}>
                    Sign In
                </Button>
            </form>
        );
    }
    ```

### 10.5. Page and Component Structure

1.  **Create a page**:

    ```typescript
    // /app/users/[id]/page.tsx
    import { fetchUser } from "@/server/actions/user-actions";

    export default async function UserPage({ params }: { params: { id: string } }) {
        const user = await fetchUser(params.id);

        return (
            <div>
                <h1>{user.name}</h1>
            </div>
        );
    }
    ```

2.  **Create a client component with a provider**:

    ```typescript
    // /app/users/[id]/_sections/_providers/user-provider.tsx
    'use client';

    import { useEffect, useState } from "react";
    import { fetchUser } from "@/server/actions/user-actions";

    export const UserProvider = ({ id, children }: { id: string, children: React.ReactNode }) => {
        const [user, setUser] = useState<{ id: string; name: string } | null>(null);

        useEffect(() => {
            const getUser = async () => {
                const user = await fetchUser(id);
                setUser(user);
            };

            getUser();
        }, [id]);

        return <>{children(user)}</>;
    };
    ```



In addition to the above, we follow these best practices:

-   **KISS (Keep It Simple, Stupid)**: We strive to keep our code as simple as possible. Avoid unnecessary complexity and favor straightforward solutions.
-   **DRY (Don't Repeat Yourself)**: We avoid duplicating code by abstracting and reusing common logic.
-   **SOLID Principles**: We apply the SOLID principles to our code to ensure that it is maintainable, scalable, and easy to understand.

    -   **S - Single Responsibility Principle (SRP)**: A component or module should have only one reason to change. This means it should have only one responsibility.
    -   **O - Open/Closed Principle (OCP)**: Software entities (components, modules, functions) should be open for extension but closed for modification. We should be able to add new functionality without changing existing code.
    -   **L - Liskov Substitution Principle (LSP)**: Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.
    -   **I - Interface Segregation Principle (ISP)**: Clients should not be forced to depend on interfaces they do not use. We should create small, specific interfaces rather than large, general-purpose ones.
    -   **D - Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.
-   **TypeScript**: We use TypeScript for all of our code, with `strict: true` enabled in the `tsconfig.json` file.
-   **ESLint**: We use ESLint to enforce a consistent code style.
-   **Performance**: We prioritize performance by using Server Components, Server Actions, and caching strategies to minimize the amount of JavaScript that is sent to the client.

---

## Appendix: Migration notes (from per-feature actions to server/actions)

Use this guide if you have any legacy feature-local actions and want to conform to proper centralized server/actions pattern. If you already keep actions in server/actions, you can skip this section.

1) Identify legacy action files
- Typical legacy paths: app/(protected)/*/_actions/*.actions.ts or app/*/_actions/*.actions.ts
- Target paths: server/actions/*.actions.ts (group by domain: admin.actions.ts, clients.actions.ts, tasks.actions.ts, etc.)

2) Move files
- For each legacy file, move it to server/actions and keep the filename consistent.
- Ensure the file starts with 'use server' and does not import any client-only APIs.

3) Fix imports across the codebase
- Before:
  import { fetchUsers } from '@/app/(protected)/admin/_actions/admin-actions';
- After:
  import { fetchUsers } from '@/server/actions/admin-actions';

Suggested search/replace patterns:
- Find: @/app/(protected)/*/_actions/([a-zA-Z0-9_.-]+)
- Replace with: @/server/actions/$1
- Also search for any relative imports to _actions within feature folders and update them to point to server/actions.

4) Service layer boundaries
- Verify each action calls its corresponding server/services/*.ts function and handles:
  - Input validation/coercion
  - Mapping backend snake_case → frontend camelCase if needed
  - Revalidation via revalidateTag('feature-tag') after mutations
  - Graceful error handling { success: false, message }

5) Providers and UI wiring
- Feature providers (_sections/providers.tsx) should import actions from server/actions and maintain the URL→slice sync.
- Client components (e.g., users-table.tsx) should call a small handler that invokes the action, updates isProcessing, shows a toast, and lets tag revalidation refresh the list.

6) Index re-exports (optional)
- If you prefer barrel files, create server/actions/index.ts to re-export per-domain actions.
  export * from './admin-actions';
  export * from './clients-actions';
  export * from './tasks-actions';

7) Environment and fetch wrappers
- Actions should rely on server/services functions which use fetch wrappers (server/fetch-with-auth.ts or fetch-with-session.ts) configured with BACKEND_URL/FASTAPI_BASE_URL.
- Avoid duplicating base URLs or headers inside actions; keep them in services.

8) Verification checklist
- Type-check passes (no unresolved imports)
- All routes compile (Next.js build)
- Basic E2E flow: list views load; mutations succeed and revalidate expected tags
- No client-only imports in server/actions (e.g., window, localStorage)

Following these steps will align any legacy per-feature actions with proper centralized actions structure and keep feature folders focused on UI and state only.
