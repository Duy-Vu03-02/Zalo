import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../resource/style/Login/login.css";
import qr from "../resource/img/Login/qr.png";
import lock from "../resource/svg/login/lock.svg";
import iphone from "../resource/svg/login/iphone.svg";
import { IoIosPhonePortrait } from "react-icons/io";
import { CiLock } from "react-icons/ci";

export default function Login() {
  const [activeQr, setActiveQr] = useState(true);

  const handleSetActive = () => {
    activeQr ? setActiveQr(false) : setActiveQr(true);
  };
  return (
    <>
      <div className="login-container">
        <div className="login-title-container">
          <div>
            <h2 className="textcenter">Zalo</h2>
          </div>
          <div>
            <p className="textcenter">Đăng nhập tài khoản Zalo</p>
            <p className="textcenter">Để kết nối ứng dụng Zalo Web</p>
          </div>
        </div>

        <div className="login-form-login">
          <div className="login-header-login ">
            <div className="login-header-login-wrap flex">
              <p
                className={`${activeQr ? "login-header-login-active" : ""}`}
                onClick={handleSetActive}
              >
                với mã qr
              </p>
              <p
                className={`${activeQr ? "" : "login-header-login-active"}`}
                onClick={handleSetActive}
              >
                với số điện thoại
              </p>
              <hr className="login-hr-header-login" />
              <hr
                className={`login-hr-bottom-header ${
                  activeQr ? "" : "login-hr-bottom-header-active"
                }`}
              />
            </div>
          </div>
          <div>{activeQr ? <LoginQr /> : <LoginAccount />}</div>
        </div>
      </div>
    </>
  );
}

function LoginQr() {
  return (
    <>
      <div className="login-login-qr">
        <div className="login-wrap-qr">
          <div className="login-img-qr">
            <img src={qr} alt="" />
            <p className="login-blue">Chỉ dùng để đăng nhập</p>
            <p>Zalo trên máy tính</p>
          </div>
        </div>
        <div className="login-introduce-footer">
          <p>Sử dụng ứng dụng Zalo để quát mã QR</p>
        </div>
      </div>
    </>
  );
}

function LoginAccount() {
  const [value, setValue] = useState({
    phone: "",
    password: "",
  });
  const [disableBtn, setDisableBtn] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.mateKey) && e.key === "a") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (value.phone.length >= 4 && value.password.length >= 4) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [value]);

  const handleChangeData = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleLoginAccount = async () => {
    await axios
      .post("http://127.0.0.1:8080/auth/login", value)
      .then((response) => {
        if (response.status === 200) {
          navigation("/");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="login-login-account">
        <div className="login-form-login-account">
          <div className="login-form-login-wrap">
            <div className="flex">
              <IoIosPhonePortrait className="icon-login" />
              <input
                type="text"
                placeholder="Số điện thoại"
                name="phone"
                value={value.phone}
                onChange={(e) => handleChangeData(e)}
              />
            </div>
            <div className="flex">
              <CiLock className="icon-login" />
              <input
                type="text"
                placeholder="Mật khẩu"
                value={value.password}
                name="password"
                onChange={(e) => handleChangeData(e)}
              />
            </div>
          </div>
          <div
            className={`login-container-btn ${
              disableBtn ? "login-disable" : ""
            }`}
          >
            <div className="login-btn-login">
              <button onClick={handleLoginAccount}>
                Đăng nhập với mật khẩu
              </button>
            </div>
            <div className="login-btn-login-phone">
              <button>Đăng nhập bằng thiết bị di động</button>
              <div
                className={`login-introduce-login ${
                  disableBtn ? "" : "login-introduce-login-active"
                }`}
              >
                <svg height="10" width="100">
                  <polygon points="50,0 100,100 0,100" fill="#0190f3" />
                </svg>
                <p>Đăng nhập không dùng mật khẩu</p>
              </div>
            </div>
          </div>
        </div>
        <div className="login-forgot-pass">
          <p>Quên mật khẩu?</p>
        </div>
      </div>
    </>
  );
}
