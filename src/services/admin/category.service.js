import { getRequest, postRequest, deleteRequest } from "../api.request";

const CATEGORY_PATH = "/category";

// category apis

export const getCategories = async (body) =>
  await postRequest(`${CATEGORY_PATH}/retrieve`, body);

export const getCategoryById = async (id) =>
  await getRequest(`${CATEGORY_PATH}/retrieve/${id}`);

export const createCategory = async (body) =>
  await postRequest(`${CATEGORY_PATH}/create`, body);

export const updateCategory = async (body) =>
  await postRequest(`${CATEGORY_PATH}/update/${body?.id}`, body);

export const deleteCategory = async (body) =>
  await deleteRequest(`${CATEGORY_PATH}/delete/${body?.id}`);
