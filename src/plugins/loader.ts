import type { Plugin } from './types';
import { pluginConfig } from './config';

/**
 * Dynamically imports all enabled plugins using `import()` so that each plugin
 * can be isolated into its own bundle.
 */
export async function loadPlugins(): Promise<Plugin[]> {
  const plugins: Plugin[] = [];

  for (const cfg of pluginConfig) {
    if (cfg.enabled === false) continue;

    // Dynamic import ensures separate bundle per plugin.
    const mod = await import(/* webpackIgnore: true */ cfg.module);
    const plugin: Plugin = mod.default ?? mod.plugin ?? mod;
    plugins.push(plugin);
  }

  return plugins;
}
