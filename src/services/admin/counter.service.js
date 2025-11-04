import { getRequest, postRequest, deleteRequest } from "../api.request";

const COUNTER_PATH = "/counter";

// counter apis

export const getCounters = async (body) =>
  await postRequest(`${COUNTER_PATH}/retrieve`, body);

export const getCounterById = async (id) =>
  await getRequest(`${COUNTER_PATH}/retrieve/${id}`);

export const createCounter = async (body) =>
  await postRequest(`${COUNTER_PATH}/create`, body);

export const updateCounter = async (body) =>
  await postRequest(`${COUNTER_PATH}/update/${body?.id}`, body);

export const deleteCounter = async (body) =>
  await deleteRequest(`${COUNTER_PATH}/delete/${body?.id}`);
