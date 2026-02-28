import React, { useState } from "react";

const FilterBar = ({ isOpen }) => {
  const filters = [
    "All","Music","Gaming","Cricket","Podcasts","Live",
    "News","Mixes","AI","Coding","React","Football",
    "Trailers","Comedy","Technology","Nature","Rugby","Mobiles","Vlogs","Cooking"
  ];

  const [active, setActive] = useState("All");

  return (
    <div
      className={`
        fixed top-14
        ${isOpen ? "left-60 w-[calc(100%-240px)]" : "left-0 w-full"}
        h-12
        flex items-center gap-3
        px-5
        overflow-x-auto
        whitespace-nowrap
          bg-black
        border-t border-[#272727]
        transition-all duration-300
        z-40
        hide-scrollbar 
      `}
    >
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`
            px-4 py-1 rounded-full text-sm shrink-0 cursor-pointer
            transition
            ${
              active === item
                 ? "bg-white text-black"
                : "bg-[#272727] text-white hover:bg-[#3a3a3a]"
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;