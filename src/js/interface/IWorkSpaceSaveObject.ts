import type { IInstanceSaveObject } from "./IInstanceSaveObject";
import type { IStageObject } from "./IStageObject";
import type { IUserTimelineAreaStateObject } from "./IUserTimelineAreaStateObject";
import type { IUserToolAreaStateObject } from "./IUserToolAreaStateObject";
import type { IUserPropertyAreaStateObject } from "./IUserPropertyAreaStateObject";
import type { IUserControllerAreaStateObject } from "./IUserControllerAreaStateObject";
import type { IHistoryObject } from "./IHistoryObject";

export interface IWorkSpaceSaveObject
{
    version: number;
    id: number;
    name: string;
    stage: IStageObject;
    libraries: IInstanceSaveObject[];
    plugins: string[];
    historyIndex: number;
    histories: IHistoryObject[];
    tool?: IUserToolAreaStateObject;
    timeline?: IUserTimelineAreaStateObject;
    property?: IUserPropertyAreaStateObject
    controller?: IUserControllerAreaStateObject
}
