import { execute } from "./HistoryAddElementUseCase";
import { $HISTORY_LIST_ID } from "../../../../config/HistoryConfig";;
import { describe, expect, it } from "vitest";

describe("HistoryAddElementUseCase Test", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $HISTORY_LIST_ID;
        document.body.appendChild(div);

        expect(div.children.length).toBe(0);
        execute(1, 0, "test", "", "test1", "test2");
        expect(div.children.length).toBe(1);

        div.remove();
    });
});