import type { Instance } from "@/core/domain/model/Instance";

export interface IConfirmModalFileObject <I extends Instance> {
    file: File;
    instance: I;
    path: string;
};