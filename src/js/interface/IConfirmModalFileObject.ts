import type { Instance } from "@/core/domain/model/Instance";

export interface IConfirmModalFileObject <I extends Instance = Instance> {
    file: File;
    instance: I;
    path: string;
}