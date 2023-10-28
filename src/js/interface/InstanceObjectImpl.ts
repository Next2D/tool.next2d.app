import { InstanceTypeImple } from "./InstanceTypeImpl";

export interface InstanceObjectImpl
{
    id: number;
    name: string;
    type: InstanceTypeImple;
    symbol: string;
    folderId?: number;
}