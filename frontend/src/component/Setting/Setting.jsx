import React, { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import "../../resource/style/component/setting.css";
import coverimg from "../../resource/img/coverImg/coverimg.jpg";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

export default function Setting({ handleShowSetting }) {
  const { userData } = useContext(UserContext);
  const [showChoiceAvatar, setShowChoiceAvatar] = useState(true);
  const [newAvatar, setNewAvatar] = useState("");
  const listAvatarGr = [
    "https://res.zaloapp.com/pc/avt_group/1_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/2_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/3_family.jpg",
    "https://res.zaloapp.com/pc/avt_group/4_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/5_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/6_work.jpg",
    "https://res.zaloapp.com/pc/avt_group/7_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/8_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/9_friends.jpg",
    "https://res.zaloapp.com/pc/avt_group/10_school.jpg",
    "https://res.zaloapp.com/pc/avt_group/11_school.jpg",
    "https://res.zaloapp.com/pc/avt_group/12_school.jpg",
  ];

  const handleShowChoiceAvatar = (value) => {
    setShowChoiceAvatar(value);
  };

  return (
    <>
      <div className="screen-mask">
        <div className="box-setting">
          {!showChoiceAvatar ? (
            <div>
              <div className="account-infor">
                <div
                  className="flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <h3>Thông tin tài khoản</h3>
                  <IoMdClose
                    className="btn-close"
                    onClick={() => handleShowSetting(false)}
                  />
                </div>
                <div className="cover-img">
                  <img src={coverimg} alt="" />
                </div>

                <div className="avatar-img">
                  <img src={userData.avatar} alt="" />
                  <div
                    className="flex"
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <p className="username">{userData.username}</p>
                    <CiEdit className="icon-edit" />
                  </div>
                </div>
                <CiCamera className="icon-camera" />
              </div>
              <div className="user-infor">
                <h3>Thông tin cá nhân</h3>
                <div>
                  <table>
                    <tr>
                      <td>Giới tính</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Ngày sinh</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Điện thoại</td>
                      <td>{userData.phone}</td>
                    </tr>
                  </table>
                  <p
                    style={{
                      color: "#7589a3",
                      margin: "10px 20px",
                      fontSize: "14px",
                    }}
                  >
                    Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số
                    này
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      paddingTop: "10px",
                      borderTop: "1px solid rgb(202, 199, 200)",
                      width: "350px",
                      margin: "auto",
                    }}
                  >
                    <div className="wrap-btn-update flex">
                      <p className="btn-update" style={{ fontWeight: 500 }}>
                        Cập nhật
                      </p>
                      <CiEdit className="icon-edit" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="screen-mask" style={{ zIndex: 1001 }}>
                <div className="choice-avatar-gr">
                  <div className="header-add-friend flex">
                    <p>Cập nhật ảnh đại diện</p>
                    <IoMdClose
                      className="btn-close"
                      onClick={() => handleShowChoiceAvatar(false)}
                    />
                  </div>
                  <div className="input-number-group">
                    <CiSearch className="icon-search" />
                    <input type="text" placeholder="Nhập url hình ảnh" />
                  </div>
                  <div>
                    <ul className="ex-avatar flex">
                      {listAvatarGr?.map((item, index) => (
                        <li key={index}>
                          <img
                            src={item}
                            alt=""
                            className={
                              item === newAvatar ? "ex-avatar-choice" : ""
                            }
                          />
                        </li>
                      ))}
                    </ul>
                    <div
                      className="btn-find-friend flex"
                      style={{ position: "relative" }}
                    >
                      <button onClick={() => handleShowChoiceAvatar(false)}>
                        Hủy
                      </button>
                      <button
                        style={{ backgroundColor: "#0068ff", color: "white" }}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
