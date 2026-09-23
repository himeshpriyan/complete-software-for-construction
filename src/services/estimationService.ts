import { useAppStore } from '../store/useAppStore';
import {
  Estimate,
  BOQ,
  BOQTemplate,
  RateItem,
  Quotation,
  Tender,
  Contract,
} from '../types';

export const getEstimates = async (): Promise<Estimate[]> => {
  return useAppStore.getState().estimates;
};

export const getEstimateById = async (id: string): Promise<Estimate | undefined> => {
  return useAppStore.getState().estimates.find((e) => e.id === id);
};

export const createEstimate = async (
  data: Omit<Estimate, 'id' | 'estimateNumber' | 'createdDate'>
): Promise<Estimate> => {
  return useAppStore.getState().createEstimate(data);
};

export const updateEstimate = async (id: string, updates: Partial<Estimate>): Promise<void> => {
  useAppStore.getState().updateEstimate(id, updates);
};

export const getBOQs = async (): Promise<BOQ[]> => {
  return useAppStore.getState().boqs;
};

export const getBOQById = async (id: string): Promise<BOQ | undefined> => {
  return useAppStore.getState().boqs.find((b) => b.id === id);
};

export const createBOQ = async (data: Omit<BOQ, 'id' | 'boqNumber' | 'createdDate'>): Promise<BOQ> => {
  return useAppStore.getState().createBOQ(data);
};

export const updateBOQ = async (id: string, updates: Partial<BOQ>): Promise<void> => {
  useAppStore.getState().updateBOQ(id, updates);
};

export const getBOQTemplates = async (): Promise<BOQTemplate[]> => {
  return useAppStore.getState().boqTemplates;
};

export const getRateMaster = async (): Promise<RateItem[]> => {
  return useAppStore.getState().rateMaster;
};

export const getQuotations = async (): Promise<Quotation[]> => {
  return useAppStore.getState().quotations;
};

export const createQuotation = async (data: Omit<Quotation, 'id' | 'quoteNumber'>): Promise<Quotation> => {
  return useAppStore.getState().createQuotation(data);
};

export const updateQuotationStatus = async (
  id: string,
  status: Quotation['status'],
  signedBy?: string
): Promise<void> => {
  useAppStore.getState().updateQuotationStatus(id, status, signedBy);
};

export const getTenders = async (): Promise<Tender[]> => {
  return useAppStore.getState().tenders;
};

export const updateTenderStatus = async (id: string, status: Tender['status']): Promise<void> => {
  useAppStore.getState().updateTenderStatus(id, status);
};

export const getContracts = async (): Promise<Contract[]> => {
  return useAppStore.getState().contracts;
};

export const updateContractStatus = async (id: string, status: Contract['status']): Promise<void> => {
  useAppStore.getState().updateContractStatus(id, status);
};

export const convertContractToProject = async (
  contractId: string
): Promise<{ projectId: string; projectName: string }> => {
  return useAppStore.getState().convertContractToProject(contractId);
};
