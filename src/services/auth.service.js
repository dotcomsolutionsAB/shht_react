import { postRequest } from "./api.request";

const LOGIN_PATH = "/login";

export const loginApi = async (body) => await postRequest(LOGIN_PATH, body);
