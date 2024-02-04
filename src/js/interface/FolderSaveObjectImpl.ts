import type { FolderTypeImpl } from "./FolderTypeImpl";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface FolderSaveObjectImpl extends InstanceObjectImpl
{
    mode: FolderTypeImpl;
}