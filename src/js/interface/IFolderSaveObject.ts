import type { IFolderType } from "./IFolderType";
import type { IInstanceObject } from "./IInstanceObject";

export interface IFolderSaveObject extends IInstanceObject
{
    mode: IFolderType;
}