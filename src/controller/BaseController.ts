import ResourceBundle from "sap/base/i18n/ResourceBundle";
import UI5Element from "sap/ui/core/Element";
import MessageManager from "sap/ui/core/message/MessageManager";
import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import Model from "sap/ui/model/Model";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ManualCapacityComponent from "./../Component"

/**
 * @namespace com.msg.typescript.demo.controller
 */
export default class BaseController extends Controller {
	public getRouter(): Router {
		return this.getOwnerComponent().getRouter();
	}

	public getModel<T extends Model>(sName?: string): T {
		return <T>this.getView().getModel(sName);
	}

	public setModel(oModel: Model, sName: string | null | undefined) {
		return this.getView().setModel(oModel, sName);
	}

	public getODataModel(): ODataModel {
		return this.getOwnerComponent().getODataModel();
	}

	public getResourceBundle() : ResourceBundle {
		return this.getOwnerComponent().getResourceBundle();
	}
	
	public getText(text: string, parameter ?: string[] | number[]) : string {
		return this.getOwnerComponent().getResourceBundle().getText(text, parameter);
	}

	public getAppViewModel(): JSONModel {
		return this.getOwnerComponent().getAppViewModel();
	}

	public getElement<T extends UI5Element>(id: string): T {
		const elem = this.byId(id);
		return <T>elem;
	}

	public getOwnerComponent(): ManualCapacityComponent {
		return <ManualCapacityComponent>super.getOwnerComponent();
	}

	public isDirty(): boolean {
		return false;
	}

	public getMessageManager(): MessageManager {
		return sap.ui.getCore().getMessageManager();
	}
}