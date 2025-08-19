import React from "react";

export type RowData = { avgTime: string; name: string; rating: number };

interface TableProps {
  rows: RowData[];
  handleSort: (colKey: string) => void;
  getArrow: (colKey: string) => React.ReactNode;
}

const columns = [
  { label: "Handler Name", key: "name" },
  { label: "Claims Assigned", key: "rating" },
  { label: "Average Assignment Time ", key: "avgTime" },
];

export const Top10ClaimHandlerTable: React.FC<TableProps> = ({
  rows,
  handleSort,
  getArrow,
}) => {
  return (
    <table className="w-full table-auto border border-gray-200 text-sm">
      <thead className="bg-[#FBFBFB] text-[#858585] text-[14px] font-geist font-normal">
        <tr>
          {columns.map(({ label, key }) => (
            <th
              key={key}
              onClick={() => handleSort(key)}
              className="px-4 py-3 text-left cursor-pointer select-none"
            >
              <div className="flex items-center justify-between">
                {label}
                {getArrow(key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {rows.map((row) => (
          <tr key={row.avgTime} className="hover:bg-[#93FFCA1A]">
            <td className="px-4 py-4 text-[#333333] text-center">{row.name}</td>
            <td className="px-4 py-4 text-[#333333] text-center">{row.rating}</td>
            <td className="px-4 py-4 text-[#333333] text-left">{row.avgTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
