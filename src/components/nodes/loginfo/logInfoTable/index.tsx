import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import {
    updateLogInfo
} from "../../../../backend/restshellbk";

var MySelf: LogInfoTable;
class LogInfoTable extends Component<any, any> {
    addLogInfoForm = createRef();
    nameField = createRef();
    logPathField = createRef();
    archivePathField = createRef();
    fileNameField = createRef();
    fileNameExtField = createRef();
    fileNamePatternField = createRef();
    datePatternField = createRef();
    rollingTypeField = createRef();

    constructor(props: any) {
        super(props);
        MySelf = this;
        this.state = {
            editLogInfo: false,
            editLogInfoId: 0
        }
    }

    addLogInfo() {
        var form: any = MySelf.addLogInfoForm.current;
        var data = {
            name: form.name.value,
            logPath: form.logPath.value,
            archiveLogPath: form.archiveLogPath.value,
            logFileName: form.logFileName.value,
            logFileNameExt: form.logFileNameExt.value,
            logFileNamePattern: form.logFileNamePattern.value,
            fileDatePattern: form.fileDatePattern.value,
            rollingType: form.rollingType.value
        }

        MySelf.props.addLogInfo(data);
    }

    editLogInfo(logInfo: any) {
        MySelf.setState({ editLogInfo: true, editLogInfoId: logInfo.id });
    }

    async saveLogInfo(logInfo: any) {
        logInfo.name = (this.nameField.current as any).value;
        logInfo.logPath = (this.logPathField.current as any).value;
        logInfo.archiveLogPath = (this.archivePathField.current as any).value;
        logInfo.logFileName = (this.fileNameField.current as any).value;
        logInfo.logFileNameExt = (this.fileNameExtField.current as any).value;
        logInfo.fileDatePattern = (this.datePatternField.current as any).value;
        logInfo.logFileNamePattern = (this.fileNamePatternField.current as any).value;
        logInfo.rollingType = (this.rollingTypeField.current as any).value;

        await updateLogInfo(logInfo).then((response: any) => {
            if (response && response.data) {
                MySelf.setState({ editLogInfo: false });
            }
        }).catch(async (error: any) => {
            console.log(error);
        });
    }

    render() {
        const { t, logsInfo, isNew } = this.props;
        const { editLogInfo, editLogInfoId } = this.state;

        return (
            <div>
                <form ref={this.addLogInfoForm as React.RefObject<HTMLFormElement>}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("name")}</label>
                                <input type="text" name="name" id="name" className="form-control" placeholder={t("name")} />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("logPath")}</label>
                                <input type="text" name="logPath" id="logPath" className="form-control" placeholder={t("logPath")} />
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("archiveLogPath")}</label>
                                <input type="text" name="archiveLogPath" id="archiveLogPath" className="form-control" placeholder={t("archiveLogPath")} />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("logFileName")}</label>
                                <input type="text" name="logFileName" id="logFileName" className="form-control" placeholder={t("logFileName")} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("logFileNameExt")}</label>
                                <input type="text" name="logFileNameExt" id="logFileNameExt" className="form-control" placeholder={t("logFileNameExt")} />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("fileDatePattern")}</label>
                                <input type="text" name="fileDatePattern" id="fileDatePattern" className="form-control" placeholder={t("fileDatePattern")} />
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("logFileNamePattern")}</label>
                                <input type="text" name="logFileNamePattern" id="logFileNamePattern" className="form-control" placeholder={t("logFileNamePattern")} />
                                <p style={{ fontSize: "8px" }}>[FILENAME].[DATE].[EXT]</p>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label>{t("rollingType")}</label>
                                <select defaultValue={1} className="form-control" name="rollingType" id="rollingType">
                                    <option value="1" key="1">Day</option>
                                    <option key="2" value="2">Hour</option>
                                    <option key="3" value="3">Minute</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <div className="btn-group w-50">
                                    <button type="button" className="btn btn-success" onClick={() => this.addLogInfo()}>{t('addLogInfo')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{t("id")}</th>
                            <th>{t("name")}</th>
                            <th>{t("logPath")}</th>
                            {editLogInfo ?  <th>{t("archiveLogPath")}</th> : null }
                            <th>{t("logFileName")}</th>
                            <th>{t("logFileNameExt")}</th>
                            <th>{t("logFileNamePattern")}</th>
                            <th>{t("fileDatePattern")}</th>
                            <th>{t("rollingType")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!logsInfo ? "" :
                            logsInfo.map((logInfo: any) => {
                                var id = isNew ? logInfo.name : logInfo.id;
                                var rollingType = 'Daily';

                                if (logInfo.rollingType === '2') {
                                    rollingType = "Hour";
                                } else if (logInfo.rollingType === '3') {
                                    rollingType = "Minute";
                                }

                                return (
                                    !editLogInfo || editLogInfoId != id ?
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td>{logInfo.name}</td>
                                            <td>{logInfo.logPath}</td>
                                            <td>{logInfo.logFileName}</td>
                                            <td>{logInfo.logFileNameExt}</td>
                                            <td>{logInfo.logFileNamePattern}</td>
                                            <td>{logInfo.fileDatePattern}</td>
                                            <td>{rollingType}</td>
                                            <td>
                                                {isNew ? "" :
                                                    <button type="button" onClick={() => this.editLogInfo(logInfo)} className="btn btn-block bg-gradient-success btn-sm">Edit</button>
                                                }
                                                <button type="button" onClick={() => this.props.deleteLogInfo(id)} className="btn btn-block bg-gradient-danger btn-sm">Delete</button>
                                            </td>
                                        </tr>
                                        :
                                        <tr key={id}>
                                            <td>{id}</td>
                                            <td><input defaultValue={logInfo.name} ref={this.nameField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.logPath} ref={this.logPathField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.archiveLogPath} ref={this.archivePathField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.logFileName} ref={this.fileNameField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.logFileNameExt} ref={this.fileNameExtField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.logFileNamePattern} ref={this.fileNamePatternField as React.RefObject<HTMLInputElement>} /></td>
                                            <td><input defaultValue={logInfo.fileDatePattern} ref={this.datePatternField as React.RefObject<HTMLInputElement>} /></td>
                                            <td>
                                                <select ref={this.rollingTypeField as React.RefObject<HTMLSelectElement>} defaultValue={rollingType} className="form-control" name="rollingType" id="rollingType">
                                                    <option value="1" key="1">Day</option>
                                                    <option key="2" value="2">Hour</option>
                                                    <option key="3" value="3">Minute</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => this.saveLogInfo(logInfo)} className="btn btn-block bg-gradient-primary btn-sm">Save</button>
                                            </td>
                                        </tr>

                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
        )
    }
}

export default withTranslation()(LogInfoTable);