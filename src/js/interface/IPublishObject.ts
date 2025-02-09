import type { IBitmapPublishJson } from "./IBitmapPublishJson";
import type { IMovieClipPublishJson } from "./IMovieClipPublishJson";
import type { IStageObject } from "./IStageObject";

export interface IPublishObject {
    stage: IStageObject;
    characters: Array<IMovieClipPublishJson | IBitmapPublishJson>;
    type: "json";
    symbols: Array<[string, number]>;
}