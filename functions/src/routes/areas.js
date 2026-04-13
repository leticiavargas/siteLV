import { makeRouter } from './makeRouter.js';

function filtrar(items, q) {
  return items.filter(
    i =>
      i.title?.toLowerCase().includes(q) ||
      i.slug?.toLowerCase().includes(q),
  );
}

export default makeRouter('areas', filtrar);
