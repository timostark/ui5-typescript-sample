import jQuery from "jquery.sap.global";
import MessageBox, { Action, Icon } from "sap/m/MessageBox";
import BaseObject from "sap/ui/base/Object";
import Context from "sap/ui/model/Context";
import Filter from "sap/ui/model/Filter";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Sorter from "sap/ui/model/Sorter";
import ODataModelEntityHandlerDef from "./ODataModelEntityHandler";

/**
 * @namespace com.msg.typescript.demo.model.dataAccess.odata
 */
export default class ODataModelHandler extends BaseObject {
    private _oDataModel: ODataModel = null;

    init(oDataModel: ODataModel) {
        this._oDataModel = oDataModel;
        this._oDataModel.setRefreshAfterChange(false);
    }


    handleODataError(oRet: any) {
        const oErr = this._parseReturnMessage(oRet.responseText);
        MessageBox.show(oErr.text, {
            icon: Icon.ERROR,
            details: oErr.details,
            actions: [Action.CLOSE]
        });
    }


    handleResponse(oRet: any) : boolean {
        const oErr = oRet.__batchResponses ? this._parseBatchResponse(oRet) : this._parseReturnMessage(oRet.responseText);
        if (oErr) {
            MessageBox.show(oErr.text, {
                icon: Icon.ERROR,
                details: oErr.details,
                actions: [Action.CLOSE]
            });
            return false;
        }
        return true;
    }

    handleBatchResponse(oRet: any) {
        const oErr = this._parseBatchResponse(oRet);
        if (oErr) {
            MessageBox.show(oErr.text, {
                icon: Icon.ERROR,
                details: oErr.details,
                actions: [Action.CLOSE]
            });
        }
    }

    _parseReturnMessage(sToParse: any): any {
        if (Object.keys(sToParse).length === 0 || !sToParse) {
            return null;
        }

        let oJSONResponse;
        let oXMLResponse;
        try {
            //check for JSON Format
            oJSONResponse = JSON.parse(sToParse);
        } catch (e) {
            //recheck for XML Format - Assumption: XML only happens on error cases
            try {
                oXMLResponse = $.parseXML(sToParse);
                if (oXMLResponse && $(oXMLResponse).find("message").text()) {
                    oJSONResponse = {
                        error: $(oXMLResponse).find("message").text()
                    };
                } else {
                    oJSONResponse = {
                        error: sToParse
                    };
                }
            } catch (e) {
                oJSONResponse = {
                    error: sToParse
                };
            }
        }

        if (oJSONResponse.error) {
            if (oJSONResponse.error.message && oJSONResponse.error.message.value) {
                return {
                    text: oJSONResponse.error.message.value,
                    details: oJSONResponse
                };
            }
            return {
                text: oJSONResponse.error.toString(),
                details: oJSONResponse
            };
        }
        return {
            text: oJSONResponse.toString(),
            details: oJSONResponse
        };
    }

    _parseBatchResponse(oResponseObj: any) {
        if ($.isEmptyObject(oResponseObj)) {
            return null;
        }

        const oResponse = typeof oResponseObj.responseText !== "undefined" ? oResponseObj.responseText : oResponseObj;
        if (!oResponse.__batchResponses) {
            return;
        }

        for (let i = 0; i < oResponse.__batchResponses.length; i++) {
            const oBatchResponse = oResponse.__batchResponses[i];
            if (!oBatchResponse.response || !oBatchResponse.response.body) {
                continue;
            }

            const oJSONResponse = JSON.parse(oBatchResponse.response.body);
            if (!oJSONResponse.error) {
                continue;
            }

            return this._parseReturnMessage(oBatchResponse.response.body);
        }

        return null;
    }

    async submitChanges(mParameters?: { groupId?: string; success?: Function; error?: Function; }): Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;
            mParameters.success = (e: unknown) => {
                const bOK = this.handleResponse(e);
                if (bOK) {
                    if (fnSuccess) { fnSuccess(e); }
                    resolve(e);
                } else if (!bOK) {
                    reject(e);
                    if (fnError) {
                        fnError(e);
                    }
                }
            };

