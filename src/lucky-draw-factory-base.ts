import { ILuckyDrawService } from './i-lucky-draw-service';

export abstract class LuckyDrawFactoryBase {
    public abstract findLuckyDrawServices(): Promise<{ [no: number]: ILuckyDrawService; }>;
}