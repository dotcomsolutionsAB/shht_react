import { getRequest, postRequest, deleteRequest } from "../api.request";

const TAGS_PATH = "/tags";

// tags apis

export const getTags = async (body) =>
  await postRequest(`${TAGS_PATH}/retrieve`, body);

export const getTagById = async (id) =>
  await getRequest(`${TAGS_PATH}/retrieve/${id}`);

export const createTag = async (body) =>
  await postRequest(`${TAGS_PATH}/create`, body);

export const updateTag = async (body) =>
  await postRequest(`${TAGS_PATH}/update/${body?.id}`, body);

export const deleteTag = async (body) =>
  await deleteRequest(`${TAGS_PATH}/delete/${body?.id}`);
