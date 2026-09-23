import { useAppStore } from '../store/useAppStore';
import {
  Project,
  ProjectHealth,
  ProjectStatus,
  WBSTask,
  ProjectTask,
  DailyProgressReport,
  SitePhoto,
  MeasurementBookEntry,
  RFIItem,
  VariationOrder,
  ProjectHandover,
} from '../types';

export const getProjects = async (filter?: {
  status?: ProjectStatus | 'ALL';
  health?: ProjectHealth | 'ALL';
  query?: string;
  projectManager?: string;
}): Promise<Project[]> => {
  let list = useAppStore.getState().projects;

  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((p) => p.status === filter.status);
  }

  if (filter?.health && filter.health !== 'ALL') {
    list = list.filter((p) => p.health === filter.health);
  }

  if (filter?.projectManager && filter.projectManager !== 'ALL') {
    list = list.filter((p) => p.projectManager === filter.projectManager);
  }

  if (filter?.query && filter.query.trim()) {
    const q = filter.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  return list;
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  return useAppStore.getState().projects.find((p) => p.id === id);
};

export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
  return useAppStore.getState().createProject(data);
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
  useAppStore.getState().updateProject(id, updates);
};

export const getWBSTasks = async (projectId?: string): Promise<WBSTask[]> => {
  const all = useAppStore.getState().wbsTasks;
  if (projectId) return all.filter((t) => t.projectId === projectId);
  return all;
};

export const getProjectTasks = async (projectId?: string): Promise<ProjectTask[]> => {
  const all = useAppStore.getState().projectTasks;
  if (projectId) return all.filter((t) => t.projectId === projectId);
  return all;
};

export const updateProjectTaskStatus = async (id: string, status: ProjectTask['status']): Promise<void> => {
  useAppStore.getState().updateTaskStatus(id, status);
};

export const addProjectTask = async (data: Omit<ProjectTask, 'id'>): Promise<ProjectTask> => {
  return useAppStore.getState().addProjectTask(data);
};

export const getDPRs = async (projectId?: string): Promise<DailyProgressReport[]> => {
  const all = useAppStore.getState().dprs;
  if (projectId) return all.filter((d) => d.projectId === projectId);
  return all;
};

export const createDPR = async (data: Omit<DailyProgressReport, 'id' | 'dprNumber'>): Promise<DailyProgressReport> => {
  return useAppStore.getState().createDPR(data);
};

export const getSitePhotos = async (projectId?: string): Promise<SitePhoto[]> => {
  const all = useAppStore.getState().sitePhotos;
  if (projectId) return all.filter((p) => p.projectId === projectId);
  return all;
};

export const getMeasurementBookEntries = async (projectId?: string): Promise<MeasurementBookEntry[]> => {
  const all = useAppStore.getState().mbEntries;
  if (projectId) return all.filter((m) => m.projectId === projectId);
  return all;
};

export const createMBEntry = async (data: Omit<MeasurementBookEntry, 'id' | 'mbNumber'>): Promise<MeasurementBookEntry> => {
  return useAppStore.getState().createMBEntry(data);
};

export const getRFIs = async (projectId?: string): Promise<RFIItem[]> => {
  const all = useAppStore.getState().rfis;
  if (projectId) return all.filter((r) => r.projectId === projectId);
  return all;
};

export const createRFI = async (data: Omit<RFIItem, 'id' | 'rfiNumber' | 'daysOpen'>): Promise<RFIItem> => {
  return useAppStore.getState().createRFI(data);
};

export const updateRFIStatus = async (
  id: string,
  status: RFIItem['status'],
  responseText?: string,
  respondedBy?: string
): Promise<void> => {
  useAppStore.getState().updateRFIStatus(id, status, responseText, respondedBy);
};

export const getVariations = async (projectId?: string): Promise<VariationOrder[]> => {
  const all = useAppStore.getState().variations;
  if (projectId) return all.filter((v) => v.projectId === projectId);
  return all;
};

export const createVariation = async (data: Omit<VariationOrder, 'id' | 'variationNumber'>): Promise<VariationOrder> => {
  return useAppStore.getState().createVariation(data);
};

export const updateVariationStatus = async (
  id: string,
  status: VariationOrder['status'],
  approverComments?: string
): Promise<void> => {
  useAppStore.getState().updateVariationStatus(id, status, approverComments);
};

export const getProjectHandover = async (projectId: string): Promise<ProjectHandover | undefined> => {
  return useAppStore.getState().handovers[projectId];
};

export const updateProjectHandover = async (projectId: string, updates: Partial<ProjectHandover>): Promise<void> => {
  useAppStore.getState().updateHandover(projectId, updates);
};
