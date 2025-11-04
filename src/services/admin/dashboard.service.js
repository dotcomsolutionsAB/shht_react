import { postRequest } from "../api.request";

const DASHBOARD_PATH = "/dashboard";

// class group apis

export const getDashboardStats = async (body) =>
  await postRequest(`${DASHBOARD_PATH}`, body);
