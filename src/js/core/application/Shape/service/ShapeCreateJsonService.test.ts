import { execute } from "./ShapeCreateJsonService";
import { describe, expect, it } from "vitest";
import { Shape } from "../../../../core/domain/model/Shape";
import { Shape as DisplayShape } from "@next2d/display";
import { $SHAPE_TYPE } from "../../../../config/InstanceConfig";

describe("ShapeCreateJsonService Test", () =>
{
    it("test case", () =>
    {
        const shape = new Shape({
            "id": 1,
            "type": $SHAPE_TYPE,
            "recodes": [],
            "symbol": "symbol",
            "bounds": {
                "xMin": 10,
                "xMax": 20,
                "yMin": 30,
                "yMax": 40
            },
        });

        const object = execute(shape)
        expect(object.extends).toBe(DisplayShape.namespace);
        expect(object.recodes.length).toBe(0);
        expect(object.bounds.xMin).toBe(10);
        expect(object.bounds.xMax).toBe(20);
        expect(object.bounds.yMin).toBe(30);
        expect(object.bounds.yMax).toBe(40);
        expect(object.symbol).toBe("symbol");
    });
});