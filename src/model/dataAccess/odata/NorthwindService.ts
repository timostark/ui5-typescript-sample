
import ODataModelEntityHandlerDef from "./ODataModelEntityHandler";
import { ODataModelHandlerReg } from "./ODataPromise";
import { Customer, CustomerState } from "./NorthwindModel";

export class NorthwindService {
    private _oModel: ODataModelEntityHandlerDef<Customer>;
    private static _oInstance : NorthwindService;

    public static getInstance() {
        if(!NorthwindService._oInstance) {
            NorthwindService._oInstance = new NorthwindService();
        }
        return NorthwindService._oInstance;
    }

    private constructor() {
    }

    public init() {
        this._oModel = ODataModelHandlerReg.getInstance().getModel().getEntity<Customer>();
    }

    public async readAll( ) : Promise<CustomerState[]>{
        const ret = await this._oModel.read("/Customers", { urlParameters: { $expand : "Orders,Orders/Order_Details" }});

        const retDef = ret.results.map((e) => new CustomerState(e));
        return retDef;
    }

}