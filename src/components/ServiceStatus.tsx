import { ServiceStatusEnum } from '../types';

function ServiceStatus({ status }: { status: ServiceStatusEnum }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        status == ServiceStatusEnum.Opened
          ? 'bg-indigo-100 text-indigo-800'
          : 'bg-green-100 text-green-800'
      } `}>
      {status}
    </span>
  );
}

export default ServiceStatus;
