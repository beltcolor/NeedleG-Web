// API 기본 URL 설정
const API_URL = 'http://localhost:5000/api';

// API 서비스 객체
const apiService = {
  // 회원가입 함수
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('needleG_token', data.token);
      localStorage.setItem('needleG_user', JSON.stringify({
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role
      }));
      localStorage.setItem('needleG_login', 'true');
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  // 로그인 함수
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('needleG_token', data.token);
      localStorage.setItem('needleG_user', JSON.stringify({
        id: data._id,
        username: data.username,
        email: data.email,
        role: data.role
      }));
      localStorage.setItem('needleG_login', 'true');
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // 프로필 조회 함수
  getProfile: async () => {
    try {
      const token = localStorage.getItem('needleG_token');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  // 사용자 이름 중복 확인 함수
  checkUsername: async (username) => {
    try {
      const response = await fetch(`${API_URL}/auth/check-username/${username}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check username error:', error);
      throw error;
    }
  },
  
  // 이메일 중복 확인 함수
  checkEmail: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/check-email/${email}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check email error:', error);
      throw error;
    }
  },
  
  // 이메일 인증 코드 전송 함수
  sendVerificationCode: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }
      
      return data;
    } catch (error) {
      console.error('Send verification code error:', error);
      throw error;
    }
  },
  
  // 인증 코드 확인 함수
  verifyCode: async (email, code) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }
      
      return data;
    } catch (error) {
      console.error('Verify code error:', error);
      throw error;
    }
  },
  
  // 로그아웃 함수
  logout: () => {
    localStorage.removeItem('needleG_token');
    localStorage.removeItem('needleG_user');
    localStorage.removeItem('needleG_login');
  }
};

// 전역으로 사용할 수 있도록 window 객체에 추가
window.apiService = apiService;
