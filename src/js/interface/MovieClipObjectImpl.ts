import type { Layer } from "../controller/core/domain/model/Layer";
import { InstanceObjectImpl } from "./InstanceObjectImpl";

export interface MovieClipObjectImpl extends InstanceObjectImpl
{
    layers?: Map<number, Layer>;
}