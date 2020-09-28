import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { Storage } from './storage.entity';
import { StorageInterface } from './storage.interfaces';
import { StorageService } from './storage.service';

@EventSubscriber()
export class StorageSubscriber implements EntitySubscriberInterface {
  constructor(connection: Connection, readonly storageService: StorageService) {
    connection.subscribers.push(this);
  }

  listenTo(): typeof Storage {
    return Storage;
  }

  async afterLoad(storage: StorageInterface): Promise<void> {
    if (storage.path && storage.fileSystem) {
      storage.url = await this.storageService.getPublicUrl(storage.path, storage.fileSystem);
    }
  }
}
