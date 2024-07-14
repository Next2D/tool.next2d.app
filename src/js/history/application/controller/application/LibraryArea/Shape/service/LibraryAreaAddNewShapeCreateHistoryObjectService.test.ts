import { execute } from "./LibraryAreaAddNewShapeCreateHistoryObjectService";
import { Shape } from "../../../../../../../core/domain/model/Shape";
import { $LIBRARY_ADD_NEW_SHAPE_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewShapeCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const shape = new Shape({
            "id": 10,
            "type": "shape",
            "name": "Shape_01"
        });

        const object = execute(1, 2, shape, "test");
        expect(object.command).toBe($LIBRARY_ADD_NEW_SHAPE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(shape.id);
        expect(object.messages[2].type).toBe(shape.type);
        expect(object.messages[2].name).toBe(shape.name);
        expect(object.messages[3]).toBe("test");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("Shape_01");
    });
});