            mParameters.error = (e: unknown) => {
                reject(e);
                this.handleResponse(e);
                if (fnError) {
                    fnError(e);
                }
            };

            this._oDataModel.submitChanges(mParameters);
        });
    }

    getContext(path: string) : Context {
        return this._oDataModel.getContext(path);
    }

    getEntity<T>() {
        return new ODataModelEntityHandlerDef<T>(this);
    }

    createEntry(sPath: string, mParameters: { changeSetId?: string; context?: Context; error?: Function; expand?: string; groupId?: string; headers?: any; properties?: any[] | object; refreshAfterChange?: boolean; success?: Function; urlParameters?: any; }): Context {
        return this._oDataModel.createEntry(sPath, mParameters);
    }

    deleteCreatedEntry(ctx: Context) {
        return this._oDataModel.deleteCreatedEntry(ctx);
    }

    createKey(sCollection: string, oKeyProps: object) {
        return this._oDataModel.createKey(sCollection, oKeyProps);
    }

    async callFunction(sFunctionName: string,  mParameters?: {changeSetId?: string;error?: Function;eTag?: string;groupId?: string;headers?: any;method?: string;refreshAfterChange?: boolean;success?: Function;urlParameters?: any;})
     : Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;
            mParameters.success = (e: unknown) => { resolve(e); if (fnSuccess) { fnSuccess(e); } }
            
            mParameters.error = (e: unknown) => {
                reject(e);
                if ( !mParameters.groupId ) {
                    this.handleResponse(e);
                }
                
                if (fnError) {
                    fnError(e);
                }
            };


            this._oDataModel.callFunction(sFunctionName, mParameters);
        });
    }

    async remove(sPath: string, mParameters?: { context?: object; success?: Function; error?: Function; eTag?: string; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; })
        : Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;
            mParameters.success = (e: unknown) => { resolve(e); if (fnSuccess) { fnSuccess(e); } }
            
            mParameters.error = (e: unknown) => {
                reject(e);
                if ( !mParameters.groupId ) {
                    this.handleResponse(e);
                }
                
                if (fnError) {
                    fnError(e);
                }
            };


            this._oDataModel.remove(sPath, mParameters);
        });
    }

    async update(sPath: string, oData: object, mParameters?: { context?: object; success?: Function; error?: Function; eTag?: string; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; })
        : Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;



            mParameters.success = (e: unknown) => { resolve(e); if (fnSuccess) { fnSuccess(e); } }
            mParameters.error = (e: unknown) => {
                reject(e);
                if ( !mParameters.groupId ) {
                    this.handleResponse(e);
                }

                if (fnError) {
                    fnError(e);
                }
            };

            this._oDataModel.update(sPath, oData, mParameters);
        });
    }

    async create(
        sPath: string,
        oData: object,
        mParameters?: { context?: object; success?: Function; error?: Function; urlParameters?: any; headers?: any; groupId?: string; changeSetId?: string; refreshAfterChange?: boolean; })
        : Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;
            mParameters.success = (e: unknown) => { resolve(e); if (fnSuccess) { fnSuccess(e); } }

            mParameters.error = (e: unknown) => {
                reject(e);
                if ( !mParameters.groupId ) {
                    this.handleResponse(e);
                }
                
                if (fnError) {
                    fnError(e);
                }
            };

            this._oDataModel.create(sPath, oData, mParameters);
        });
    }

    async read(sPath: string, mParameters?: {
        context?: object;
        urlParameters?: any;
        filters?: Filter[];
        sorters?: Sorter[];
        success?: Function;
        error?: Function;
        batchGroupId?: string;
        groupId?: string;
        updateAggregatedMessages?: boolean;
    }): Promise<unknown> {
        return new Promise((resolve, reject) => {
            mParameters = typeof mParameters === "undefined" ? {} : mParameters;
            const fnSuccess = mParameters.success;
            const fnError = mParameters.error;
            mParameters.success = (e: unknown) => { resolve(e); if (fnSuccess) { fnSuccess(e); } }
            mParameters.error = (e: unknown) => { reject(e); if (fnError) { fnError(e); } }

            this._oDataModel.read(sPath, mParameters);
        });
    }
}
