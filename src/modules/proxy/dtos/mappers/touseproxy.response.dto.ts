export interface SubUserDTO {
  id: number;
  label: string;
  login: string;
  password: string;
  balance: number;
  threads: number;
  sticky_range: {
    start: number;
    end: number;
  };
  allowed_ips: string[];
  blocked: boolean;
  pool_type: string;
  default_pool_parameters: {
    countries: string[];
    cities: string[];
    states: string[];
    zipcodes: string[];
    asns: string[];
    exclude_countries: string[];
    exclude_asn: string[];
    anonymous_filter: boolean;
    rotation_interval: number | null;
  };
  blocked_hosts: string[];
}
export interface ProxyUser {
  userId: number;
  login: string;
  password: string;
}
export function mapSubUserDtoToProxyUser(dto: SubUserDTO): ProxyUser {
  return {
    userId: dto.id,
    login: dto.login,
    password: dto.password,
  };
}
