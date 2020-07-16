import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Storage } from './storage.entity';
import { StorageService } from './storage.service';

@EventSubscriber()
export class StorageSubscriber implements EntitySubscriberInterface {
  constructor(connection: Connection, readonly storageService: StorageService) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Storage {
    return Storage;
  }

  async afterLoad(storage: Storage): Promise<void> {
    storage.url = await this.storageService.replaceBySasUrl(storage.path);
  }
}
