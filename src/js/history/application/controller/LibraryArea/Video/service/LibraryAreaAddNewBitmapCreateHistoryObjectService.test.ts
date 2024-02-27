import { execute } from "./LibraryAreaAddNewVideoCreateHistoryObjectService";
import { Video } from "../../../../../../core/domain/model/Video";
import { $LIBRARY_ADD_NEW_VIDEO_COMMAND } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewBitmapCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const video = new Video({
            "id": 10,
            "type": "video",
            "name": "Video_01"
        });
        const object = execute(1, 2, video.toObject(), "xyz");
        expect(object.command).toBe($LIBRARY_ADD_NEW_VIDEO_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(video.id);
        expect(object.messages[3]).toBe("xyz");

        // 表示様の配列のチェック
        expect(object.args[0]).toBe(video.name);
    });
});