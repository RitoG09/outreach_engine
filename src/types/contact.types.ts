export interface Contact {
  personId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  linkedinUrl: string;
  companyName: string;
  companyDomain: string;
}

export interface Lead extends Contact {
  email: string;
  emailStatus?: string;
}