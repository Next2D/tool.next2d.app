import { ShortcutKeyStringImpl } from "./ShortcutKeyStringImpl";
import { ShortcutViewObjectImpl } from "./ShortcutViewObjectImpl";

export type ShortcutSaveObjectImpl =
{
    // eslint-disable-next-line no-unused-vars
    [key in ShortcutKeyStringImpl]: ShortcutViewObjectImpl[]
}