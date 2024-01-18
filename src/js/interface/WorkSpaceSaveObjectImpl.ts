import type{ InstanceSaveObjectImpl } from "./InstanceSaveObjectImpl";
import type { StageObjectImpl } from "./StageObjectImpl";
import type { UserTimelineAreaStateObjectImpl } from "./UserTimelineAreaStateObjectImpl";
import type { UserToolAreaStateObjectImpl } from "./UserToolAreaStateObjectImpl";
import type { UserPropertyAreaStateObjectImpl } from "./UserPropertyAreaStateObjectImpl";
import type { UserControllerAreaStateObjectImpl } from "./UserControllerAreaStateObjectImpl";

export interface WorkSpaceSaveObjectImpl
{
    version: number;
    id: number;
    name: string;
    stage: StageObjectImpl;
    libraries: InstanceSaveObjectImpl[];
    plugins: string[];
    tool?: UserToolAreaStateObjectImpl;
    timeline?: UserTimelineAreaStateObjectImpl;
    property?: UserPropertyAreaStateObjectImpl
    controller?: UserControllerAreaStateObjectImpl
}
