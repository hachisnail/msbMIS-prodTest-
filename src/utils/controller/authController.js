import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Credential from '../models/Credential.js';
import LoginLog from '../models/LoginLogs.js';
import User from '../models/Users.js'

const JWT_SECRET = process.env.JWT_SECRET || 'hachsinail';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const credential = await Credential.findOne({ where: { email } });
    if (!credential) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ where: { credential_id: credential.id } });

    if (user && user.status === 'active') {
      return res.status(403).json({ message: 'Account is already active on another session' });
    }

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const existingLog = await LoginLog.findOne({
      where: { credential_id: credential.id, end: null },
    });

    if (!existingLog) {
      await LoginLog.create({
        credential_id: credential.id,
        start: new Date(),
        end: null,
      });
    }

    if (user) {
      await user.update({ status: 'active', modified_date: new Date() });
    }

    const payload = {
      id: credential.id,
      email: credential.email,
      role: credential.role,
      first_name: credential.first_name,
      last_name: credential.last_name,
      position: credential.position,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });

    res.cookie('fallback_token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'Strict',
      maxAge: 4 * 60 * 60 * 1000 // 4 hours in ms
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// logout controller in backend (logout.js)
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const credential = await Credential.findByPk(decoded.id);
    if (!credential) {
      return res.status(400).json({ message: 'User not found' });
    }

    const loginLog = await LoginLog.findOne({
      where: { credential_id: credential.id, end: null },
      order: [['start', 'DESC']],
    });

    if (loginLog) {
      await loginLog.update({ end: new Date() });
    }

    const user = await User.findOne({ where: { credential_id: credential.id } });
    if (user) {
      await user.update({ status: 'inactive', modified_date: new Date() });
    }

    // ✅ Properly clear fallback_token cookie
    res.clearCookie('fallback_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production', // set to false for local dev
    });

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const autoLogout = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const decodedToken = jwt.decode(token);
        if (decodedToken && decodedToken.id) {
          try {
            const credential = await Credential.findByPk(decodedToken.id);
            if (credential) {
              const loginLog = await LoginLog.findOne({
                where: { credential_id: credential.id, end: null },
                order: [['start', 'DESC']],
              });
              if (loginLog) {
                await loginLog.update({ end: new Date() });
              }

              const user = await User.findOne({ where: { credential_id: credential.id } });
              if (user) {
                await user.update({ status: 'inactive', modified_date: new Date() });
              }
            }
          } catch {
            // Optional: log error
          }
        }

        // ✅ Clear fallback token cookie
        res.clearCookie('fallback_token', {
          httpOnly: true,
          sameSite: 'Strict',
          secure: true, // false if you're testing locally without HTTPS
        });

        return res.status(401).json({ message: 'Session expired, you have been logged out automatically.' });
      }

      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
};



export const refreshToken = async (req, res) => {
  const token = req.cookies.fallback_token;
  if (!token) return res.status(401).json({ message: 'No fallback token found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ token });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


export const verifyCookie = (req, res) => {
  const token = req.cookies.fallback_token;

  if (!token) return res.status(401).json({ message: 'No cookie token found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired cookie token' });
  }
};
