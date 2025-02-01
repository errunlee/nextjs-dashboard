import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return <div>id is {id}</div>;
};

export default page;
