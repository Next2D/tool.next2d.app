import type { IFolderType } from "./IFolderType";
import type { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface IFolderSaveObject extends InstanceObjectImpl
{
    mode: IFolderType;
}