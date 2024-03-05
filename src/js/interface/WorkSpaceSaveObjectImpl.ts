import type{ InstanceSaveObjectImpl } from "./InstanceSaveObjectImpl";
import type { StageObjectImpl } from "./StageObjectImpl";
import type { UserTimelineAreaStateObjectImpl } from "./UserTimelineAreaStateObjectImpl";
import type { UserToolAreaStateObjectImpl } from "./UserToolAreaStateObjectImpl";
import type { UserPropertyAreaStateObjectImpl } from "./UserPropertyAreaStateObjectImpl";
import type { UserControllerAreaStateObjectImpl } from "./UserControllerAreaStateObjectImpl";
import type { HistoryObjectImpl } from "./HistoryObjectImpl";

export interface WorkSpaceSaveObjectImpl
{
    version: number;
    id: number;
    name: string;
    stage: StageObjectImpl;
    libraries: InstanceSaveObjectImpl[];
    plugins: string[];
    historyIndex: number;
    histories: HistoryObjectImpl[];
    tool?: UserToolAreaStateObjectImpl;
    timeline?: UserTimelineAreaStateObjectImpl;
    property?: UserPropertyAreaStateObjectImpl
    controller?: UserControllerAreaStateObjectImpl
}
