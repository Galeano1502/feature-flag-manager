export declare class LocalCache {
    private cache;
    get(key: string): any | undefined;
    set(key: string, value: any): void;
    setAll(flags: Record<string, any>): void;
    delete(key: string): void;
    clear(): void;
}
