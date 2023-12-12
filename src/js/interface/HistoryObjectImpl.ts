export interface HistoryObjectImpl {
    command: string;
    undo: Function;
    redo: Function;
}