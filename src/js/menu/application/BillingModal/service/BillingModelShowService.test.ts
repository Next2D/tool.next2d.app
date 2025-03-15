import { execute } from "./BillingModelShowService";
import { describe, expect, it, vi } from "vitest";
import { $registerMenu } from "../../MenuUtil";
import { $BILLING_MODAL_NAME } from "../../../../config/MenuConfig";

describe("BillingModelShowService Test", () =>
{
    it("execute test", async () =>
    {
        let state = "hide";
        const mockMenu = {
            "name": $BILLING_MODAL_NAME,
            "show": vi.fn(() => state = "show")
        };
        $registerMenu(mockMenu);

        expect(state).toBe("hide");
        await execute();
        expect(state).toBe("show");
    });
});