import { execute } from "./PropertyAreaScrollUpdateHeightService";
import {
    $CONTROLLER_AREA_PROPERTY_BODY_ID,
    $PROPERTY_SCROLL_AREA_ID,
    $PROPERTY_SCROLL_BAR_ID
} from "../../../../config/PropertyConfig";

describe("PropertyAreaScrollUpdateHeightServiceTest", () =>
{
    test("execute test", () =>
    {
        const scrollAreaElement = document.createElement("div");
        document.body.appendChild(scrollAreaElement);
        scrollAreaElement.id = $PROPERTY_SCROLL_AREA_ID;

        const bodyElement = document.createElement("div");
        document.body.appendChild(bodyElement);
        bodyElement.id = $CONTROLLER_AREA_PROPERTY_BODY_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $PROPERTY_SCROLL_BAR_ID;

        expect(scrollBarElement.style.display).toBe("");

        execute();

        expect(scrollBarElement.style.display).toBe("none");

        scrollAreaElement.remove();
        bodyElement.remove();
        scrollBarElement.remove();
    });
});