import BaseObject from "sap/ui/base/Object";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ODataModelHandler from "./ODataModelHandler";

interface ODataModelRegister {
    [name: string]: ODataModel;
}

interface ODataModelStore {
    [name: string]: ODataModelHandler;
}

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.odata
 */
export class ODataModelHandlerReg extends BaseObject {
    private _oDataModel: ODataModelStore = {};
    private _initializedHandler: Promise<boolean>;
    private _resolveHandler: (value: boolean | PromiseLike<boolean>) => void;

    private static _instance: ODataModelHandlerReg = null;

    public static getInstance() {
        if(!ODataModelHandlerReg._instance ) {
            ODataModelHandlerReg._instance = new ODataModelHandlerReg();
        }
        return ODataModelHandlerReg._instance;
    }

    private constructor() {
        super();
        this._initializedHandler = new Promise((resolve) => this._resolveHandler = resolve);
    }

    async isInitialized() {
        await this._initializedHandler;
    }

    reset() {
        this._oDataModel = {};
        this._initializedHandler = new Promise((resolve) => this._resolveHandler = resolve);
    }

    init(oDataModel: ODataModelRegister) {
        Object.keys(oDataModel).forEach((element) => {
            this._oDataModel[element] = new ODataModelHandler();
            this._oDataModel[element].init(oDataModel[element]);
        });

        this._resolveHandler(true);
    }

    getModel(sName?: string): ODataModelHandler {
        return this._oDataModel[typeof sName === "undefined" ? "" : sName];
    }
}