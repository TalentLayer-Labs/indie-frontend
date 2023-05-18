import axios from 'axios';

export const getSignature = async (method: string, args: Record<string, any>) => {
  if (!process.env.NEXT_PUBLIC_SIGNATURE_API_URL) {
    return '0x';
  }
  const res = await axios.post(process.env.NEXT_PUBLIC_SIGNATURE_API_URL as string, {
    method,
    args,
  });

  return JSON.parse(res.data.result);
};

interface CreateServiceArgs {
  profileId: number;
  cid: string;
}

export const getServiceSignature = async (args: CreateServiceArgs) => {
  return getSignature('createService', args);
};

interface CreateProposalArgs {
  profileId: number;
  serviceId: number;
  cid: string;
}

export const getProposalSignature = async (args: CreateProposalArgs) => {
  return getSignature('createProposal', args);
};
