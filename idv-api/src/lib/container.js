import { createContainer, Lifetime } from 'awilix';

export const configureContainer = async () => {
  const container = createContainer();

  container.loadModules([['../modules/**/*.service.js', Lifetime.SCOPED]], {
    cwd: __dirname,
    formatName: 'camelCase',
  });

  return container;
};
