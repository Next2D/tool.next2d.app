import type { Layer } from "@/core/domain/model/Layer";

export interface HistoryObjectImpl {
    command: string;
    object?: Layer;
    targetObject?: Layer;
}