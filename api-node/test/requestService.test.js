const RequestService = require('../src/service/requestService');

describe('RequestService', () => {
  it('registerView вызывает insertRequest', async () => {
    const db = { insertRequest: jest.fn().mockResolvedValue() };
    const svc = new RequestService(db);
    await svc.registerView();
    expect(db.insertRequest).toHaveBeenCalled();
  });

  it('getStats вызывает getDateTimeAndRequests', async () => {
    const db = { getDateTimeAndRequests: jest.fn().mockResolvedValue({ currentTime: 'now', requestCount: 1 }) };
    const svc = new RequestService(db);
    const res = await svc.getStats();
    expect(db.getDateTimeAndRequests).toHaveBeenCalled();
    expect(res).toEqual({ currentTime: 'now', requestCount: 1 });
  });
}); 