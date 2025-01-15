import { IsString, IsOptional, IsObject } from 'class-validator';

class BaseMessageDto {
  @IsOptional()
  @IsObject()
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };

  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsObject()
  data?: { [key: string]: string };
}

export class SendMessageTokenDto extends BaseMessageDto {
  @IsString()
  token: string;
}

export class SendMessageTopicDto extends BaseMessageDto {
  @IsString()
  topic: string;
}

export class SendMessageConditionDto extends BaseMessageDto {
  @IsString()
  condition: string;
}
