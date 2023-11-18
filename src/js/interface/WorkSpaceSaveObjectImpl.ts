import type{ InstanceSaveObjectImpl } from "./InstanceSaveObjectImpl";
import type { StageObjectImpl } from "./StageObjectImpl";
import type { UserTimelineAreaStateObjectImpl } from "./UserTimelineAreaStateObjectImpl";
import type { UserToolAreaStateObjectImpl } from "./UserToolAreaStateObjectImpl";

export interface WorkSpaceSaveObjectImpl
{
    version: number;
    name: string;
    stage: StageObjectImpl;
    libraries: InstanceSaveObjectImpl[];
    plugins: string[];
    tool: UserToolAreaStateObjectImpl;
    timeline: UserTimelineAreaStateObjectImpl;
}
