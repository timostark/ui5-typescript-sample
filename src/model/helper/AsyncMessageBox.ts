import MessageBox, { Action } from "sap/m/MessageBox";
import BaseObject from "sap/ui/base/Object";
import { TextDirection } from "sap/ui/core/library";

/**
 * @namespace com.msg.typescript.demo.model.helper
 */
class AsyncMessageBoxDef extends BaseObject{
    async confirm( vMessage: string, mOptions?: { onClose?: Function; title?: string; id?: string; styleClass?: string; initialFocus?: string | Action; textDirection?: TextDirection; verticalScrolling?: boolean; horizontalScrolling?: boolean; closeOnNavigation?: boolean; }) : Promise<Action> {
        return new Promise((resolve) => {
            mOptions.onClose = (e: Action) => {
                resolve(e);
            }
            
            MessageBox.confirm(vMessage, mOptions);
        });
    }
}

const AsyncMessageBox = new AsyncMessageBoxDef();
export default AsyncMessageBox;