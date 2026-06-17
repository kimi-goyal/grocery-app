
export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicle_number: string | null;
  vehicle_type: string | null;
  is_available: boolean;
  is_active: boolean;
  total_deliveries: number;
  created_at: string;
  updated_at: string | null;
}

export interface DriverCreate {
  name: string;
  phone: string;
  email?: string;
  vehicle_number?: string;
  vehicle_type?: string;
}

export interface DriverUpdate {
  name?: string;
  phone?: string;
  email?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  is_available?: boolean;
  is_active?: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  vehicle_number: string | null;
  vehicle_type: string | null;
}
