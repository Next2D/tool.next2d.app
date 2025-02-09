import type { IBitmapPublishJson } from "./IBitmapPublishJson";
import type { MovieClipPublishJsonImpl } from "./MovieClipPublishJsonImpl";
import type { StageObjectImpl } from "./StageObjectImpl";

export interface PublishObjectImpl {
    stage: StageObjectImpl;
    characters: Array<MovieClipPublishJsonImpl | IBitmapPublishJson>;
    type: "json";
    symbols: Array<[string, number]>;
}