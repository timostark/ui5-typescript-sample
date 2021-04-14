import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";

import { ODataModelHandlerReg } from "./model/dataAccess/odata/ODataPromise"
import { NorthwindService } from "./model/dataAccess/odata/NorthwindService"
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

/**
 * @namespace com.msg.typescript.demo
 */
export default class ManualCapacityComponent extends UIComponent {
	_oLoadingPromise: Promise<any>;

	public static metadata = {
		manifest: "json"
	};

	init() {
		super.init();
		
		ODataModelHandlerReg.getInstance().init({ "": this.getODataModel() });
		NorthwindService.getInstance().init();

		this.setModel(new JSONModel(Device), "device");
		this.getRouter().initialize();
	}

	exit() {
		ODataModelHandlerReg.getInstance().reset();
	}


	getResourceBundle(): ResourceBundle {
		const resourceModel = <ResourceModel>this.getModel("i18n");
		return resourceModel.getResourceBundle() as ResourceBundle;
	}

	getLoadingPromise() {
		return this._oLoadingPromise;
	}

	getContentDensityClass() {
		return "sapUiSizeCompact"
	}

	getAppViewModel(): JSONModel {
		return this.getModel("appView") as JSONModel;
	}

	getODataModel(): ODataModel {
		return this.getModel() as ODataModel;
	}

	destroy(bSuppressInvalidate?: boolean) {
		super.destroy.apply(this, [bSuppressInvalidate]);
	}
}