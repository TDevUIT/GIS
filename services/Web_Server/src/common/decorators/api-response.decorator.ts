import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';
export const SKIP_RESPONSE_TRANSFORM = 'skip_response_transform';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);

export const SkipResponseTransform = () =>
  SetMetadata(SKIP_RESPONSE_TRANSFORM, true);
