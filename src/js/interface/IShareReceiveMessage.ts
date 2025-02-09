export interface IShareReceiveMessage
{
    roomId: string;
    historyCommand: number;
    data: any[];
    command: string;
}