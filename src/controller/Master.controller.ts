import MessageBox, { Action } from "sap/m/MessageBox";
import Table from "sap/m/Table";
import TableSelectDialog from "sap/m/TableSelectDialog";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import { GenericJSONModel } from "../model/dataAccess/json/GenericStateModel";
import { Customer, CustomerState, Orders } from "../model/dataAccess/odata/NorthwindModel";
import { NorthwindService } from "../model/dataAccess/odata/NorthwindService";
import { MasterControllerState, MasterControllerStateRO } from "../model/dataAccess/state/MasterControllerState";
import AsyncMessageBox from "../model/helper/AsyncMessageBox";
import BaseController from "./BaseController";

/**
 * @namespace com.msg.typescript.demo.controller
 */
export default class Master extends BaseController {
    _oViewModel = new GenericJSONModel<MasterControllerStateRO>(new MasterControllerState(), "master");
    _oDataAccess = NorthwindService.getInstance();
    _oTable : Table;
    _oState: MasterControllerStateRO = this._oViewModel.getState();

    public onInit() {
        this.getView().setModel(this._oViewModel, "masterView");
        this._initElements();
        this._loadData();
    }

    private _initElements() {
        this._oTable = this.getElement("idTable");
    }

    private async _loadData() {
        try {
            await this.getODataModel().metadataLoaded();

            const data = await this._oDataAccess.readAll();
            data.forEach((e) => {
            });

            this._oState.setCustomers(data);
        } catch (err) { }
        finally {
            this._oState.setBusy(false);
        }
    }

    protected async _onShowDetails(oEvent: Event) {
        const src = ( oEvent.getSource() as Control ).getBindingContext("masterView").getObject() as CustomerState;
        
        this._oTable.setBusy(true); //for the sake of that example
        const resp = await AsyncMessageBox.confirm(`Do you really want to delete the following orders: ${src.Orders.map((e) => e.OrderID).join(",")}`, { title: "Blub" });
        this._oTable.setBusy(false);
        if ( resp !== Action.OK ) {
            return;
        }

        src.deleteAllOrders();
    }

    protected _createNewCustomer() {
        this._oState.addCustomer(new CustomerState({
            CustomerID : ( this._oState.customers.length ).toString()
        }));
    }
}