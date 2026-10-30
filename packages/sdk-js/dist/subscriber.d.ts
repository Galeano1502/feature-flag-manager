export declare class FlagSubscriber {
    private redis;
    constructor(redisUrl: string, onUpdate: (data: any) => void);
    disconnect(): void;
}
