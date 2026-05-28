// documentTypeService.js
import Client from "../api/client";

const API_URL = "/DocumentType";

export async function fetchDocumentTypes() {
  try {
    const response = await Client.get(API_URL);
    return response.data;
  } catch (error) {

    console.error("Failed to fetch document types:", error);
    return [];
  }
}

export async function fetchDocumentTypeById(id) {
  try {
    const response = await Client.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch document type with id ${id}:`, error);
    return null;
  }
}


// Accepts: { name, description, estimatedWorkingDays }
export async function createDocumentType({ name, description, estimatedWorkingDays }) {
  try {
    const payload = {
      name,
      description,
      estimatedWorkingDays
    };
    const response = await Client.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create document type:", error);
    throw error;
  }
}


// Accepts: id, { documentTypeId, name, description, estimatedWorkingDays, isActive }
export async function updateDocumentType(id, { documentTypeId, name, description, estimatedWorkingDays, isActive }) {
  try {
    const payload = {
      documentTypeId,
      name,
      description,
      estimatedWorkingDays,
      isActive
    };
    await Client.put(`${API_URL}/${id}`, payload);
    return true;
  } catch (error) {
    console.error(`Failed to update document type with id ${id}:`, error);
    throw error;
  }
}

export async function deleteDocumentType(id) {
  try {
    await Client.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete document type with id ${id}:`, error);
    throw error;
  }
}
