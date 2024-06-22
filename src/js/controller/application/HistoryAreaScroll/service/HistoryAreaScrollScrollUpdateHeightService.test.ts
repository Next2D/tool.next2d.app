import { execute } from "./HistoryAreaScrollUpdateHeightService";
import {
    $HISTORY_LIST_ID,
    $HISTORY_LIST_SCROLL_AREA_ID,
    $HISTORY_LIST_SCROLL_BAR_ID
} from "../../../../config/HistoryConfig";

describe("HistoryAreaScrollUpdateHeightServiceTest", () =>
{
    test("execute test", () =>
    {
        const scrollAreaElement = document.createElement("div");
        document.body.appendChild(scrollAreaElement);
        scrollAreaElement.id = $HISTORY_LIST_SCROLL_AREA_ID;

        const bodyElement = document.createElement("div");
        document.body.appendChild(bodyElement);
        bodyElement.id = $HISTORY_LIST_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $HISTORY_LIST_SCROLL_BAR_ID;

        expect(scrollBarElement.style.display).toBe("");

        execute();

        expect(scrollBarElement.style.display).toBe("none");

        scrollAreaElement.remove();
        bodyElement.remove();
        scrollBarElement.remove();
    });
});