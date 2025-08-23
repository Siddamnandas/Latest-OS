export type Route = {
  path: string;
  component: React.ComponentType;
};

export type UIComponent = {
  name: string;
  component: React.ComponentType;
};

export type Hook = {
  name: string;
  hook: () => void;
};

export interface Plugin {
  /** Human readable plugin name */
  name: string;

  /** Register routes exposed by the plugin */
  registerRoutes?(): Route[];

  /** Register UI components available to the host app */
  registerUI?(): UIComponent[];

  /** Register lifecycle hooks */
  registerHooks?(): Hook[];
}
