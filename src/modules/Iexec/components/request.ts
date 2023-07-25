/* eslint-disable no-console */
import {
  FetchGrantedAccessParams,
  FetchProtectedDataParams,
  ProtectDataParams,
} from '@iexec/dataprotector';
import axios from 'axios';
import { Address } from 'wagmi';

export const web3Mail = async (
  emailSubject: string,
  emailContent: string,
  protectedData: Address,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/web3mail', { emailSubject, emailContent, protectedData });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchMailContact = async (): Promise<any> => {
  try {
    return await axios.post('/api/iexec/fetch-contact', {});
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const dataProtector = async (protectDataArgs: ProtectDataParams): Promise<any> => {
  try {
    return await axios.post('/api/iexec/data-protector', protectDataArgs);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchProtectedData = async (
  fetchProtectedDataArg: FetchProtectedDataParams,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/fetch-protected-data', fetchProtectedDataArg);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchGrantedAccess = async (
  fetchGrantedAccessArg: FetchGrantedAccessParams,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/fetch-granted-access', fetchGrantedAccessArg);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
