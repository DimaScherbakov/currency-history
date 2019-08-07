import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  cache = {};
  paramName = Symbol('class id');
  counter = 0;

  constructor() {}

  peekOne(entityClass, id) {
    const modelToken = this.modelToken(entityClass);
    debugger;
    const cachedEntity = this.cache[modelToken][id];
    return cachedEntity;
  }
  pushOne(entityClass, rawEntity) {
    this.push(entityClass, [rawEntity]);
  }

  peek(entityClass) {
    const modelToken = this.modelToken(entityClass);
    const cachedEntity = this.cache[modelToken];
    debugger;
    return cachedEntity;
  }
  push(entityClass, rawEntities) {
    const modelToken = this.modelToken(entityClass);

    debugger;
    rawEntities.forEach(entity => {
      if (this.cache[modelToken]) {
        this.cache[modelToken][entity.id] = entity;
      } else {
        this.cache[modelToken] = {};
        // this.cache[modelToken][0] = {};
        this.cache[modelToken][entity.id] = entity;
      }
    }, this);
  }

  private modelToken(modelClass) {
    if (!modelClass[this.paramName]) {
      modelClass[this.paramName] = this.counter;
      this.counter += 1;
    }

    return modelClass[this.paramName];
  }
}
