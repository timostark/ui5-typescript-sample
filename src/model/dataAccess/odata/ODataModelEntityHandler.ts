import BaseObject from "sap/ui/base/Object";
import Context from "sap/ui/model/Context";
import Filter from "sap/ui/model/Filter";
import Sorter from "sap/ui/model/Sorter";
import ODataModelHandler from "./ODataModelHandler";
import { ODataEntityResults } from "./NorthwindModel";

interface ODataUrlParameter {
    "$expand": string
}

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.odata
 */
export default class ODataModelEntityHandlerDef<B> extends BaseObject {
    protected _oDataModel: ODataModelHandler = null;
    constructor(oDataModel: ODataModelHandler) {
        super();
        this._oDataModel = oDataModel;
    }

    async create(sPath: string, oData: B, mParameters?: { context?: object; success?: Function; error?: Function; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; }): Promise<B> {
        return <any>this._oDataModel.create(sPath, <any>oData, mParameters);
    }

    async update(sPath: string, oData: B, mParameters?: { context?: object; success?: Function; error?: Function; eTag?: string; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; }): Promise<B> {
        return <any>this._oDataModel.update(sPath, <any>oData, mParameters);
    }

    async remove(sPath: string, mParameters?: { context?: object; success?: Function; error?: Function; eTag?: string; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; }): Promise<void> {
        return <any>this._oDataModel.remove(sPath, mParameters);
    }
    
    async callFunction(sFunctionName: string,  mParameters?: {changeSetId?: string;error?: Function;eTag?: string;groupId?: string;headers?: any;method?: string;refreshAfterChange?: boolean;success?: Function;urlParameters?: any;}) : Promise<unknown> {
        return <any>this._oDataModel.callFunction(sFunctionName, mParameters);
     }

    async read(sPath: string, mParameters?: {
        context?: object;
        urlParameters?: ODataUrlParameter;
        filters?: Filter[];
        sorters?: Sorter[];
        success?: Function;
        error?: Function;
        batchGroupId?: string;
        groupId?: string;
        updateAggregatedMessages?: boolean;
    }): Promise<ODataEntityResults<B>> {
        return <any>this._oDataModel.read(sPath, mParameters);
    }

    async submitChanges(mParameters?: { groupId?: string; success?: Function; error?: Function; }): Promise<unknown> {
        return this._oDataModel.submitChanges(mParameters);
    }

    public getContext(path: string) : Context {
        return this._oDataModel.getContext(path);
    }

    public createEntry(sPath: string, mParameters: { changeSetId?: string; context?: Context; error?: Function; expand?: string; groupId?: string; headers?: any; properties?: B; refreshAfterChange?: boolean; success?: Function; urlParameters?: any; }): Context {
        return this._oDataModel.createEntry(sPath, <any>mParameters);
    }

    public deleteCreatedEntry(ctx: Context) {
        return this._oDataModel.deleteCreatedEntry(ctx);
    }
    
    public createKey(sCollection: string, oKeyProps: B) {
        return this._oDataModel.createKey(sCollection, <any>oKeyProps);
    }

    async readSingle(sPath: string, mParameters?: {
        context?: object;
        urlParameters?: ODataUrlParameter;
        filters?: Filter[];
        sorters?: Sorter[];
        success?: Function;
        error?: Function;
        batchGroupId?: string;
        groupId?: string;
        updateAggregatedMessages?: boolean;
    }): Promise<B> {
        return <any>this._oDataModel.read(sPath, mParameters);
    }
}