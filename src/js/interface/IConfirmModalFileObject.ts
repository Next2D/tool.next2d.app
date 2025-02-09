import type { IInstance } from "./IInstance";

export interface IConfirmModalFileObject {
    file: File;
    instance: IInstance<any>;
    path: string;
}