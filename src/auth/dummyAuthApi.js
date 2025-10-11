import client from "../api/dummyClient";

const SESSION_KEY = "movie-explorer:session:v1"; 

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}
function setSession(userId) {
  if (!userId) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
}

export async function loginRequest({ username, password }) {
  const { data } = await client.get("/users", { params: { username, password } });
  const user = Array.isArray(data) ? data[0] : null;
  if (!user) throw new Error("Invalid username or password");
  setSession(user.id);
  return { user };
}

export async function registerRequest({ username, password, name }) {
  const check = await client.get("/users", { params: { username } });
  if (Array.isArray(check.data) && check.data.length) {
    throw new Error("Username is already taken");
  }
  const payload = {
    username,
    password, 
    name: name || username,
    createdAt: new Date().toISOString(),
  };
  const { data: created } = await client.post("/users", payload);
  setSession(created.id);
  return { user: created };
}

export async function meRequest() {
  const s = getSession();
  if (!s?.userId) return null;
  const { data } = await client.get(`/users/${s.userId}`);
  return data || null;
}

export function signOutRequest() {
  setSession(null);
}
