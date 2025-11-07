export default {
  'GET /api/health': (_: any, res: any) => {
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      timestamp: Date.now(),
    });
  },
};
