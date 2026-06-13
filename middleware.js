// =============================================================
//  middleware.js  —  Razaq Habit Tracker password gate
//  SET THIS UP ONCE. You never need to edit this file again.
//
//  How it works:
//   - Vercel runs this on every request, BEFORE your page loads.
//   - It asks the browser for a password (Basic Auth popup).
//   - The real password is read from a Vercel Environment Variable
//     called SITE_PASSWORD  (set it in the Vercel dashboard).
//   - The password is NEVER written in this file or in your HTML,
//     so it can't be seen via "View Source" or dev tools.
//
//  To change the password later: just edit the SITE_PASSWORD value
//  in Vercel → Settings → Environment Variables, then redeploy.
//  (No need to touch this file or index.html.)
// =============================================================

export default function middleware(request) {
  const PASSWORD = process.env.SITE_PASSWORD || '';
  const header = request.headers.get('authorization') || '';

  if (header.startsWith('Basic ')) {
    try {
      // header looks like:  Basic base64("username:password")
      const decoded = atob(header.slice(6));        // "username:password"
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (PASSWORD && password === PASSWORD) {
        return; // ✅ correct password → let the request continue to your page
      }
    } catch (e) {
      // ignore malformed header and fall through to the 401 below
    }
  }

  // ❌ no/wrong password → ask the browser to show the login popup
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Razaq Habit Tracker", charset="UTF-8"',
    },
  });
}
