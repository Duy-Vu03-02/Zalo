import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [value, setValue] = useState({
    phone: "",
    username: "",
    password: "",
    img: "",
  });

  const handleChangeData = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  console.log(value);

  const handleSubmitRegister = async () => {
    await axios
      .post("http://127.0.0.1:8080/auth/register", value)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div>
        <div>
          <h2>Đăng ký tài khoản</h2>
        </div>
        <div className="form-register">
          <div className="flex">
            <p>Số điện thoại</p>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              name="phone"
              value={value.phone}
              onChange={(e) => handleChangeData(e)}
            />
          </div>
          <div className="flex">
            <p>Tên người dùng</p>
            <input
              type="text"
              placeholder="Nhập tên người dùng"
              value={value.username}
              name="username"
              onChange={(e) => handleChangeData(e)}
            />
          </div>
          <div className="flex">
            <p>Mật khẩu</p>
            <input
              type="text"
              placeholder="Nhập mật khẩu"
              value={value.password}
              name="password"
              onChange={(e) => handleChangeData(e)}
            />
          </div>
          <div className="flex">
            <p>Nhập ảnh</p>
            <input
              type="text"
              placeholder="link anh"
              value={value.img}
              name="img"
              onChange={(e) => handleChangeData(e)}
            />
          </div>
          <div>
            <button onClick={handleSubmitRegister}>Đắng ký</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
