import type { IBitmapPublishJson } from "./IBitmapPublishJson";
import type { IMovieClipPublishJson } from "./IMovieClipPublishJson";
import type { IVideoPublishJson } from "./IVideoPublishJson";
import type { IShapePublishJson } from "./IShapePublishJson";
import type { IStageObject } from "./IStageObject";

export interface IPublishObject {
    stage: IStageObject;
    characters: Array<IMovieClipPublishJson | IBitmapPublishJson | IVideoPublishJson | IShapePublishJson>;
    type: "json";
    symbols: Array<[string, number]>;
}