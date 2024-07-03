import type { BitmapPublishJsonImpl } from "./BitmapPublishJsonImpl";
import type { MovieClipPublishJsonImpl } from "./MovieClipPublishJsonImpl";
import type { StageObjectImpl } from "./StageObjectImpl";

export interface PublishObjectImpl {
    stage: StageObjectImpl;
    characters: Array<MovieClipPublishJsonImpl | BitmapPublishJsonImpl>;
    type: "json";
    symbols: Array<[string, number]>;
}