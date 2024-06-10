import React, { memo } from "react";
import "../resource/style/Login/loadding.css";

function Loadding() {
  return (
    <>
      <div className="loadding-title-container">
        <h2>Zalo</h2>
        <div className="container-cc">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </>
  );
}
export default memo(Loadding);
