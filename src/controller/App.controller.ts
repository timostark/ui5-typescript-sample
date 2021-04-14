import Event from "sap/ui/base/Event";
import View from "sap/ui/core/mvc/View";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GenericJSONModel } from "../model/dataAccess/json/GenericStateModel";
import { AppControllerStateRO, AppControllerState } from "../model/dataAccess/state/AppControllerState";
import BaseController from "./BaseController";

/**
 * @namespace com.msg.typescript.demo.controller
 */
export default class App extends BaseController {
	_oViewModel: GenericJSONModel<AppControllerStateRO> = null;
    _oState: AppControllerState = null;
	_oModel: ODataModel;

	onInit() {
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		this._initViewModel();
		this._initBusy();
	}

	private _initViewModel() {
        this._oViewModel = new GenericJSONModel<AppControllerStateRO>(new AppControllerState(), "app");
        this._oState = this._oViewModel.getState();

		this.setModel(this._oViewModel, "appView");
	}

	private async _initBusy() {
		await this.getOwnerComponent().getODataModel().metadataLoaded();
        this._oState.setBusy(false);
        this._oState.setDelay(this.getView().getBusyIndicatorDelay());
	}
}