import { makeRouter } from './makeRouter.js';

function filtrar(items, q) {
  return items.filter(i => i.question?.toLowerCase().includes(q));
}

export default makeRouter('faq', filtrar);
