import type { Plugin } from '@/plugins';

const examplePlugin: Plugin = {
  name: 'ExamplePlugin',
  registerRoutes() {
    return [
      {
        path: '/example',
        component: () => <p>Example route from plugin</p>
      }
    ];
  },
  registerUI() {
    return [
      {
        name: 'ExampleButton',
        component: () => <button>Plugin button</button>
      }
    ];
  },
  registerHooks() {
    return [
      {
        name: 'init',
        hook: () => console.log('Example plugin initialised')
      }
    ];
  }
};

export default examplePlugin;
