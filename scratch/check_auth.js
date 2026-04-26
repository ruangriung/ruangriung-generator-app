
async function checkAuth() {
    try {
        const res = await fetch('http://localhost:3000/api/auth/session');
        console.log('Status:', res.status);
        console.log('Headers:', res.headers.get('content-type'));
        const text = await res.text();
        console.log('Body snippet:', text.substring(0, 100));
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

checkAuth();
