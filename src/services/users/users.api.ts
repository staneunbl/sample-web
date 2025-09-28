import axiosInstance from "@/lib/axios";

export interface UsersItem {
  _id: string;
  UserId: number;           // matches Zod schema
  UserCode?: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: 'Male' | 'Female';
  Role: string;
  DateOfBirth: string;      // ISO date string
  Email: string;
  PhoneNumber: string;
  Status?: 'Active' | 'Archived' | 'Suspended';
  Archived?: boolean;
  archivedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  data: UsersItem[];
  message?: string;
}

export const getUsers = async (page = 1, limit = 10, sortBy = "FirstName", sortOrder = "asc"): Promise<UsersResponse> => {
  const response = await axiosInstance.get<UsersResponse>("/users", {
    params: { page, limit, sortBy, sortOrder },
  });
  return response.data;
};

export interface AddUserPayload {
  _id?: string;
  UserId?: number;           // matches Zod schema
  UserCode?: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: 'Male' | 'Female';
  Role: string;
  DateOfBirth: string;      // ISO date string
  Email: string;
  PhoneNumber: string;
  Status?: 'Active' | 'Archived' | 'Suspended';
  Archived?: boolean;
  archivedAt?: string;
}

export interface UsersAddResponse {
  success: boolean;
  data: UsersItem;
  message?: string;
}

export const addUsers = async (payload: AddUserPayload): Promise<UsersAddResponse> => {
  const response = await axiosInstance.post<UsersAddResponse>("/users", payload);
  return response.data;
};

export interface UpdateUserPayload {
  _id?: string;
  UserId: number;
  UserCode: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: 'Male' | 'Female';
  Role: string;
  DateOfBirth: string;
  Email: string;
  PhoneNumber: string;
  Status?: 'Active' | 'Archived' | 'Suspended';
  Archived?: boolean;
  archivedAt?: string;
}

export const updateUser = async (payload: UpdateUserPayload): Promise<UsersResponse> => {
  const response = await axiosInstance.patch<UsersResponse>(`/users/${payload._id}`, {
    FirstName: payload.FirstName,
    MiddleName: payload.MiddleName,
    LastName: payload.LastName,
    Sex: payload.Sex,
    Role: payload.Role,
    DateOfBirth: payload.DateOfBirth,
    Email: payload.Email,
    PhoneNumber: payload.PhoneNumber,

  });
  return response.data;
};

export const deleteUser = async (_id: string) => {
  try {
    const response = await axiosInstance.delete(`/users/hard/${_id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete user",
    };
  }
};

export const archiveUser = async (_id: string) => {
  try {
    const response = await axiosInstance.patch(`/users/archive/${_id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error archiving user:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete user",
    };
  }
};

