  export const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookieArr = document.cookie.split(';');
  
    let cookie;
    for(let i = 0; i < cookieArr.length; i++) {
      cookie = cookieArr[i].trim();

      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    console.log('cookie',cookie);

    return null;
  }
  