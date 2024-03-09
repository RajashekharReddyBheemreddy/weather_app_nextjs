import { cn } from "@/utilis/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";
import { WeatherProps } from "./weatherProps";


export const SearchBox = (props: WeatherProps) => {
  return (
    <form
      className={cn("flex relative items-center justify-center h-10", props.className)}
      onSubmit={props.onSubmit}
    >
      <input
        onChange={props.onChange}
        value={props.value}
        type="text"
        placeholder="search location"
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-1-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4 py-[9px] bg-blue-400 text-white rounded-r-md focus:outline-none hover:bg-blue-600 h-full">
        <IoSearch />
      </button>
    </form>
  );
};
