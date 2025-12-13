import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContext } from '../utils/request-context.util';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incoming = req.header('x-request-id');
  const requestId = incoming && incoming.trim().length > 0 ? incoming : randomUUID();

  res.setHeader('x-request-id', requestId);

  RequestContext.run({ requestId }, () => next());
}
