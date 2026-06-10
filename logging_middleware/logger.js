const axios = require('axios');

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxpdHNpbmdodG9tYXI5MUBnbWFpbC5jb20iLCJleHAiOjE3ODEwNzU0MjEsImlhdCI6MTc4MTA3NDUyMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIxNmI4NGZhLThhYmYtNDkwYi1iNWE3LTE5MTM1OWE1YzZlZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImxhbGl0IHRvbWFyIiwic3ViIjoiMzNjYzcwYzEtY2RmOC00NDFkLWFjMGYtYzJhM2ZkMjliNDQ0In0sImVtYWlsIjoibGFsaXRzaW5naHRvbWFyOTFAZ21haWwuY29tIiwibmFtZSI6ImxhbGl0IHRvbWFyIiwicm9sbE5vIjoiMjMxNTAwMTI0MiIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6IjMzY2M3MGMxLWNkZjgtNDQxZC1hYzBmLWMyYTNmZDI5YjQ0NCIsImNsaWVudFNlY3JldCI6ImVEeHRFR0JmemtaZk1CcGUifQ.XZz9aEYP0sX680Rzcym0MsnCQC3rWbot2dIf2fdJx64';

const BASE_URL = 'http://4.224.186.213/evaluation-service';

async function Log(stack, level, pkg, message) {
  try {
    const res = await axios.post(`${BASE_URL}/logs`, {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    }, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    console.log(`[${level.toUpperCase()}] [${pkg}] ${message}`);
  } catch (err) {
    console.error('Logger error:', err.response?.data || err.message);
  }
}

module.exports = { Log, ACCESS_TOKEN };