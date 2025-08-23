export interface PluginConfig {
  /** Module specifier passed to dynamic import */
  module: string;
  /** Whether the plugin should be loaded. Defaults to true. */
  enabled?: boolean;
}

// List of plugins to be loaded at runtime. Populate this array with plugin
// definitions. Each plugin will be dynamically imported which allows the
// bundler to create a separate chunk per plugin.
export const pluginConfig: PluginConfig[] = [];
