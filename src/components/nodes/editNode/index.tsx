import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import LogInfoTable from "../loginfo/logInfoTable";


var MySelf: EditNode;
class EditNode extends Component<any, any> {
    editNodeForm = createRef();

    constructor(props: any) {
        super(props);
        MySelf=this;
    }

    saveNode() {
        var form: any = MySelf.editNodeForm.current;

        MySelf.props.saveNode(form.nodeNameField.value, form.clientUrl.value);
    }

    render() {
        const { t, node, deleteLogInfo, addLogInfo, saveNode, reloadHome } = this.props;

        return (
            <div>
                <div className="col-sm-6">
                    <h1 className="m-0">{node.name}</h1>
                </div>

                <div>
                    <form ref={this.editNodeForm as React.RefObject<HTMLFormElement>}>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <input type="hidden" name="nodeId" id="nodeId" className="form-control" defaultValue={node.id} />
                                    <label>{t("nodename")}</label>
                                    <input type="text" name="nodeNameField" id="nodeNameField" className="form-control" defaultValue={node.name} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>{t("clientUrl")}</label>
                                    <input type="text" name="clientUrl" id="clientUrl" className="form-control" defaultValue={node.clientUrl} />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("Logs")}</label>
                                <LogInfoTable reloadHome={reloadHome} isNew={false} addLogInfo={addLogInfo} deleteLogInfo={deleteLogInfo} logsInfo={node.logsInfo}></LogInfoTable>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group w-25">
                        <button type="button" className="btn btn-primary" onClick={this.saveNode}>{t('save')}</button>
                    </div>
                </div>

            </div>
        )
    }
}

export default withTranslation()(EditNode);