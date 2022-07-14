/* eslint-disable no-console */
const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const GitHubProfile = async (token) => {
  console.log(`MOCK INVOKED: GitHubProfile(${token})`);
  return {
    login: 'someperson',
    email: 'fakeusername@faux.net',
    cohort_id: 4,
    role: 'student'
  };
};

module.exports = { exchangeCodeForToken, GitHubProfile };
