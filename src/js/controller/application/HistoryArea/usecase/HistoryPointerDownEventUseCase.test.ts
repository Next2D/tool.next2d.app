import { execute } from "./HistoryPointerDownEventUseCase";
import { $setExpireDate } from "../../../../user/application/Billing/BillingUtil";
import { $BILLING_REWARD_PERIOD } from "../../../../config/BillingConfig";
import { describe, expect, it, vi } from "vitest";
import { timelineHeader } from "../../../../timeline/domain/model/TimelineHeader";

describe("HistoryPointerDownEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true
            }),
            "preventDefault": vi.fn(() => { preventDefault = true }),
        } as unknown as PointerEvent;

        // 現在の有効期限のデータにプラスしてIndexedDBを更新する
        const date = new Date();
        date.setDate(date.getDate() + $BILLING_REWARD_PERIOD);

        // フォーマットをyyyy-mm-ddに変換
        const year  = date.getFullYear();
        const month = ("0" + String(date.getMonth() + 1)).slice(-2);
        const day   = ("0" + String(date.getDate())).slice(-2);
        $setExpireDate(`${year}-${month}-${day}`);

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        await execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });

    it("execute test case2", async () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true
            }),
            "preventDefault": vi.fn(() => { preventDefault = true }),
        } as unknown as PointerEvent;
    
        timelineHeader.stopFlag = false;
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        await execute(mockEvent);
        
        timelineHeader.stopFlag = true;
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
    });
});