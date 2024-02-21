import type { InstanceImpl } from "./InstanceImpl";

export interface ConfirmModalFileObjectImpl {
    file: File;
    instance: InstanceImpl<any>;
    path: string;
}