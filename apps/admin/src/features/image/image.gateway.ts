import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ImageService } from './image.service';

@WebSocketGateway()
export class ImageGateway {
  constructor(private readonly ImageService: ImageService) {}

  @SubscribeMessage('crop-finish')
  handleMessage(client: any, payload: any): string {
    console.log(client, payload);

    return 'finish';
  }
}
