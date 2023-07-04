import cron from 'node-cron';

cron.schedule('*/10 * * * * *', () => {
  console.log('Running a task every 10 seconds');
});

cron.schedule('*/5 * * * *', () => {
  console.log('Running a task every 5 minutes');
});
