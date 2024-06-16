import axios from "axios";

// User
export const userLogin = async ({ phone, password }) => {
  const url = "https://localhost/auth/login";
  const response = await axios.post(
    url,
    { phone, password },
    { withCredentials: true }
  );
  return response;
};

export const userRegister = async ({ phone, name, password, avatar }) => {
  const url = "https://localhost/auth/register";
  const response = await axios.post(url, { phone, name, password, avatar });
  return response;
};

export const userLoginByToken = async () => {
  const url = "https://localhost/auth/token";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const userLogout = async () => {
  const url = "https://localhost/auth/logout";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const getFriendById = async ({ friendId }) => {
  const url = "https://localhost/user/getfriendbyid";
  const response = await axios.post(
    url,
    { friendId: friendId },
    { withCredentials: true }
  );
  return response;
};

export const getFriendReq = async ({ id }) => {
  const url = "https://localhost/user/getfriendreq";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const crudFriend = async ({ userId, friendId, state }) => {
  const url = "https://localhost/user/crudfriend";
  const response = await axios.post(
    url,
    { userId, friendId, state },
    { withCredentials: true }
  );
  return response;
};

export const getFriendByName = async ({ friendName, userId }) => {
  const url = "https://localhost/user/getfriendbyname";
  const response = await axios.post(
    url,
    { friendName, userId },
    { withCredentials: true }
  );
  return response;
};

export const createGroup = async ({ groupName, listMember, avatarGroup }) => {
  const url = "https://localhost/group/creategroup";
  const response = await axios.post(
    url,
    { groupName, listMember, avatarGroup },
    { withCredentials: true }
  );
  return response;
};

export const getUserByPhone = async ({ phone, id }) => {
  const url = "https://localhost/user/getphone";
  const response = await axios.post(
    url,
    { phone, id },
    { withCredentials: true }
  );
  return response;
};

export const getAllFriend = async ({ id }) => {
  const url = "https://localhost/user/getallfriend";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getAllGroup = async ({ id }) => {
  const url = "https://localhost/user/getallgroup";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getFriendRes = async ({ id }) => {
  const url = "https://localhost/user/getfriendres";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getGroupReq = async ({ userId }) => {
  const url = "https://localhost/user/getgroupreq";
  const response = await axios.post(
    url,
    { id: userId },
    { withCredentials: true }
  );
  return response;
};

export const updateAvatarById = async ({ userId, urlAvatar }) => {
  const url = "https://localhost/user/updateavatarbyid";
  const response = await axios.post(
    url,
    { userId, urlAvatar },
    { withCredentials: true }
  );
  return response;
};

// Coversation
export const getAllConversation = async ({ id }) => {
  const url = "https://localhost/conversation/getallconversationbyuser";
  const response = await axios.post(url, { id }, { withCredentials: true });
  return response;
};

export const getConversationByIdFriend = async ({ userId, friendId }) => {
  const url = "https://localhost/conversation/getconversationbyfriendid";
  const response = await axios.post(
    url,
    { userId, friendId },
    { withCredentials: true }
  );
  return response;
};

export const delConversationById = async ({ idConversation }) => {
  const url = "https://localhost/conversation/delconversation";
  const response = await axios.post(url, { idConversation: idConversation });
  return response;
};

// Message
export const getMessageByConversation = async ({ idConversation }) => {
  const url = "https://localhost/message/getallmessage";
  const response = await axios.post(
    url,
    { idConversation: idConversation },
    { withCredentials: true }
  );
  return response;
};

// Video call - Audio call
export const callUser = async ({ receiver }) => {
  const url = "https://localhost/call/videocall";
  const response = await axios.post(
    url,
    { friendId: receiver },
    { withCredentials: true }
  );
  return response;
};
