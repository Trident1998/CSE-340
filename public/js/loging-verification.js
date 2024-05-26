document.addEventListener('DOMContentLoaded', () => {
    const tools = document.querySelector('#tools');
    verifyToken().then(isValid => {
        if (isValid) {
          tools.innerHTML = `
           <a href="account/account-management">Welcome Basic</a>
          <a title="Click to log out" href="account/logout">Logout</a>`
        } else {
            tools.innerHTML = `<a title="Click to log in" href="/account/login">My Account</a>`
        }
    })
  });
  
  async function verifyToken() {
    const path = location.href.substring(0, location.href.indexOf('/', 10));

    try {
      const response = await fetch('/account/verify-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        return result.valid;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to verify token:', error);
      return false;
    }
  }
  