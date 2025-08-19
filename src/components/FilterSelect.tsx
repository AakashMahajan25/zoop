import React, { FC } from 'react'

interface FilterSelectProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder: string
}

export const FilterSelect: FC<FilterSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="relative w-48">
      <select
        className="
          block w-full 
          bg-[#FFFFFF] 
          border border-[#EFEFEF] 
          text-[#858585]
          text-[14px]
          rounded-[6px] 
          px-3 py-3 
          pr-10 
          appearance-none 
          focus:outline-none cursor-pointer
        "
        value={value}
        onChange={onChange}
      >
        <option value="">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-[#858585]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  )
}
