import { $PROGRESS_BAR_ID } from "../../../../config/ProgressMenuConfig";
import { execute } from "./ProgressMenuUpdateStateService";

describe("ProgressMenuUpdateStateServiceTest", () =>
{
    test("execute test", () =>
    {
        const progress = document.createElement("progress");
        progress.id = $PROGRESS_BAR_ID;
        progress.max = 100;
        progress.value = 0;
        document.body.appendChild(progress);

        expect(progress.value).toBe(0);
        execute(88);
        expect(progress.value).toBe(88);

        progress.remove();
    });
});