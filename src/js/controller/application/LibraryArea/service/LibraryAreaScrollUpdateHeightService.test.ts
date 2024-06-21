import { execute } from "./LibraryAreaScrollUpdateHeightService";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_LIST_BOX_SCROLL_AREA_ID,
    $LIBRARY_LIST_BOX_SCROLL_BAR_ID
} from "../../../../config/LibraryConfig";

describe("LibraryAreaScrollUpdateHeightServiceTest", () =>
{
    test("execute test", () =>
    {
        const scrollAreaElement = document.createElement("div");
        document.body.appendChild(scrollAreaElement);
        scrollAreaElement.id = $LIBRARY_LIST_BOX_SCROLL_AREA_ID;

        const listBoxElement = document.createElement("div");
        document.body.appendChild(listBoxElement);
        listBoxElement.id = $LIBRARY_LIST_BOX_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $LIBRARY_LIST_BOX_SCROLL_BAR_ID;

        expect(scrollBarElement.style.display).toBe("");

        execute();

        expect(scrollBarElement.style.display).toBe("none");

        scrollAreaElement.remove();
        listBoxElement.remove();
        scrollBarElement.remove();
    });
});