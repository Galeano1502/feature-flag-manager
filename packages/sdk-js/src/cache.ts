export class LocalCache {
  private cache: Map<string, any> = new Map();

  get(key: string): any | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  setAll(flags: Record<string, any>): void {
    this.cache.clear();
    for (const [key, value] of Object.entries(flags)) {
      this.cache.set(key, value);
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}