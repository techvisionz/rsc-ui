import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import LogInfoTable from "../loginfo/logInfoTable";
import { createNode } from "../../../backend/restshellbk";

var MySelf: CreateNode;
class CreateNode extends Component<any, any> {
    createNodeForm = createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            logsInfo: [],
        };

        MySelf=this;
    }

    async saveNode() {
        var form: any = MySelf.createNodeForm.current;

        var data = {
            name: form.nodeNameField.value,
            clientUrl:form.clientUrl.value,
            logsInfo: MySelf.state.logsInfo
        }

        await createNode(data).then((response: any) => {
            if (response && response.data) {
                MySelf.setState({ nodes: response.data });
            }
            MySelf.props.reloadHome();
        }).catch(async (error) => {
            console.log(error);
        });
    }

    deleteLogInfo(name:any) {
        var logsInfo = MySelf.state.logsInfo;
        logsInfo = logsInfo.filter((item:any)=> item.name !== name);
        MySelf.setState({logsInfo:logsInfo});
    }

    addLogInfo(data:any) {
        var logsInfo = MySelf.state.logsInfo;
        var existing = logsInfo.find((item:any)=> item.name === data.name);
        if(!existing) {
            logsInfo.push(data);
            MySelf.setState({logsInfo:logsInfo});
        }
    }

    render() {
        const { t, reloadHome } = this.props;

        return (
            <div>
                <div className="col-sm-6">
                    <h1 className="m-0">{t('createnode')}</h1>
                </div>

                <div>
                    <form ref={this.createNodeForm as React.RefObject<HTMLFormElement>}>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>{t("nodename")}</label>
                                    <input type="text" name="nodeNameField" id="nodeNameField" className="form-control"  placeholder={t('nodename')} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>{t("clientUrl")}</label>
                                    <input type="text" name="clientUrl" id="clientUrl" className="form-control"  placeholder={t('clientUrl')} />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("Logs")}</label>
                                <LogInfoTable reloadHome={reloadHome} isNew={true} addLogInfo={this.addLogInfo} deleteLogInfo={this.deleteLogInfo} logsInfo={this.state.logsInfo}></LogInfoTable>
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

export default withTranslation()(CreateNode);