import type { FolderTypeImpl } from "./FolderTypeImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface FolderObjectImpl extends InstanceObjectImpl
{
    mode: FolderTypeImpl;
}