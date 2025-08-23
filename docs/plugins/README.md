# Plugin System

This project exposes a light–weight plugin API that allows third‑party modules to
augment the application with custom routes, UI components or lifecycle hooks.
Plugins are loaded dynamically which keeps each plugin in its own bundle and
prevents unused code from impacting the main application.

## Writing a Plugin

Create a module that exports a default object implementing the `Plugin`
interface from `src/plugins`.

```ts
// my-plugin.ts
import type { Plugin } from '@/plugins';

const plugin: Plugin = {
  name: 'MyPlugin',
  registerRoutes() {
    return [
      { path: '/hello', component: () => <div>Hello from a plugin</div> }
    ];
  },
  registerUI() {
    return [
      { name: 'Widget', component: () => <button>Click me</button> }
    ];
  }
};

export default plugin;
```

## Enabling Plugins

Specify plugins in `src/plugins/config.ts`. Each entry defines the module to
import and whether it is enabled.

```ts
// src/plugins/config.ts
export const pluginConfig = [
  { module: '@/plugins/my-plugin', enabled: true }
];
```

`loadPlugins()` will dynamically import every enabled plugin:

```ts
import { loadPlugins } from '@/plugins';

const plugins = await loadPlugins();
```

Each plugin is loaded through a dynamic `import()` call, allowing bundlers such
as Next.js or Vite to create a separate chunk for it.
