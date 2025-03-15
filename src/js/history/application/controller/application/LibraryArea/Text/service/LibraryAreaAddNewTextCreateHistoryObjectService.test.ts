import { execute } from "./LibraryAreaAddNewTextCreateHistoryObjectService";
import { Shape } from "../../../../../../../core/domain/model/Shape";
import { $LIBRARY_ADD_NEW_TEXT_COMMAND } from "../../../../../../../config/HistoryConfig";
import { describe, expect, it } from "vitest";

describe("LibraryAreaAddNewShapeCreateHistoryObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const shape = new Shape({
            "id": 10,
            "type": "shape",
            "name": "Shape_01"
        });

        const object = execute(1, 2, shape);
        expect(object.command).toBe($LIBRARY_ADD_NEW_TEXT_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(3);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(shape.id);
        expect(object.messages[2].type).toBe(shape.type);
        expect(object.messages[2].name).toBe(shape.name);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("Shape_01");
    });
});