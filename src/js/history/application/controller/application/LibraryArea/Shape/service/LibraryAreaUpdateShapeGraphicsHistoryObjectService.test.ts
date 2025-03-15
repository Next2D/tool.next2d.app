import { execute } from "./LibraryAreaUpdateShapeGraphicsHistoryObjectService";
import { Shape } from "../../../../../../../core/domain/model/Shape";
import type { IBounds } from "../../../../../../../interface/IBounds";
import { $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND } from "../../../../../../../config/HistoryConfig";
import { describe, expect, it } from "vitest";

describe("LibraryAreaUpdateShapeGraphicsHistoryObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const shape = new Shape({
            "id": 10,
            "type": "shape",
            "name": "Shape_01"
        });

        const recodes = [1,2,3];

        const bounds: IBounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 100,
            "yMax": 100
        };

        const object = execute(1, 2, shape, recodes, bounds, "test");
        expect(object.command).toBe($LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(shape.id);
        expect(object.messages[2].type).toBe(shape.type);
        expect(object.messages[2].name).toBe(shape.name);
        expect(object.messages[3][0]).toBe(recodes[0]);
        expect(object.messages[3][1]).toBe(recodes[1]);
        expect(object.messages[3][2]).toBe(recodes[2]);
        expect(object.messages[4].xMin).toBe(bounds.xMin);
        expect(object.messages[4].yMin).toBe(bounds.yMin);
        expect(object.messages[4].xMax).toBe(bounds.xMax);
        expect(object.messages[4].yMax).toBe(bounds.yMax);
        expect(object.messages[5]).toBe("test");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("Shape_01");
    });
});