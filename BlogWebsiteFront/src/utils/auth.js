export const isTokenValid = (token) => {
  if (!token) return false;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000;

  return payload.exp > currentTime;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await fetch("http://localhost:5000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Token refresh failed", error);
    return false;
  }
};
