export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  notification_token: string;
  notification_enabled: boolean;
  device_type?: string;
  device_version?: string;
  device_model?: string;
  device_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  notification_token?: string;
  notification_enabled?: boolean;
  device_type?: string;
  device_version?: string;
  device_model?: string;
  device_name?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  notification_token?: string;
  notification_enabled?: boolean;
  device_type?: string;
  device_version?: string;
  device_model?: string;
  device_name?: string;
}
