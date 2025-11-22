import React from "react";
import { RESUME_URL } from "~/utils";

const Resume = () => {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        title="Resume"
        src={RESUME_URL}
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default Resume;

