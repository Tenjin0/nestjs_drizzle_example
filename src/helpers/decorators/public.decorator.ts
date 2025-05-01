import { SetMetadata } from '@nestjs/common';

export const PublicDecorator = (...args: string[]) => SetMetadata('public.decorator', args);
