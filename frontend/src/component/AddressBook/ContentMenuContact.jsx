import React from "react";
import "../../resource/style/AddressBook/contentMenuContact.css";

export default function ({ data, title }) {
  return (
    <>
      <div className="header-content-menu-contact flex">
        <h3>{title}</h3>
      </div>
      <div className="list-fetch-contact">
        <div className="content-fetch-contact">
          <div className="total-fetch">Tổng số: {data?.length}</div>
          {data && (
            <ul>
              {data?.map((item, index) => (
                <li key={index} className="flex">
                  <div className="item-fetch flex">
                    <img src={item.avatar} alt={`avatar by ${item.username}`} />
                    <p>{item.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
