import axios from "axios";

// User
export const userLogin = async (value) => {
  const url = "http://localhost:8080/auth/login";
  const response = await axios.post(url, value, { withCredentials: true });
  return response;
};

export const userRegister = async (value) => {
  const url = "http://127.0.0.1:8080/auth/register";
  const response = await axios.post(url, value);
  return response;
};

export const userLoginByToken = async () => {
  const url = "http://localhost:8080/auth/token";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const userLogout = async () => {
  const url = "http://localhost:8080/auth/logout";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const getFriendById = async ({ friendId }) => {
  const url = "http://localhost:8080/user/getfriendbyid";
  const response = await axios.post(
    url,
    { friendId: friendId },
    { withCredentials: true }
  );
  return response;
};

export const getFriendReq = async ({ id }) => {
  const url = "http://localhost:8080/user/getfriendreq";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const crudFriend = async (data) => {
  const url = "http://localhost:8080/user/crudfriend";
  const response = await axios.post(url, data, { withCredentials: true });
  return response;
};

export const getFriendByName = async (data) => {
  const url = "http://localhost:8080/user/getfriendbyname";
  const response = await axios.post(url, data, { withCredentials: true });
  return response;
};

export const createGroup = async (data) => {
  const url = "http://localhost:8080/group/creategroup";
  const response = await axios.post(url, data, { withCredentials: true });
  return response;
};

export const getUserByPhone = async (data) => {
  const url = "http://localhost:8080/user/getphone";
  const response = await axios.post(url, data, { withCredentials: true });
  return response;
};

export const getAllFriend = async (id) => {
  const url = "http://localhost:8080/user/getallfriend";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getAllGroup = async (id) => {
  const url = "http://localhost:8080/user/getallgroup";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getFriendRes = async (id) => {
  const url = "http://localhost:8080/user/getfriendres";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getGroupReq = async ({ userId }) => {
  const url = "http://localhost:8080/user/getgroupreq";
  const response = await axios.post(
    url,
    { id: userId },
    { withCredentials: true }
  );
  return response;
};

// Coversation
export const getAllConversation = async (id) => {
  const url = "http://localhost:8080/conversation/getallconversationbyuser";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getConversationByIdFriend = async ({ userId, friendId }) => {
  const url = "http://localhost:8080/conversation/getconversationbyfriendid";
  const response = await axios.post(
    url,
    {
      userId: userId,
      friendId: friendId,
    },
    { withCredentials: true }
  );
  return response;
};

// Message
export const getMessageByConversation = async ({ idConversation }) => {
  const url = "http://127.0.0.1:8080/message/getallmessage";
  const response = await axios.post(
    url,
    { idConversation: idConversation },
    { withCredentials: true }
  );
  return response;
};
