import { InstanceTypeImpl } from "./InstanceTypeImpl";

export interface InstanceObjectImpl
{
    id: number;
    type: InstanceTypeImpl;
    name?: string;
    symbol?: string;
    folderId?: number;
}