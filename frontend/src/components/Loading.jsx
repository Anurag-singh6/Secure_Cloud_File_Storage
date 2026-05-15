import React from "react";
import CloudComputing from "../assets/CloudComputing.gif";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="flex items-center justify-center w-full max-w-md">
        <img
          src={CloudComputing}
          alt="Loading..."
          className="w-fit h-fit max-w-xs sm:max-w-sm md:max-w-md object-cover"
        />
      </div>
    </div>
  );
};

export default Loading;
