import { getRequest, postRequest, deleteRequest } from "../api.request";

const USERS_PATH = "/users";

// change password api

export const changePassword = async (body) =>
  await postRequest(`${USERS_PATH}/change_password`, body);

// users apis

export const getUsers = async (body) =>
  await postRequest(`${USERS_PATH}/retrieve`, body);

export const getUserById = async (id) =>
  await getRequest(`${USERS_PATH}/retrieve/${id}`);

export const createUser = async (body) =>
  await postRequest(`${USERS_PATH}/create`, body);

export const updateUser = async (body) =>
  await postRequest(`${USERS_PATH}/update/${body?.id}`, body);

export const deleteUser = async (body) =>
  await deleteRequest(`${USERS_PATH}/delete/${body?.id}`);

export const exportUser = async (body) =>
  await postRequest(`${USERS_PATH}/export`, body);
