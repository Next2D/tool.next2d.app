import type { InstanceImpl } from "./InstanceImpl";

export interface IConfirmModalFileObject {
    file: File;
    instance: InstanceImpl<any>;
    path: string;
}