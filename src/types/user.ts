export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: string;
};

export type EnhancedUser = User & {
  fullName: string;
  dsr: number;
}

export type CustomColumnMeta = {label: string};