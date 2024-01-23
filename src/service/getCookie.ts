export const getCookie = (name: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const cookieArray = document.cookie.split("; ");
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }

  return null;
};

