import React, { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import "../../resource/style/component/setting.css";
import coverimg from "../../resource/img/coverImg/coverimg.jpg";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { IoChevronBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { updateAvatarById } from "../../util/api";
import axios from "axios";

export default function Setting({ handleShowSetting }) {
  const { userData, setUserData } = useContext(UserContext);
  const [showChoiceAvatar, setShowChoiceAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const [dataUpdate, setDataUpdate] = useState({
    avatar: "",
  });
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
  const handleChoiceNewAvatar = (item) => {
    setNewAvatar(item);
    setDataUpdate((prevState) => {
      return {
        ...prevState,
        avatar: item,
      };
    });
  };
  const handleChangeDataUpdate = (e) => {
    setDataUpdate((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleUpdateAvatar = async () => {
    try {
      console.log(dataUpdate.avatar);
      if (dataUpdate.avatar !== "") {
        const response = await updateAvatarById({
          userId: userData._id,
          urlAvatar: dataUpdate.avatar,
        });

        if (response.status === 200) {
          handleShowSetting(false);
          setUserData((prevState) => {
            return {
              ...prevState,
              avatar: dataUpdate.avatar,
            };
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="screen-mask">
        <div className="box-setting">
          <div className="account-infor">
            <div
              className="flex"
              style={{
                justifyContent: "space-between",
                borderBottom: "1px solid #d6dbe1",
              }}
            >
              {!showChoiceAvatar ? (
                <h3>Thông tin tài khoản</h3>
              ) : (
                <div className="flex">
                  <h3>
                    <IoChevronBackOutline
                      className="icon-back"
                      onClick={() => handleShowChoiceAvatar(false)}
                    />
                    Cập nhật ảnh đại diện
                  </h3>
                </div>
              )}

              <IoMdClose
                className="btn-close"
                onClick={() => handleShowSetting(false)}
              />
            </div>
            {!showChoiceAvatar ? (
              <div>
                <div className="account-infor">
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
                  <CiCamera
                    className="icon-camera"
                    onClick={() => handleShowChoiceAvatar(true)}
                  />
                </div>
                <div className="user-infor">
                  <h3>Thông tin cá nhân</h3>
                  <div>
                    <table>
                      <tbody>
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
                      </tbody>
                    </table>
                    <p
                      style={{
                        color: "#7589a3",
                        margin: "10px 20px",
                        fontSize: "13px",
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
              <div className="change-avatar">
                <div className="input-number-group">
                  <CiSearch className="icon-search" />
                  <input
                    type="text"
                    placeholder="Nhập url hình ảnh"
                    name="avatar"
                    value={dataUpdate.avatar}
                    onChange={handleChangeDataUpdate}
                  />
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
                          onClick={() => handleChoiceNewAvatar(item)}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="btn-find-friend flex">
                    <button onClick={() => handleShowChoiceAvatar(false)}>
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdateAvatar}
                      style={{ backgroundColor: "#0068ff", color: "white" }}
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
