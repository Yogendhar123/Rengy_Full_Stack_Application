const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  let token;
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/signup', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should not register duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({ email: testUser.email, password: testUser.password });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({ email: testUser.email, password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not get user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).toBe(401);
    });
  });
});

describe('Contacts API', () => {
  let token;
  let contactId;

  const testUser = {
    name: 'Contact Test User',
    email: 'contacttest@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // Register and login
    await request(app).post('/api/auth/signup').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      const contact = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        company: 'ABC Corp',
        status: 'lead',
        notes: 'Test notes'
      };

      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(contact);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(contact.name);
      contactId = res.body.data._id;
    });
  });

  describe('GET /api/contacts', () => {
    it('should get all contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search contacts', async () => {
      const res = await request(app)
        .get('/api/contacts?search=John')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should filter contacts by status', async () => {
      const res = await request(app)
        .get('/api/contacts?status=lead')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/contacts/:id', () => {
    it('should get single contact', async () => {
      const res = await request(app)
        .get(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('John Doe');
    });
  });

  describe('PUT /api/contacts/:id', () => {
    it('should update contact', async () => {
      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'John Updated', status: 'prospect' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('John Updated');
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete contact', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

