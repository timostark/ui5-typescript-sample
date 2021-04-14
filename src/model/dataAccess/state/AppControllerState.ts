import { updateModel, GenericState } from "../json/GenericStateModel";

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.state
 */
export class AppControllerState extends GenericState {
    busy = true;
    delay = 0;
    
    @updateModel
    public setDelay(iDelay: number) {
        this.delay = iDelay;
    }

    @updateModel
    public setBusy(bBusy: boolean) {
        this.busy = bBusy;
    }
}
export type AppControllerStateRO = { +readonly [P in keyof AppControllerState]: AppControllerState[P] };