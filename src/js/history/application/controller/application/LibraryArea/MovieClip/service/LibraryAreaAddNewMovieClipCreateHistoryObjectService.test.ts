import { execute } from "./LibraryAreaAddNewMovieClipCreateHistoryObjectService";
import { $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewMovieClipCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, 0, "MovieClip", 10);
        expect(object.command).toBe($LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe("MovieClip");
        expect(object.messages[4]).toBe(10);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("MovieClip");
    });
});