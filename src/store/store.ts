// src/store.ts
import Store from 'electron-store';

interface Schema {
  language: string;
}

export const store = new Store<Schema>({
  defaults: {
    language: 'en'
  }
});