import axiosInstance from "@/lib/axios";

export interface UsersItem {
  _id?: string;
  UserId: number;           // matches Zod schema
  UserCode: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: 'Male' | 'Female';
  Role: string;
  DateOfBirth: string;      // ISO date string
  Email: string;
  PhoneNumber: string;
  Status?: 'Active' | 'Inactive' | 'Suspended';
  Archived?: boolean;
  archivedAt?: string;
}

export interface UsersResponse {
  success: boolean;
  data: UsersItem[];
  message?: string;
}

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await axiosInstance.get<UsersResponse>("/users");
  console.log(response);
  return response.data;
};

export interface AddUserPayload {
  UserId: number;           // matches Zod schema
  UserCode: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Sex: 'Male' | 'Female';
  Role: string;
  DateOfBirth: string;      // ISO date string
  Email: string;
  PhoneNumber: string;
  Status?: 'Active' | 'Inactive' | 'Suspended';
  Archived?: boolean;
  archivedAt?: string;
}

export const addUsers = async (payload: AddUserPayload): Promise<UsersResponse> => {
  const response = await axiosInstance.post<UsersResponse>("/users", payload);
  return response.data;
};

export interface UpdateUserPayload {
  userId: number; 
  firstName: string;
  userType: number; 
  lastName: string;
}

export const updateUser = async (payload: UpdateUserPayload): Promise<UsersResponse> => {
  const response = await axiosInstance.patch<UsersResponse>(`/users/${payload.userId}`, {
    firstName: payload.firstName,
    lastName: payload.lastName,
    userType: payload.userType,
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
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error("Error archiving user:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete user",
    };
  }
};

