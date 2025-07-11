// Test authentication flow
// Run with: node test-auth.js

const API_URL = 'http://localhost:3000/api/auth';

async function testRegistration() {
  console.log('Testing registration...');
  
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    })
  });

  const data = await response.json();
  console.log('Registration response:', response.status, data);
  return response.ok;
}

async function testLogin() {
  console.log('\nTesting login...');
  
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });

  const data = await response.json();
  console.log('Login response:', response.status, data);
  return response.ok;
}

async function runTests() {
  console.log('Starting authentication tests...\n');
  
  try {
    // Test registration
    await testRegistration();
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test login
    await testLogin();
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Check if server is running
fetch('http://localhost:3000')
  .then(() => runTests())
  .catch(() => console.error('Server not running. Start it with: npm run dev'));