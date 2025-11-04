import { getRequest, postRequest, deleteRequest } from "../api.request";

const SUB_CATEGORY_PATH = "/sub_category";

// sub-category apis

export const getSubCategories = async (body) =>
  await postRequest(`${SUB_CATEGORY_PATH}/retrieve`, body);

export const getSubCategoryById = async (id) =>
  await getRequest(`${SUB_CATEGORY_PATH}/retrieve/${id}`);

export const createSubCategory = async (body) =>
  await postRequest(`${SUB_CATEGORY_PATH}/create`, body);

export const updateSubCategory = async (body) =>
  await postRequest(`${SUB_CATEGORY_PATH}/update/${body?.id}`, body);

export const deleteSubCategory = async (body) =>
  await deleteRequest(`${SUB_CATEGORY_PATH}/delete/${body?.id}`);
