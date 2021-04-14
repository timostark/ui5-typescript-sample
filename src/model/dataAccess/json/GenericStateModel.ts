
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "../../../controller/BaseController";

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.json
 */
export class GenericJSONModel<T> extends JSONModel implements GenericJSONModelIntf {
    _testType: any;

    constructor(data: T, instanceName: string) {
        super();
        (data as any as GenericState).setModel(this);
        this._setData(data);
        GenericJSONModelFactory.getInstance().setModelInstance(this, instanceName);
    }

    public _setData(oData: T, bMerge?: boolean): void {
        this.setData(<any>oData, bMerge);

        this._checkUpdate();
    }

    public getState(): T {
        return this.oData as T;
    }

    public _checkUpdate() {
        (<any>this).checkUpdate(false, true);
    }
}
    
export function updateModel(target: any, propertyKey: string) {
    let originalMethod = target.descriptor.value;
    target.descriptor.value = function (...args: any[]) {
        let result = originalMethod.apply(this, args);
        (this as GenericState).getModel()._checkUpdate();
        return result;
    }
}

export class GenericJSONModelFactory {
    private static _instance: GenericJSONModelFactory;
    private _modelInstances: any = {};

    public static getInstance(): GenericJSONModelFactory {
        if (!GenericJSONModelFactory._instance) {
            GenericJSONModelFactory._instance = new GenericJSONModelFactory();
        }
        return GenericJSONModelFactory._instance;
    }

    public setModelInstance<T>(_mdl: GenericJSONModel<T>, name: string) {
        this._modelInstances[name] = _mdl;
    }

    public getModelInstance<T>(name: string): GenericJSONModel<T> {
        return this._modelInstances[name];
    }

    private constructor() {
        this._modelInstances = {};
    }
}

interface GenericJSONModelIntf {
    _checkUpdate(): void;
}

export class GenericState {
    protected _model?: GenericJSONModelIntf;

    public setModel(model: GenericJSONModelIntf) {
        this._model = model;
    }

    public getModel() {
        return this._model;
    }
}
