import { ActionType } from "./action-Type";

export interface Action {
    type: ActionType;
    payload?: any;
}