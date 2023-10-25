import { $PROGRESS_STATE_ID } from "../../../../config/ProgressMenuConfig";
import { execute } from "./ProgressMenuUpdateMessageService";

describe("ProgressMenuUpdateMessageServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $PROGRESS_STATE_ID;
        div.textContent = "test";
        document.body.appendChild(div);

        expect(div.textContent).toBe("test");
        execute("abcd");
        expect(div.textContent).toBe("abcd");

        div.remove();
    });
});