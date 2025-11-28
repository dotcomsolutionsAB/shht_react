import { getRequest, postRequest, deleteRequest } from "../api.request";

const CLIENTS_PATH = "/clients";
const CONTACT_PERSON_PATH = "/contact_person";

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

// contact person apis

export const getContactPersons = async (body) =>
  await postRequest(`${CLIENTS_PATH}${CONTACT_PERSON_PATH}/retrieve`, body);

export const getContactPersonById = async (id) =>
  await getRequest(`${CLIENTS_PATH}${CONTACT_PERSON_PATH}/retrieve/${id}`);

export const createContactPerson = async (body) =>
  await postRequest(`${CLIENTS_PATH}${CONTACT_PERSON_PATH}/create`, body);

export const updateContactPerson = async (body) =>
  await postRequest(
    `${CLIENTS_PATH}${CONTACT_PERSON_PATH}/update/${body?.id}`,
    body
  );

export const deleteContactPerson = async (body) =>
  await deleteRequest(
    `${CLIENTS_PATH}${CONTACT_PERSON_PATH}/delete/${body?.id}`
  );
