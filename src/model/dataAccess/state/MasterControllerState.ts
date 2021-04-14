import { updateModel, GenericState } from "../json/GenericStateModel";
import { Customer, CustomerState } from "../odata/NorthwindModel";

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.state
 */
export class MasterControllerState extends GenericState {
    busy: boolean = true;
    delay: number = 0;
    customers: CustomerState[] = [];
    
    get amountOfCustomers() : Number {
        return this.customers.length;
    }

    @updateModel
    public setCustomers(cus: CustomerState[]) {
        this.customers = cus.map((e) => {
            e.setModel(this.getModel());
            return e;
        });
    }

    @updateModel
    public addCustomer(cus: CustomerState ) {
        this.customers.push(cus);
    }
    
    @updateModel
    public setDelay(iDelay: number) {
        this.delay = iDelay;
    }
    
    @updateModel
    public setBusy(bBusy: boolean) {
        this.busy = bBusy;
    }
}
export type MasterControllerStateRO = { +readonly [P in keyof MasterControllerState]: MasterControllerState[P] };