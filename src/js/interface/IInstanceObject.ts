import type { IInstanceType } from "./IInstanceType";

export interface IInstanceObject
{
    id: number;
    type: IInstanceType;
    name: string;
    symbol?: string;
    folderId?: number;
}