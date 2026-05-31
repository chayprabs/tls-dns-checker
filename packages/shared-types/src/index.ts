export type DnsRecordType =
  | 'A'
  | 'AAAA'
  | 'CNAME'
  | 'MX'
  | 'TXT'
  | 'NS'
  | 'SOA'
  | 'SRV'
  | 'CAA'
  | 'DS'
  | 'DNSKEY';

export interface DnsRecord {
  type: DnsRecordType;
  name: string;
  value: string;
  ttl?: number;
}

export interface DnsResult {
  records: DnsRecord[];
  dnssec: {
    validated: boolean;
    chain?: string[];
    error?: string;
  };
  mode: 'recursive' | 'authoritative';
}

export interface RdapResult {
  domain?: string;
  registrar?: string;
  created?: string;
  updated?: string;
  expires?: string;
  statuses?: string[];
  nameservers?: string[];
  contacts?: { role: string; name?: string; email?: string }[];
  raw?: unknown;
}

export interface AsnResult {
  ip: string;
  asn?: string;
  asnName?: string;
  country?: string;
  prefixes?: string[];
  org?: string;
}

export interface HttpHop {
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timingMs: number;
}

export interface HttpResult {
  finalUrl: string;
  hops: HttpHop[];
  totalTimingMs: number;
  serverHeader?: string;
}

export interface TlsResult {
  protocol?: string;
  cipher?: string;
  alpn?: string[];
  sni?: string;
  ocspStapling?: boolean;
  sessionResumption?: boolean;
  supportedVersions?: string[];
}

export interface CertInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  sans: string[];
  keyAlgorithm?: string;
  signatureAlgorithm?: string;
  serialNumber?: string;
  ocsp?: { status: string; url?: string };
  crl?: string[];
  ctLogs?: { logName: string; timestamp: string }[];
  warning?: 'expiring' | 'expired' | null;
}

export interface CertResult {
  chain: CertInfo[];
  hostname: string;
}

export interface SocketResult {
  port: number;
  banner?: string;
  error?: string;
  timingMs: number;
}

export interface ProbeResult {
  target: string;
  dns: DnsResult;
  rdap: RdapResult;
  asn: AsnResult;
  http: HttpResult;
  tls: TlsResult;
  cert: CertResult;
  socket: SocketResult;
  timestamp: string;
  probeDurationMs: number;
}

export interface ProbeRequest {
  target: string;
  dnsMode?: 'recursive' | 'authoritative';
  socketPort?: number;
}

export interface HistoryEntry {
  id: string;
  target: string;
  timestamp: string;
  summary: {
    dnsRecords: number;
    certDaysRemaining?: number;
    httpStatus?: number;
  };
  result?: ProbeResult;
}

export interface AlertSubscription {
  email: string;
  target: string;
  thresholds: number[];
}
