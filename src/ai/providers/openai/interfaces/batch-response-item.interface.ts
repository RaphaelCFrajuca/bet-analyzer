import { ChatCompletion } from "openai/resources/chat/completions";

export interface BatchResponseItem {
    id: string;
    custom_id?: string;
    response?: {
        status_code: number;
        request_id: string;
        body: ChatCompletion;
    };
    error?: any;
}
