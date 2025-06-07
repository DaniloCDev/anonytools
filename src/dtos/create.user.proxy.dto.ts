export interface StickyRangeDTO {
  start: number;
  end: number;
}

export interface DefaultPoolParametersDTO {
  countries: string[];
  cities: string[];
  states: string[];
  zipcodes: string[];
  asns: string[];
  exclude_countries: string[];
  exclude_asn: number[];
  anonymous_filter: boolean;
  rotation_interval: number | null;
}

export interface SubUserDTO {
  id: number;
  label: string;
  login: string;
  password: string;
  balance: number;
  balance_format: number;
  threads: number;
  sticky_range: StickyRangeDTO;
  allowed_ips: string[];
  blocked: boolean;
  pool_type: string;
  default_pool_parameters: DefaultPoolParametersDTO;
  blocked_hosts: string[];
}
