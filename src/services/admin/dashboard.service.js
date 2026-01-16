import { getRequest } from "../api.request";

const DASHBOARD_PATH = "/dashboard";

// class group apis

export const getDashboardStats = async (params = {}) =>
  await getRequest(`${DASHBOARD_PATH}`, params);
