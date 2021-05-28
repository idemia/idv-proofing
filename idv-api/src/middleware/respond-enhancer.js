export const enhance = (ctx) => {
  ctx.respondWith = (result) => {
    if (result.status === 'success') {
      ctx.ok(result);
    } else if (result.errorCode) {
      ctx.send(result.errorCode, result);
      delete result.errorCode;
    } else {
      ctx.badRequest(result);
    }
  };
};

export function respondEnhancer() {
  return async (ctx, next) => {
    enhance(ctx);
    await next();
  };
}
