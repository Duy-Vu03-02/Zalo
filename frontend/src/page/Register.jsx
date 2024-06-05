import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [value, setValue] = useState({
    phone: "",
    name: "",
    password: "",
    avatar: "",
  });

  const handleChangeData = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async () => {
    await axios
      .post("http://127.0.0.1:8080/auth/register", value)
      .then((response) => {
        alert("Thanh cong");
      })
      .catch((err) => {
        console.error(err);
      });
    setValue({
      phone: "",
      name: "",
      password: "",
      avatar: "",
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
              value={value.name}
              name="name"
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
              value={value.avatar}
              name="avatar"
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
