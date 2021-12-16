import axios from "axios";

var backendBaseUrl = "http://localhost:8099";

let config = {
  api: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "",
    },
  },
};

export const api = axios.create({ ...config.api });

api.interceptors.request.use(
  async (conf: any) => {

    if (sessionStorage.rsToken) {
      conf.headers.Authorization = sessionStorage.rsToken;
    }
    return conf;
  },
  (err) => {
    console.log("error in getting ", err);
  }
);

api.interceptors.response.use((response:any) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 403) {
    await doLogout();
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

const doLogin = async (user: any, pass: any) => {
  await getToken(user, pass);
  return true;
}

const isLoggedIn = () => {
  return sessionStorage.rsToken ? true : false;
};


const getToken = async (user: any, pass: any) => {
  var token = "";
  var reqData = { "username": user, "password": pass };
  await api.request({
    method: 'post',
    url: backendBaseUrl + "/login",
    data: (reqData),
    headers: {
      "Content-Type": "application/json",
    }
  }).then((response) => {
    if (response.headers.authorization != null && response.headers.authorization.length > 0) {
      sessionStorage.rsToken = response.headers.authorization;
      sessionStorage.rsUsername = user;
      sessionStorage.rsUserAvatar = "https://w7.pngwing.com/pngs/624/109/png-transparent-computer-icons-system-administrator-symbol-network-administrator-computer-user-ico-miscellaneous-blue-text.png";
    }
  }).catch((error) => {
    console.log(error);
    token = "";
  });
  return token;
}


const doLogout = async () => {
  sessionStorage.removeItem('rsToken');
  sessionStorage.removeItem('rsUserId');
  sessionStorage.removeItem('rsUsername');
  sessionStorage.removeItem('rsUserAvatar');
  sessionStorage.removeItem('rsWorksapces');
  sessionStorage.removeItem('rsMessage');
  return true;
};

const getServices = () => {
  return api.get(
    `${backendBaseUrl}/rsc/api/services/all`
  );
};

const getNodes = () => {
  return api.get(
    `${backendBaseUrl}/rsc/api/nodes/all`
  );
};

const getNode = (name:any) => {
  return api.get(
    `${backendBaseUrl}/rsc/api/nodes/all`
  );
};

const createLogInfo = (data: any, nodeId:any) => {
  return api.post(`${backendBaseUrl}/rsc/api/nodes/${nodeId}/loginfo/add`, data);
};

const deleteLogInfo = (data: any, nodeId:any) => {
  return api.post(`${backendBaseUrl}/rsc/api/nodes/${nodeId}/loginfo/delete`, data);
};

const createNode = (data: any) => {
  return api.post(`${backendBaseUrl}/rsc/api/nodes/create`, data);
};

const updateNode = (data: any) => {
  return api.post(`${backendBaseUrl}/rsc/api/nodes/update`, data);
};

const updateService = (data: any) => {
  return api.post(`${backendBaseUrl}/rsc/api/services/update`, data);
};

const updateLogInfo = (data: any) => {
  return api.post(`${backendBaseUrl}/rsc/api/loginfo/update`, data);
};

const deleteNodeInfo = (data: any, serviceId:any) => {
  return api.post(`${backendBaseUrl}/rsc/api/services/${serviceId}/nodeinfo/delete`, data);
};

const addNodeInfo = (data: any, serviceId:any) => {
  return api.post(`${backendBaseUrl}/rsc/api/services/${serviceId}/nodeinfo/add`, data);
};

const createService = (data: any) => {
  return api.post(`${backendBaseUrl}/rsc/api/services/create`, data);
};

const search = (host: any, data: any) => {
  return api.post(`http://${host}/rsc/api/search`, data);
};



export { doLogin, isLoggedIn, doLogout, getServices, updateService, createService, search,
  getNodes, updateNode, createLogInfo, deleteLogInfo, createNode, deleteNodeInfo, addNodeInfo,
  updateLogInfo };