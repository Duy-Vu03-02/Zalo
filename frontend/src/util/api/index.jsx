import axios from "axios";

// User
export const userLogin = async ({ phone, password }) => {
  const url = "https://192.168.41.26/auth/login";
  const response = await axios.post(
    url,
    { phone, password },
    { withCredentials: true }
  );
  return response;
};

export const userRegister = async ({ phone, name, password, avatar }) => {
  const url = "https://192.168.41.26/auth/register";
  const response = await axios.post(url, { phone, name, password, avatar });
  return response;
};

export const userLoginByToken = async () => {
  const url = "https://192.168.41.26/auth/token";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const userLogout = async () => {
  const url = "https://192.168.41.26/auth/logout";
  const response = await axios.post(url, {}, { withCredentials: true });
  return response;
};

export const getFriendById = async ({ friendId }) => {
  const url = "https://192.168.41.26/user/getfriendbyid";
  const response = await axios.post(
    url,
    { friendId: friendId },
    { withCredentials: true }
  );
  return response;
};

export const getFriendReq = async ({ id }) => {
  const url = "https://192.168.41.26/user/getfriendreq";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const crudFriend = async ({ userId, friendId, state }) => {
  const url = "https://192.168.41.26/user/crudfriend";
  const response = await axios.post(
    url,
    { userId, friendId, state },
    { withCredentials: true }
  );
  return response;
};

export const getFriendByName = async ({ friendName, userId }) => {
  const url = "https://192.168.41.26/user/getfriendbyname";
  const response = await axios.post(
    url,
    { friendName, userId },
    { withCredentials: true }
  );
  return response;
};

export const createGroup = async ({ groupName, listMember, avatarGroup }) => {
  const url = "https://192.168.41.26/group/creategroup";
  const response = await axios.post(
    url,
    { groupName, listMember, avatarGroup },
    { withCredentials: true }
  );
  return response;
};

export const getUserByPhone = async ({ phone, id }) => {
  const url = "https://192.168.41.26/user/getphone";
  const response = await axios.post(
    url,
    { phone, id },
    { withCredentials: true }
  );
  return response;
};

export const getAllFriend = async ({ id }) => {
  const url = "https://192.168.41.26/user/getallfriend";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getAllGroup = async ({ id }) => {
  const url = "https://192.168.41.26/user/getallgroup";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getFriendRes = async ({ id }) => {
  const url = "https://192.168.41.26/user/getfriendres";
  const response = await axios.post(url, { id: id }, { withCredentials: true });
  return response;
};

export const getGroupReq = async ({ userId }) => {
  const url = "https://192.168.41.26/user/getgroupreq";
  const response = await axios.post(
    url,
    { id: userId },
    { withCredentials: true }
  );
  return response;
};

export const updateAvatarById = async ({ userId, urlAvatar }) => {
  const url = "https://192.168.41.26/user/updateavatarbyid";
  const response = await axios.post(
    url,
    { userId, urlAvatar },
    { withCredentials: true }
  );
  return response;
};

// Coversation
export const getAllConversation = async ({ id }) => {
  const url = "https://192.168.41.26/conversation/getallconversationbyuser";
  const response = await axios.post(url, { id }, { withCredentials: true });
  return response;
};

export const getConversationByIdFriend = async ({ userId, friendId }) => {
  const url = "https://192.168.41.26/conversation/getconversationbyfriendid";
  const response = await axios.post(
    url,
    { userId, friendId },
    { withCredentials: true }
  );
  return response;
};

export const delConversationById = async ({ idConversation }) => {
  const url = "https://192.168.41.26/conversation/delconversation";
  const response = await axios.post(url, { idConversation: idConversation });
  return response;
};

// Message
export const getMessageByConversation = async ({ idConversation }) => {
  const url = "https://192.168.41.26/message/getallmessage";
  const response = await axios.post(
    url,
    { idConversation: idConversation },
    { withCredentials: true }
  );
  return response;
};
