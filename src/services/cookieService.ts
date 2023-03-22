class CookieService {
  setCookie = (name: string, value: string, expiration: string) => {
    var date = new Date(expiration);
    document.cookie = name = name + "=" + (value || "") + "; Path=/; Expires=" + date.toUTCString();
  };

  getCookie = (name: string) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  };

  removeCookie = (name: string) => {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
}

export default CookieService;
