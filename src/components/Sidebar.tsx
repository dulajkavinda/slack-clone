import React from "react";

interface INamespace {
  img: string;
  endpoint: string;
}

export default function Sidebar(props: { namespaceList: INamespace[] }) {
  return (
    <div className="namespaces">
      {props.namespaceList.map((namespace) => {
        return (
          <div className="namesapce">
            <img src={namespace.img} width="95%" height="95%" />
          </div>
        );
      })}
    </div>
  );
}
