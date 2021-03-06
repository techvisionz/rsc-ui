import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import {
    doLogout, getServices, updateService, createService, search, getNodes,
    updateNode, createLogInfo, deleteLogInfo, deleteNodeInfo, addNodeInfo
} from "../../backend/restshellbk";
import { Alert } from "react-bootstrap";
import 'flag-icon-css/css/flag-icons.min.css';
import i18n from "i18next";
import EditNode from "../nodes/editNode";
import CreateNode from "../nodes/createNode";
import moment from 'moment';

const EDIT_SERVICE = "EDIT_SERVICE";
const CREATE_SERVICE = "CREATE_SERVICE";
const USE_SERVICE = "USE_SERVICE";
const EDIT_NODE = "EDIT_NODE";
const CREATE_NODE = "CREATE_NODE";


var MySelf: RestShellApp;
class RestShellApp extends Component<any, any> {
    editServiceForm = createRef();
    createServiceForm = createRef();
    searchForm = createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            loggedIn: false,
            services: [],
            nodes: [],
            service: {},
            node: {},
            action: "",
            showError: false,
            showSuccess: false,
            rsMessage: "",
            hideLoading: true
        };
        MySelf = this;
    }

    changeDirection(className: any, rtl: boolean, extraClasses: any) {
        var findClassName = className;
        var applyClass = className + "-rtl " + extraClasses;
        if (!rtl) {
            findClassName += "-rtl";
            applyClass = className + " " + extraClasses;
        }

        var myDiv = document.getElementsByClassName(findClassName).item(0);
        if (myDiv && myDiv != null)
            myDiv.className = applyClass;
    }

    setLang(lang: any) {

        if (lang === 'en') {
            document.dir = "ltr";
            document.body.dir = "ltr";
            document.body.style.direction = "ltr";

            this.changeDirection("main-header", false, "navbar navbar-expand navbar-white navbar-light");
            this.changeDirection("flex-column", false, "nav nav-pills nav-sidebar");
            this.changeDirection("content-wrapper", false, "");
            // var myDiv = document.getElementsByClassName('main-header-rtl').item(0);
            // if(myDiv && myDiv != null)
            // myDiv.className="main-header navbar navbar-expand navbar-white navbar-light";

            // myDiv = document.getElementsByClassName('nav nav-pills nav-sidebar flex-column-rtl').item(0);
            // if(myDiv && myDiv != null)
            // myDiv.className="nav nav-pills nav-sidebar flex-column";


        } else {
            document.dir = "rtl";
            document.body.dir = "rtl";
            // var myDiv = document.getElementsByClassName('main-header').item(0);
            // if(myDiv && myDiv != null)
            // myDiv.className="main-header-rtl navbar navbar-expand navbar-white navbar-light";

            // myDiv = document.getElementsByClassName('nav nav-pills nav-sidebar flex-column').item(0);
            // if(myDiv && myDiv != null)
            // myDiv.className="nav nav-pills nav-sidebar flex-column-rtl";            

            this.changeDirection("main-header", true, "navbar navbar-expand navbar-white navbar-light");
            this.changeDirection("flex-column", true, "nav nav-pills nav-sidebar");
            this.changeDirection("content-wrapper", true, "content-wrapper");

            document.body.style.direction = "rtl";

            var children = document.children as HTMLCollectionOf<HTMLElement>;
            var i;
            for (i = 0; i < children.length; i++) {
                children[i].style.direction = "rtl";
                children[i].dir = "rtl";
            }
        }
        document.body.lang = lang;
        i18n.changeLanguage(lang);
    }

    componentDidMount() {
        this.populateData();
    }

    populateData() {
        MySelf.populateServices();
        MySelf.populateNodes();
    }

    async populateNodes() {
        await getNodes().then((response: any) => {
            if (response && response.data) {
                MySelf.setState({ nodes: response.data });
            }
        }).catch(async (error) => {
            console.log(error);
            await doLogout();
            MySelf.props.checkLogin();
        });
    }

    async populateServices() {
        await getServices().then((response: any) => {
            if (response && response.data) {
                MySelf.setState({ services: response.data });
            }
        }).catch(async (error) => {
            console.log(error);
            await doLogout();
            MySelf.props.checkLogin();
        });
    }

    reloadHome() {
        MySelf.populateData();
        MySelf.selectHome();
    }


    async useService() {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        await MySelf.setState({ action: "" });
        await MySelf.setState({ action: USE_SERVICE });

        // @ts-ignore
        $('#logDate').daterangepicker({
            timePicker: true,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY hh:mm'
            }
        });
    }

    async createServiceAction() {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        await MySelf.setState({ action: "" });
        await MySelf.setState({ action: CREATE_SERVICE });
    }

    async createNodeAction() {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        await MySelf.setState({ action: "" });
        await MySelf.setState({ action: CREATE_NODE });
    }

    async selectService(serviceId: any) {
        await MySelf.setState({ action: "" });
        await MySelf.setState({ service: this.state.services.find((item: any) => item.id == serviceId) });
        await MySelf.setState({ action: EDIT_SERVICE });
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
    }

    async selectNode(nodeId: any) {
        await MySelf.setState({ action: "" });
        await MySelf.setState({ node: this.state.nodes.find((item: any) => item.id == nodeId) });
        await MySelf.setState({ action: EDIT_NODE });
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
    }

    async selectHome() {
        //e.preventDefault();
        MySelf.setState({ action: "" });
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
    }

    async doLogout(e: any) {
        e.preventDefault();
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        await doLogout();
        MySelf.props.checkLogin();
    }

    async naddNode(e: any) {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        var form: any = MySelf.createServiceForm.current;
        var options = form.nserviceNodes.options;

        var newNode = form.nnewNode.value;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            var opt = options[i];

            if (opt.value == newNode) {
                return;
            }
        }

        if (newNode && newNode.length > 0) {
            var newOpt = new Option(newNode, newNode);
            form.nserviceNodes.options.add(newOpt);
        }
    }

    async nremoveNode(e: any) {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        var form: any = MySelf.createServiceForm.current;
        var options = form.nserviceNodes.options;
        for (var i = 0, iLen = options.length; i < iLen; i++) {
            var opt = options[i];

            if (opt && opt.selected) {
                opt.remove();
            }
        }
    }

    async addNode(e: any) {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        var form: any = MySelf.editServiceForm.current;
        var options = form.serviceNodes.options;
        var allNodes = MySelf.state.nodes;
        var newNode = form.newNode.value;

        var selectedNode = allNodes.find((item: any) => item.name === newNode);

        if (selectedNode) {
            await addNodeInfo({ id: selectedNode.id }, MySelf.state.service.id).then((response: any) => {
                if (response && response.data) {
                }
            }).catch(async (error) => {
                console.log(error);
            });

            for (var i = 0, iLen = options.length; i < iLen; i++) {
                var opt = options[i];

                if (opt.value == newNode) {
                    return;
                }
            }

            if (newNode && newNode.length > 0) {
                var newOpt = new Option(newNode, newNode);
                form.serviceNodes.options.add(newOpt);
            }
        }

    }

    async removeNode(e: any) {
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        var form: any = MySelf.editServiceForm.current;
        var options = form.serviceNodes.options;
        var allNodes = MySelf.state.nodes;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            var opt = options[i];

            if (opt && opt.selected) {
                var selectedNode = allNodes.find((item: any) => item.name === options[i].value);
                if (selectedNode) {
                    await deleteNodeInfo({ id: selectedNode.id }, MySelf.state.service.id).then((response: any) => {
                        if (response && response.data) {
                        }
                    }).catch(async (error) => {
                        console.log(error);
                    });

                    opt.remove();
                }
            }
        }
    }

    async createService(e: any) {
        var form: any = MySelf.createServiceForm.current;
        var nodes: any = [];
        var allNodes = MySelf.state.nodes;
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        const { t } = MySelf.props;

        var options = form.nserviceNodes.options;
        for (var i = 0, iLen = options.length; i < iLen; i++) {
            var selectedNode = allNodes.find((item: any) => item.name === options[i].value);

            if (selectedNode)
                nodes.push({ id: selectedNode.id });
        }

        var service = {
            name: form.nserviceName.value,
            nodesInfo: nodes,
        }

        createService(service).then(async (response: any) => {
            if (response && response.data) {
                await MySelf.setState({ showSuccess: true, showError: false, rsMessage: t('success_message') });
                this.reloadHome();
            }
        }).catch(async (error) => {
            console.log(error);
            await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_creating_service') });
        });

        this.populateServices();
    }

    async saveService(e: any) {
        var form: any = MySelf.editServiceForm.current;
        var nodes: any = [];
        var allNodes = MySelf.state.nodes;
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        const { t } = MySelf.props;

        var options = form.serviceNodes.options;
        for (var i = 0, iLen = options.length; i < iLen; i++) {

            var selectedNode = allNodes.find((item: any) => item.name === options[i].value);

            if (selectedNode)
                nodes.push({ id: selectedNode.id });
        }

        var service = {
            id: MySelf.state.service.id,
            name: form.serviceName.value,
            nodesInfo: nodes,
        }

        updateService(service).then(async (response: any) => {
            if (response && response.data) {
                await MySelf.setState({ showSuccess: true, showError: false, rsMessage: t('success_message') });
            }

            MySelf.reloadHome();
        }).catch(async (error) => {
            console.log(error);
            await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_saving_service') });
        });
    }

    async searchService(e: any) {
        var form: any = MySelf.searchForm.current;
        var allNodes = MySelf.state.nodes;
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "", hideLoading: false });
        const { t } = MySelf.props;
        var options = form.selectedNodes.options;

        if (!options || !form.searchString.value || form.searchString.value.length <1) {
            await MySelf.setState({ hideLoading: true, showSuccess: false, showError: true, rsMessage: t('please_select_required_params') });
            return;
        }

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            var opt = options[i];

            if (opt && opt.selected) {

                var selectedNode = allNodes.find((item: any) => item.name === opt.value);

                if (selectedNode) {

                    var selectedLogInfo = selectedNode.logsInfo.find((item: any) => item.name === form.logInfo.value);

                    if (selectedLogInfo) {
                        var searchData = {
                            "searchCommand": form.searchCommand.value,
                            "searchString": form.searchString.value,
                            "logPath": selectedLogInfo.logPath,
                            "archiveLogPath": selectedLogInfo.archiveLogPath,
                            "logFileName": selectedLogInfo.logFileName,
                            "fileDatePattern": selectedLogInfo.fileDatePattern,
                            "logFileNamePattern": selectedLogInfo.logFileNamePattern,
                            "logFileNameExt": selectedLogInfo.logFileNameExt,
                            "rollingType": selectedLogInfo.rollingType,
                            "fileDate": form.logDate.value,
                            "searchInArchive": form.searchInArchive.value,
                            "includePattern": form.includePattern.value,
                            "linesAfter": form.linesAfter.value,
                            "linesBefore": form.linesBefore.value,
                            "timeoutSeconds": form.timeout.value
                        }

                        await search(selectedNode.clientUrl, searchData).then(async (response: any) => {
                            if (response && response.data) {

                                form.searchResults.value += "======== Data From [" + opt.value + "] ==========\n"
                                form.searchResults.value += response.data.result;
                            }
                        }).catch(async (error) => {
                            console.log(error);
                            await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_search') });
                        });
                    }
                }

            }
        }
        await MySelf.setState({ hideLoading: true });
    }

    async clearResults(e: any) {
        var form: any = MySelf.searchForm.current;
        var nodes: any = [];
        await MySelf.setState({ showSuccess: false, showError: false, rsMessage: "" });
        const { t } = MySelf.props;

        form.searchResults.value = "";

    }

    async deleteLogInfo(logInfoId: any) {
        const { t } = MySelf.props;
        if (MySelf.state.node) {
            var node = MySelf.state.node;
            await deleteLogInfo({ id: logInfoId }, node.id).then(async (response: any) => {
                if (response && response.data) {
                    await MySelf.populateNodes();
                    await MySelf.selectNode(node.id);
                }
            }).catch(async (error) => {
                console.log(error);
                await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_update') });
            });
        }
    }

    async addLogInfo(data: any) {
        const { t } = MySelf.props;
        if (MySelf.state.node) {
            var node = MySelf.state.node;
            await createLogInfo(data, node.id).then(async (response: any) => {
                if (response && response.data) {
                    await MySelf.populateNodes();
                    await MySelf.selectNode(node.id);
                }
            }).catch(async (error) => {
                console.log(error);
                await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_update') });
            });
        }
    }

    async saveNode(name: any, url: any) {
        const { t } = MySelf.props;
        var node = MySelf.state.node;
        node.name = name;
        node.clientUrl = url;
        await updateNode(node).then(async (response: any) => {
            if (response && response.data) {
                // await MySelf.populateNodes();
                // await MySelf.selectNode(node.id);
                MySelf.reloadHome();
            }
        }).catch(async (error) => {
            console.log(error);
            await MySelf.setState({ showSuccess: false, showError: true, rsMessage: t('error_while_update') });
        });
    }

    render() {
        const { t } = this.props;
        const { hideLoading } = this.state;

        return (
            <div className="hold-transition sidebar-mini">
                <nav className="main-header navbar navbar-expand navbar-white navbar-light">

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                        </li>
                        <li className="nav-item d-none d-sm-inline-block">
                            <a href="#" className="nav-link" onClick={this.selectHome}>{t("home")}</a>
                        </li>
                        <li className="nav-item d-none d-sm-inline-block">
                            <a href="#" className="nav-link" onClick={this.createServiceAction}>{t("createservice")}</a>
                        </li>
                        <li className="nav-item d-none d-sm-inline-block">
                            <a href="#" className="nav-link" onClick={this.createNodeAction}>{t("createnode")}</a>
                        </li>
                        <li className="nav-item d-none d-sm-inline-block">
                            <a href="#" onClick={this.doLogout} className="nav-link">Logout</a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">

                        {/* <li className="nav-item">
                            <a className="nav-link" href="#" role="button" onClick={() => this.setLang('en')}>
                                <span className="flag-icon flag-icon-us flag-icon-squared"></span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" role="button" onClick={() => this.setLang('ar')}>
                                <span className="flag-icon flag-icon-sa flag-icon-squared"></span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" role="button" onClick={() => this.setLang('urd')}>
                                <span className="flag-icon flag-icon-pk flag-icon-squared"></span>
                            </a>
                        </li> */}


                        <li className="nav-item">
                            <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                                <i className="fas fa-expand-arrows-alt"></i>
                            </a>
                        </li>
                    </ul>
                </nav>



                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <a href="#" onClick={this.selectHome} className="brand-link">
                        {/* <img src="../../dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity:"0.8"}} /> */}
                        <span className="brand-text font-weight-light">{t('restshell')}</span>
                    </a>

                    <div className="sidebar">

                        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div className="image" style={{ color: 'white' }}>
                                <img src={sessionStorage.rsUserAvatar} className="img-circle elevation-2" alt={sessionStorage.rsUsername} />
                                <span style={{ paddingLeft: 5, paddingRight: 5 }}>{sessionStorage.rsUsername}</span>
                            </div>
                            <div className="info" style={{ color: 'white' }}>
                                {sessionStorage.rbUsername}
                            </div>
                        </div>

                        <div className="form-inline">
                            <div className="input-group" data-widget="sidebar-search">
                                <input className="form-control form-control-sidebar" type="search" placeholder={t('search')} aria-label={t('search')} />
                                <div className="input-group-append">
                                    <button className="btn btn-sidebar">
                                        <i className="fas fa-search fa-fw"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        <i className="nav-icon fas fa-table"></i>
                                        <p>
                                            Services
                                            <i className="fas fa-angle-left right"></i>
                                        </p>
                                    </a>
                                    <ul className="nav nav-treeview">
                                        {!this.state.services ? "" :
                                            this.state.services.map((service: any) => {
                                                return (
                                                    <li className="nav-item" key={service.id} onClick={() => this.selectService(service.id)}>
                                                        <a href="#" className="nav-link">
                                                            <i className="far fa-columns nav-icon"></i>
                                                            <p>
                                                                {service.name}
                                                            </p>
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        <i className="nav-icon fas fa-copy"></i>
                                        <p>
                                            Nodes
                                            <i className="fas fa-angle-left right"></i>
                                        </p>
                                    </a>
                                    <ul className="nav nav-treeview">
                                        {!this.state.nodes ? "" :
                                            this.state.nodes.map((node: any) => {
                                                return (
                                                    <li className="nav-item" key={node.id} onClick={() => this.selectNode(node.id)}>
                                                        <a href="#" className="nav-link">
                                                            <i className="far fa-circle nav-icon"></i>
                                                            <p>
                                                                {node.name}
                                                            </p>
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </nav>

                    </div>

                </aside>

                <div className="content-wrapper">
                    <div className="content-header">
                        <div className="container-fluid">
                            <Alert key={1} variant={'danger'} show={this.state.showError}>
                                {this.state.rsMessage}
                            </Alert>
                            <Alert key={2} variant={'success'} show={this.state.showSuccess}>
                                {this.state.rsMessage}
                            </Alert>
                            <div className="row mb-2">
                                {this.state.action && this.state.action == EDIT_SERVICE ?
                                    <div className="card-body">
                                        <div className="col-sm-6">
                                            <h1 className="m-0">{this.state.service.name}</h1>
                                        </div>

                                        <div>
                                            <div className="btn-group w-25">
                                                <button type="button" className="btn btn-primary" onClick={() => this.useService()}>{t('useservice')}</button>
                                            </div>
                                            <form ref={this.editServiceForm as React.RefObject<HTMLFormElement>}>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <input type="hidden" name="serviceId" id="serviceId" className="form-control" defaultValue={this.state.service.name} />
                                                            <label>{t("servicename")}</label>
                                                            <input type="text" name="serviceName" id="serviceName" className="form-control" defaultValue={this.state.service.name} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label>{t("node")}</label>
                                                            <select className="form-control" name="newNode" id="newNode">
                                                                {this.state.nodes.map((node: any) => {
                                                                    return (
                                                                        <option key={node.id}>{node.name}</option>
                                                                    )
                                                                })
                                                                }
                                                            </select>
                                                            <div className="btn-group w-25">
                                                                <button type="button" className="btn btn-success" onClick={() => this.addNode(this)}>{t('addNode')}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label>{t("nodes")}</label>
                                                            <select multiple={true} className="form-control" name="serviceNodes" id="serviceNodes">
                                                                {this.state.service.nodesInfo.map((node: any) => {
                                                                    return (
                                                                        <option key={node.id}>{node.name}</option>
                                                                    )
                                                                })
                                                                }
                                                            </select>
                                                            <div className="btn-group w-50">
                                                                <button type="button" className="btn btn-danger" onClick={() => this.removeNode(this)}>{t('removenode')}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="btn-group w-25">
                                                    <button type="button" className="btn btn-primary" onClick={() => this.saveService(this)}>{t('save')}</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    : this.state.action == CREATE_SERVICE ?
                                        <div className="card-body">
                                            <div className="col-sm-6">
                                                <h1 className="m-0">{t("createservice")}</h1>
                                            </div>
                                            <div>
                                                <form ref={this.createServiceForm as React.RefObject<HTMLFormElement>}>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label>{t("servicename")}</label>
                                                                <input type="text" name="nserviceName" id="nserviceName" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label>{t("node")}</label>
                                                                {/* <input type="text" name="nnewNode" id="nnewNode" className="form-control" placeholder={t("newNode")} /> */}
                                                                <select className="form-control" name="nnewNode" id="nnewNode">
                                                                    {this.state.nodes.map((node: any) => {
                                                                        return (
                                                                            <option key={node.id}>{node.name}</option>
                                                                        )
                                                                    })
                                                                    }
                                                                </select>
                                                                <div className="btn-group w-25">
                                                                    <button type="button" className="btn btn-success" onClick={() => this.naddNode(this)}>{t('addNode')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label>{t("nodes")}</label>
                                                                <select multiple={true} className="form-control" name="nserviceNodes" id="nserviceNodes">
                                                                </select>
                                                                <div className="btn-group w-50">
                                                                    <button type="button" className="btn btn-danger" onClick={() => this.nremoveNode(this)}>{t('removenode')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="btn-group w-25">
                                                        <button type="button" className="btn btn-primary" onClick={() => this.createService(this)}>{t('save')}</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div> : this.state.action == USE_SERVICE ?
                                            <div className="card-body">
                                                <div className="col-sm-6">
                                                    <h1 className="m-0">{t("workingwith")} - {this.state.service.name}</h1>
                                                </div>
                                                <div>
                                                    <form ref={this.searchForm as React.RefObject<HTMLFormElement>}>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("searchcommand")}</label>
                                                                    <select className="form-control" name="searchCommand" id="searchCommand">
                                                                        <option>{t("grep")}</option>
                                                                        <option>{t("awk")}</option>
                                                                        <option>{t("nawk")}</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("searchstring")}</label>
                                                                    <input type="text" name="searchString" id="searchString" className="form-control" required />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("nodes")}</label>
                                                                    <select multiple={true} className="form-control" name="selectedNodes" id="selectedNodes" required>
                                                                        {this.state.service.nodesInfo.map((node: any) => {
                                                                            return (
                                                                                <option key={node.id}>{node.name}</option>
                                                                            )
                                                                        })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("loginfo")}</label>
                                                                    <select className="form-control" name="logInfo" id="logInfo">
                                                                        {this.state.service.nodesInfo[0] && this.state.service.nodesInfo[0].logsInfo.map((logInfo: any) => {
                                                                            return (
                                                                                <option key={logInfo.id}>{logInfo.name}</option>
                                                                            )
                                                                        })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("linesbefore")}</label>
                                                                    <input type="text" name="linesBefore" id="linesBefore" className="form-control" defaultValue={10} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("linesafter")}</label>
                                                                    <input type="text" name="linesAfter" id="linesAfter" className="form-control" defaultValue={10} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("timeout")}</label>
                                                                    <input type="text" name="timeout" id="timeout" className="form-control" defaultValue={10} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("includePattern")}</label>
                                                                    <select defaultValue={1} className="form-control" name="includePattern" id="includePattern">
                                                                        <option key="False" value="False">No</option>
                                                                        <option key="True" value="True">Yes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("logDate")}</label>
                                                                    <div className="input-group date">
                                                                        <input type="text" className="form-control float-right" name="logDate" id="logDate" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label>{t("searchInArchive")}</label>
                                                                    <select defaultValue={1} className="form-control" name="searchInArchive" id="searchInArchive">
                                                                        <option key="False" value="False">No</option>
                                                                        <option key="True" value="True">Yes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {hideLoading ?
                                                            <div className="col-sm-12 w-25">
                                                                <button id="searchBtn" name="searchBtn" type="button" className="btn btn-primary" onClick={() => this.searchService(this)}>{t('search')}</button>
                                                            </div>
                                                            : ""
                                                        }

                                                        {!hideLoading ?
                                                            <div className="col-sm-12 w-25">
                                                                <button className="btn btn-primary" type="button" disabled>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    Loading...
                                                                </button>
                                                            </div>
                                                            : ""
                                                        }

                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <div className="form-group">
                                                                    <label>{t("searchresult")}</label>
                                                                    <textarea className="form-control" name="searchResults" id="searchResults" rows={3} placeholder="Enter ..."></textarea>
                                                                </div>
                                                                <div className="btn-group w-25">
                                                                    <button type="button" className="btn btn-primary" onClick={() => this.clearResults(this)}>{t('clear')}</button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                            : this.state.action == EDIT_NODE ?
                                                <div className="card-body">
                                                    <EditNode reloadHome={this.reloadHome} saveNode={this.saveNode} addLogInfo={this.addLogInfo} deleteLogInfo={this.deleteLogInfo} node={this.state.node} />
                                                </div>
                                                : this.state.action == CREATE_NODE ?
                                                    <div className="card-body">
                                                        <CreateNode reloadHome={this.reloadHome} />
                                                    </div>
                                                    : ""
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );

    }
}

export default withTranslation()(RestShellApp);