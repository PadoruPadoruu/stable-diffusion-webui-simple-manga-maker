class PromptMultiKeyMap {
  constructor() {
    this.storyOrderMap = new Map();
    this.typeMap = new Map();
    this.typeSubtypeMap = new Map();
    this.typeSubtypePlayMap = new Map();
    this.typePlayMap = new Map();
  }

  add(item) {
    const { storyOrder, type, subtype, name, positive, negative, play } = item;
    
    this.storyOrderMap.set(Number(storyOrder), item);

    if (!this.typeMap.has(type)) {
      this.typeMap.set(type, []);
    }
    this.typeMap.get(type).push(item);

    const typeSubtypeKey = `${type}:${subtype}`;
    if (!this.typeSubtypeMap.has(typeSubtypeKey)) {
      this.typeSubtypeMap.set(typeSubtypeKey, []);
    }
    this.typeSubtypeMap.get(typeSubtypeKey).push(item);

    const typeSubtypePlayKey = `${type}:${subtype}:${play}`;
    if (!this.typeSubtypePlayMap.has(typeSubtypePlayKey)) {
      this.typeSubtypePlayMap.set(typeSubtypePlayKey, []);
    }
    this.typeSubtypePlayMap.get(typeSubtypePlayKey).push(item);

    const typePlayKey = `${type}:${play}`;
    if (!this.typePlayMap.has(typePlayKey)) {
      this.typePlayMap.set(typePlayKey, []);
    }
    this.typePlayMap.get(typePlayKey).push(item);
  }

  getByStoryOrder(storyOrder) {
    return this.storyOrderMap.get(Number(storyOrder)) || null;
  }

  getRandomByStoryOrders(...storyOrders) {
    const flattenedOrders = storyOrders.flat();
    
    const mappedItems = flattenedOrders.map(order => {
      const result = this.storyOrderMap.get(Number(order));
      return result;
    });
    const filteredItems = mappedItems.filter(item => item !== undefined && item !== null);
    
    if (filteredItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      return filteredItems[randomIndex];
    }
    return null;
  }

  getByStoryOrderRange(start, end) {
    const items = Array.from(this.storyOrderMap.entries())
      .filter(([order]) => order >= start && order <= end)
      .map(([_, item]) => item);
    return items;
  }

  getRandomByStoryOrderRange(start, end) {
    const items = this.getByStoryOrderRange(start, end);
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }

  getRandomByType(type) {
    const items = this.typeMap.get(type) || [];
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }

  getRandomByTypeAndSubtype(type, subtype) {
    const key = `${type}:${subtype}`;
    const items = this.typeSubtypeMap.get(key) || [];
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }

  getRandomByTypeSubtypeAndPlay(type, subtype, play) {
    const key = `${type}:${subtype}:${play}`;
    const items = this.typeSubtypePlayMap.get(key) || [];
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }

  getRandomByTypeAndPlay(type, play) {
    const key = `${type}:${play}`;
    const items = this.typePlayMap.get(key) || [];
    return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
  }
}

const promptMultiKeyMap = new PromptMultiKeyMap();