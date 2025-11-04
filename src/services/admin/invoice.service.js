import { getRequest, postRequest, deleteRequest } from "../api.request";

const INVOICE_PATH = "/invoice";

// invoice apis

export const getInvoices = async (body) =>
  await postRequest(`${INVOICE_PATH}/retrieve`, body);

export const getInvoiceById = async (id) =>
  await getRequest(`${INVOICE_PATH}/retrieve/${id}`);

export const createInvoice = async (body) =>
  await postRequest(`${INVOICE_PATH}/create`, body);

export const updateInvoice = async (body) =>
  await postRequest(`${INVOICE_PATH}/update/${body?.id}`, body);

export const deleteInvoice = async (body) =>
  await deleteRequest(`${INVOICE_PATH}/delete/${body?.id}`);
