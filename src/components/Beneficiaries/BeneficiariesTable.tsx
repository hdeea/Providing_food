import React from 'react';
import { Beneficiary } from '../../types';

interface BeneficiariesTableProps {
  beneficiaries: Beneficiary[];
}

const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({ beneficiaries }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {beneficiaries.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No beneficiaries found
              </td>
            </tr>
          ) : (
            beneficiaries.map((beneficiary) => (
              <tr  className="hover:bg-gray-50">
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {beneficiary.fullName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {beneficiary.phoneNumber}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {beneficiary.familySize}
                </td>

              
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BeneficiariesTable;
