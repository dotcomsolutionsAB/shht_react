import { getRequest, postRequest, deleteRequest } from "../api.request";

const ORDERS_PATH = "/orders";

// orders apis

export const getOrders = async (body) =>
  await postRequest(`${ORDERS_PATH}/retrieve`, body);

export const getOrderById = async (id) =>
  await getRequest(`${ORDERS_PATH}/retrieve/${id}`);

export const getSoNo = async (body) =>
  await postRequest(`${ORDERS_PATH}/get_order_id`, body);

export const createOrder = async (body) =>
  await postRequest(`${ORDERS_PATH}/create`, body);

export const updateOrder = async (body) =>
  await postRequest(`${ORDERS_PATH}/update/${body?.id}`, body);

export const deleteOrder = async (body) =>
  await deleteRequest(`${ORDERS_PATH}/delete/${body?.id}`);

export const exportOrder = async (body) =>
  await postRequest(`${ORDERS_PATH}/export`, body);
