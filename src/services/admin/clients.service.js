import { getRequest, postRequest, deleteRequest } from "../api.request";

const CLIENTS_PATH = "/clients";

// clients apis

export const getClients = async (body) =>
  await postRequest(`${CLIENTS_PATH}/retrieve`, body);

export const getClientById = async (id) =>
  await getRequest(`${CLIENTS_PATH}/retrieve/${id}`);

export const createClient = async (body) =>
  await postRequest(`${CLIENTS_PATH}/create`, body);

export const updateClient = async (body) =>
  await postRequest(`${CLIENTS_PATH}/update/${body?.id}`, body);

export const deleteClient = async (body) =>
  await deleteRequest(`${CLIENTS_PATH}/delete/${body?.id}`);

export const exportClient = async (body) =>
  await postRequest(`${CLIENTS_PATH}/export`, body);
