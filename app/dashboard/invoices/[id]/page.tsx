import React from "react";

type PageProps = {
  params: {
    id: string;
  };
};
const page = ({ params }: PageProps) => {
  const id = params.id;
  return <div>id is {id}</div>;
};

export default page;
