import Pug from 'koa-pug';
import path from 'path';
import merge from 'lodash/merge';

export const usePug = (app) => {
  const self = new Pug({
    viewPath: path.resolve(__dirname, '../views'),
    helpers: [],
    helperPath: [],
    locals: { name: 'IDEMIA ID&V' },
  });

  app.context.render = async function (tpl, locals, options) {
    const ctx = this;
    const finalLocals = merge({}, self.helpers, self.defaultLocals, locals);
    ctx.body = await self.render(tpl, finalLocals, options);
    ctx.type = 'text/html';
  };
};
